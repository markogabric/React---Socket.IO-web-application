const Chatroom = require('../models/chatroom')
const Question = require('../models/question')

exports.chatrooms = async (req, res) => {
    try {
        const chatrooms = await Chatroom.find()
        res.json(chatrooms)
    } catch (e) {
        res.send(e)
    }
}

exports.question = async(req, res) => {
    console.log(req.body)
    try {
        const question = new Question({
            question: req.body.question,
            answers: req.body.answers.split(', '),
            rooms: req.body.rooms.split(', ')
        })
        await question.save()
        res.json(question)
    } catch (e) {
        res.json(e)
    }
}