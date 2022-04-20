const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const sha256 = require('js-sha256')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: 'Username is required!'
    },

    email: {
        type:String,
        required: 'Email is required!',
        unique: true
    },

    password: {
        type: String,
        required: 'Password is required!'
    },

    tokens: [{
        token: {
            type: String,
        }
    }]
},
{
    timestamps: true,
}
)

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString(), username: user.username}, process.env.SECRET)

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}


userSchema.statics.findByCredentials = async (email, password) => {    
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Wrong credentials.')
    }

    const isMatch = user.password === sha256(password + process.env.SALT)

    if(!isMatch){
        throw new Error('Wrong credentails.')
   }
    
    return user
}

const User = mongoose.model('User', userSchema)
module.exports = User