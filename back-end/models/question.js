const mongoose = require('mongoose')

const questionSchema = mongoose.Schema({
    question: {
        type: String,
    },
    answers: [],
    rooms: []
})

const Question = mongoose.model("Question", questionSchema)

module.exports = Question