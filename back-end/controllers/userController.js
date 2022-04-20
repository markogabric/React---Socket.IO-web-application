const User = require('../models/user')
const validator = require('validator')
const sha256 = require('js-sha256')


exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body

        if(username.length < 3) throw "Username must be at least 3 characters long."
        if(!validator.isEmail(email)) throw "Invalid email address."
        if(password.length < 6) throw "Password must be at least 6 characters long."
        
        const userExists = await User.findOne({
            email
        })
        

        if (userExists) throw "User with that email address already exists."

        const user = new User({
            username, 
            email,
            password: sha256(password + process.env.SALT),
            tokens: []
        })

        await user.save()
        
        res.status(201).send({
            message: "User ["+ username +"] registered successfully!"
        })
    } catch (e) {
        res.status(400).json({
            message: e
        })
    }

}

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body

        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken()

        res.status(200).json({
            message: 'Login successful.',
            token
        })

    } catch (e) {
        res.status(400).json({
            message: "Login failed, please try again."
        })
    }
}

exports.auth = async (req, res) => {
    try {
        res.status(200).send({
            username: req.user.username
        })
    } catch (e) {
        res.status(401).send()
    }
}

exports.logout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
}

exports.logoutAll = async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
}