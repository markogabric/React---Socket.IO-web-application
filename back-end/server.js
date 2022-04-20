require("dotenv").config();
const User = require("./models/user");
const Chatroom = require("./models/chatroom");
const Question = require("./models/question");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const moment = require('moment')
const GAME_LENGTH = 10
const {addUser, removeUser, userJoinRoom, userLeaveRoom, addPoints, getUser, getUserList} = require('./utils/user.js')

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
});

mongoose.connection.on("error", (err) => {
    console.log("Mongoose Connection ERROR: " + err.message);
});

mongoose.connection.once("open", () => {
    console.log("MongoDB Connected!");
});

const app = require("./app.js");

const server = app.listen(8000, () => {
    console.log("Server listening on port 8000.");
});

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
const rooms = {}

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.query.token;
        const payload = await jwt.verify(token, process.env.SECRET)
        let user = await User.findOne({
            _id: payload._id,
            "tokens.token": token,
        })

        if(!user){
            throw new Error('Please authenticate.')
        }
        user = addUser(socket.id, payload.username)
        
        if(!user){
            throw new Error('User already in chat.')
        }
        socket.username = payload.username

        next()
    } catch (e) {
        console.log(e)
    }
})

io.on('connection', (socket) => {

    socket.on('disconnect', () => {
        removeUser(socket.id)
    })

    socket.on('joinRoom', async ({chatroomId}, callback) => {
        if (!Object.keys(rooms).includes(chatroomId)){
            const room = await Chatroom.findOne({ name: chatroomId });

            if(!room){
                return callback("Invalid room!")
            }
            rooms[chatroomId] = {
                id: chatroomId,
                timer: null,
                allQuestions: [],
                counter: 0,
                question: "",
                answers: [],
            };
            await getQuestions(chatroomId);
        }
        userJoinRoom(chatroomId, socket.username)
        socket.join(chatroomId)
        socket.emit('welcome', ({botName: process.env.BOT_NAME, chatroomId, time: moment().format('h:mm a')}))
        socket.broadcast.to(chatroomId).emit('userJoined', {botName: process.env.BOT_NAME, user: getUser(socket.username), time: moment().format('h:mm a')})
        io.to(chatroomId).emit('leaderboards', getLeaderboard(chatroomId))
        
        if(!rooms[chatroomId].timer){
            nextQuestion(rooms[chatroomId]);
            rooms[chatroomId].timer = createTimer(chatroomId);
        }
        callback()
    })

    socket.on('leaveRoom', (chatroomId) =>{
        userLeaveRoom(socket.username)
        io.to(chatroomId).emit('userLeft', {botName: process.env.BOT_NAME, user: getUser(socket.username), time: moment().format('h:mm a')})
        socket.leave(chatroomId)
        socket.broadcast.to(chatroomId).emit('leaderboards', getLeaderboard(chatroomId))
    })
    socket.on('answer', ({userId, message}) => {
        if(!message) return;
        const user = getUser(userId)
        io.to(user.chatroomId).emit('message', {user, message, time: moment().format('h:mm a')})

        const answer = message.trim().toLowerCase()
        if(rooms[user.chatroomId].answers.includes(answer)){
            handleCorrectAnswer(user.chatroomId, user.username)
        }
    })
    
})

function clearQuestion(room) {
    rooms[room].question = "";
    rooms[room].answers = [];
}

function nextQuestion(room) {
    if (!room.allQuestions[room.counter]) {
        room.counter = 0;
        getQuestions(room.id);
    }
    room.question = room.allQuestions[room.counter].question;
    room.answers = room.allQuestions[room.counter].answers;
    room.counter++;
    io.to(room.id).emit("question", {botName: process.env.BOT_NAME, question: room.question, time: moment().format('h:mm a')});
}

async function getQuestions(chatroomId) {
    rooms[chatroomId].allQuestions = await Question.find({ rooms: chatroomId });
}

function createTimer(chatroomId) {
    return setTimeout(() => {
        handleTimeExpired(chatroomId)
    }, GAME_LENGTH*1000);
}

function handleCorrectAnswer(chatroomId, username){
    clearInterval(rooms[chatroomId].timer)
    addPoints(chatroomId, username)
    io.to(chatroomId).emit('correctAnswer', {botName:process.env.BOT_NAME, user:getUser(username), answer:rooms[chatroomId].answers[0], time: moment().format('h:mm a')})
    clearQuestion(chatroomId)
    io.to(chatroomId).emit('leaderboards', getLeaderboard(chatroomId));
    setTimeout(() => {
        nextQuestion(rooms[chatroomId]);
        rooms[chatroomId].timer = createTimer(chatroomId);
    }, 5000);
}

function handleTimeExpired(chatroomId) {
    io.to(chatroomId).emit('timeExpired', {botName: process.env.BOT_NAME, answer:rooms[chatroomId].answers[0], time: moment().format('h:mm a')})
    clearQuestion(chatroomId)
    setTimeout(() => {
        nextQuestion(rooms[chatroomId])
        rooms[chatroomId].timer = createTimer(chatroomId)
    }, 5000)
}

function getLeaderboard(chatroomId){
    leaderboard = getUserList().filter((user) => user.chatroomId === chatroomId)
    return leaderboard.sort(function(a, b) {return b.points[chatroomId] - a.points[chatroomId]})
}