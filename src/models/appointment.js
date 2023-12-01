const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    date: {
        type: Date,
        require: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    description: {
        type: String,
    },
})

appointmentSchema.pre('save', async function (next) {

    next()
})

const Appointment = mongoose.model('Appointment', appointmentSchema)

module.exports = Appointment