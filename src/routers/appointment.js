const express = require("express");
const auth = require('../middleware/auth');
const Appointment = require("../models/appointment");
const User = require("../models/user");

const router = new express.Router()

router.get('/get_all_appointments', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate({
                path: 'userId',
                select: 'name',
            });

        const populatedAppointments = appointments.map(appointment => {
            return {
                _id: appointment._id,
                date: appointment.date,
                description: appointment.description,
                userName: appointment.userId ? appointment.userId.name : null,
            };
        });

        res.send({ appointments: populatedAppointments, message: 'Appoinments get successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/get_all_patient_appointments', auth, async (req, res) => {
    const { user } = req
    try {
        const appointments = await Appointment.find({ userId: user?._id });

        res.send({ appointments, message: 'Appoinments get successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/get_appointments_by_dui/:dui', auth, async (req, res) => {
    const { dui } = req.params;

    try {
        const user = await User.findOne({ dui })
        const appointments = await Appointment.find({ userId: user?._id })
            .populate({
                path: 'userId',
                select: 'name',
            });

        const populatedAppointments = appointments.map(appointment => {
            return {
                _id: appointment._id,
                date: appointment.date,
                description: appointment.description,
                userName: appointment.userId ? appointment.userId.name : null,
            };
        });


        res.send({ appointments: populatedAppointments, message: 'Appoinments get successfully', userName: user?.name });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/create_appointment', auth, async (req, res) => {
    const { user } = req;
    const { date, description, } = req.body

    try {
        const appointment = new Appointment({
            userId: user?._id,
            date,
            description,
        });

        await appointment.save()

        res.send({ appointment, message: 'Appoinment created successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});



module.exports = router