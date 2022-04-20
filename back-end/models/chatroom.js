const mongoose = require('mongoose')

const chatroomSchema = mongoose.Schema({
    name: {
        type: String
    },
    image:{
        type: String
    }
})

const Chatroom = mongoose.model("Chatroom", chatroomSchema)
module.exports = Chatroom