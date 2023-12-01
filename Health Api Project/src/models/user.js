const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
    },
    dui: {
        type: String,
        default: null,
    },
    phone: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid mail')
            }
        }
    },
    password: {
        type: String,
        require: true,
        trim: true,
        minLength: [8, 'Min 8 characters'],
        validate(value) {
            if (value.includes('12345678')) {
                throw new Error('Password not allowed')
            }
        }
    },
    isHealthPersonnel: {
        type: Boolean,
        default: false,
    },
    healthPersonnelCode: {
        type: String,
        default: null,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, 'jwtpassword')

    this.tokens = this.tokens.concat({ token })
    await this.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password, healthPersonnelCode) => {
    const user = await User.findOne({ email })

    if (!user) throw new Error('Invalid credentials')

    if (user?.isHealthPersonnel && !healthPersonnelCode)
        throw new Error('You did not send the code');

    if (user?.isHealthPersonnel && healthPersonnelCode !== user?.healthPersonnelCode)
        throw new Error('Invalid code');


    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) throw new Error('Invalid credentials')

    return user
}


userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User