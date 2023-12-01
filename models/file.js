const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    data: {
        type: String,
        require: true,
    },
})

fileSchema.pre('save', async function (next) {

    next()
})

const File = mongoose.model('File', fileSchema)

module.exports = File