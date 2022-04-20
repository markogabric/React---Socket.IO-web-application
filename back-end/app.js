const express = require("express")
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.use('/user', require('./routes/user'))

module.exports = app