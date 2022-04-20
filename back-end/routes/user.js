const router = require("express").Router()
const auth = require('../middlewares/auth.js')
const userController = require('../controllers/userController')
const chatroomController = require('../controllers/chatroomController.js')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/auth', auth, userController.auth)
router.post('/logout', auth, userController.logout)
router.post('/logoutAll', auth, userController.logoutAll)

router.get('/chatrooms', chatroomController.chatrooms)
router.post('/question', chatroomController.question)

module.exports = router