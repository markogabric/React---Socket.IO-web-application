const router = require("express").Router()
const chatroomController = require('../controllers/chatroomController.js')

router.get('/chatrooms', chatroomController.chatrooms)
router.post('/question', chatroomController.question)
module.exports = router