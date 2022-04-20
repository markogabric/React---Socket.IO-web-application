import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import "../styles/chatroom.css";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import Message from "../components/Message.js";
import User from "../components/User.js";
import LinearProgress from "@material-ui/core/LinearProgress";
import SendIcon from "@material-ui/icons/Send";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Link } from "react-router-dom";
const GAME_LENGTH = 10;
const useStyles = makeStyles((theme) => ({
    input: {
        width: "100%",
        paddingLeft: "10px",
        padding: "10px",
        marginTop: "10px",
        fontFamily: '"Source Sans Pro", sans-serif',
        backgroundColor: "var(--input)",
        borderRadius: "15px",
        marginBottom: "20px",
        marginRight: "20px",
        marginLeft: "20px",
        color: "white",
    },

    placeholder: {
        "&::placeholder": {
            color: "white",
            fontStyle: "italic",
        },
    },

    button: {
        height: "50px",
        marginRight: "20px",
    },
}));
const ChatroomPage = ({ props, socket }) => {
    const classes = useStyles();
    const chatroomId = props.match.params.id;
    const [userId, setUserId] = React.useState("");
    const messageRef = React.createRef();
    const [question, setQuestion] = React.useState(
        "Waiting for next question..."
    );
    const [messages, setMessages] = React.useState([]);
    const [timeLeft, setTimeLeft] = React.useState(0);
    const [leaderboard, setLeaderboard] = React.useState([]);
    const messagesEndRef = React.createRef();

    React.useEffect(() => {
        const token = localStorage.getItem("AUTH_TOKEN");

        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUserId(payload.username);
        }
    }, [socket]);

    React.useEffect(() => {
        if (socket) {
            socket.emit("joinRoom", { chatroomId }, (error) => {
                if (error) {
                    alert(error);
                }
            });
        }
        return () => {
            if (socket) {
                socket.emit("leaveRoom", chatroomId);
            }
        };
        //eslint-disable-next-line
    }, [socket]);

    React.useEffect(() => {
        if (socket) {
            socket.on("message", ({ user, message, time }) => {
                const newMessage = {
                    username: user.username,
                    color: user.color,
                    messageElement: <span className="userMessageText">{message}</span>,
                    time,
                    isAdmin: false,
                };
                setMessages((messages) => [...messages, newMessage]);
            });

            socket.on("question", ({ botName, question, time }) => {
                const newMessage = {
                    username: botName,
                    messageElement: <span className="questionMessageText">{question}</span>,
                    time,
                    isAdmin: true,
                };

                setMessages((messages) => [...messages, newMessage]);
                setQuestion(question);
                setTimeLeft(GAME_LENGTH);
            });
            socket.on("timeExpired", ({ botName, answer, time }) => {
                const newMessage = {
                    username: botName,
                    messageElement: (
                        <span className="timeExpiredMessageText">
                            Time expired! The correct answer was{" "}
                            <span className="correctAnswerSpan">{answer}</span>.
                        </span>
                    ),
                    time,
                    isAdmin: true,
                };
                setMessages((messages) => [...messages, newMessage]);
                setQuestion("Waiting for next question...");
                setTimeLeft(0);
            });

            socket.on("correctAnswer", ({ botName, user, answer, time }) => {
                const newMessage = {
                    username: botName,
                    messageElement: (
                        <span className="correctAnswerMessageText">
                            <span style={{ color: user.color, fontWeight: "bold" }}>
                                {user.username}
                            </span>{" "}
              has answered correctly! The correct answer was{" "}
                            <span className="correctAnswerSpan">{answer}</span>.
                        </span>
                    ),
                    time,
                    isAdmin: true,
                };
                setMessages((messages) => [...messages, newMessage]);
                setQuestion("Waiting for next question...");
                setTimeLeft(0);
            });

            socket.on("userJoined", ({ botName, user, time }) => {
                const newMessage = {
                    username: botName,
                    messageElement: (
                        <span className="userJoinedMessage">
                            <span style={{ color: user.color, fontWeight: "bold" }}>
                                {user.username}
                            </span>{" "}
              has joined the room!
                        </span>
                    ),
                    time,
                    isAdmin: true,
                };
                setMessages((messages) => [...messages, newMessage]);
            });

            socket.on("userLeft", ({ botName, user, time }) => {
                const newMessage = {
                    username: botName,
                    messageElement: (
                        <span className="userLeftMessage">
                            <span style={{ color: user.color, fontWeight: "bold" }}>
                                {user.username}
                            </span>{" "}
              has left the room!
                        </span>
                    ),
                    time,
                    isAdmin: true,
                };
                setMessages((messages) => [...messages, newMessage]);
            });

            socket.on("welcome", ({ botName, chatroomId, time }) => {
                const newMessage = {
                    username: botName,
                    messageElement: (
                        <span className="welcomeMessage">
                            Welcome to #{chatroomId}! Please wait until the next question to
              start playing...
                        </span>
                    ),
                    time,
                    isAdmin: true,
                };

                setMessages((messages) => [...messages, newMessage]);
            });

            socket.on("leaderboards", (users) => {
                setLeaderboard(users);
            });

            return () => {
                socket.removeAllListeners();
            };
        }
    }, [socket]);

    React.useEffect(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "auto" });
        // eslint-disable-next-line
    }, [messages]);

    React.useEffect(() => {
        if (!timeLeft) return;

        const gameTimer = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => {
            clearInterval(gameTimer);
        };
    }, [timeLeft]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (socket && messageRef.current.value) {
            const message = messageRef.current.value;
            messageRef.current.value = "";
            socket.emit("answer", { userId, message });
        }
    };

    return (
        <div className="chatroomPage">
            <div className="chatroomHeader">
                <span className="chatroomName">#{chatroomId}</span>
                <Link to="/dashboard">
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                    >
                        Leave Room
                    </Button>
                </Link>
            </div>
            <div className="chatroomBody">
                <div className="chatroomLeaderboards">
                    <div className="usersInRoom"><span className="userCounter">{leaderboard.length}</span>users in room:</div>
                    <div className="userList">
                        {leaderboard.map((user) => (
                            <User user={user} key={user.username} chatroomId={chatroomId}></User>
                        ))}
                    </div>
                </div>
                <div className="chatContent">
                    <div className="questionTimer">
                        <span className="question">{question}</span>
                        <h1 className="timer">{timeLeft}</h1>
                    </div>
                    <LinearProgress
                        variant="determinate"
                        value={(timeLeft * 100) / GAME_LENGTH}
                    ></LinearProgress>
                    <div className="chatMessages">
                        {messages.map((message, i) => (
                            <Message
                                username={message.username}
                                color={message.color}
                                time={message.time}
                                isAdmin={message.isAdmin}
                                key={i}
                            >
                                {message.messageElement}
                            </Message>
                        ))}
                        <div ref={messagesEndRef}></div>
                    </div>
                    <div className="messageInput">
                        <form onSubmit={sendMessage} autoComplete="off">
                            <Input
                                className={classes.input}
                                classes={{ input: classes.placeholder }}
                                type="text"
                                name="message"
                                id="message"
                                inputRef={messageRef}
                                placeholder="Send answer..."
                                label="Filled"
                                disableUnderline
                                startAdornment={
                                    <InputAdornment position="start">
                                        <SendIcon />
                                    </InputAdornment>
                                }
                            ></Input>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatroomPage;