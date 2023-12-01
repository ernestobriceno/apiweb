const express = require("express");
const User = require("../models/user");
const auth = require('../middleware/auth')
const generateRandomCode = require('../helpers/generateRandomCode')

const router = new express.Router()

router.patch('/update_to_health', auth, async (req, res) => {
    const { isHealthPersonnel, userId } = req.body

    try {
        const user = await User.findOne({ _id: userId })

        const userUpdated = await User.updateOne(
            { _id: userId },
            {
                $set: {
                    ...req.body,
                    isHealthPersonnel: isHealthPersonnel ? true : user?.isHealthPersonnel,
                    healthPersonnelCode: isHealthPersonnel ? generateRandomCode() : user?.healthPersonnelCode
                }
            },
        );

        res.send({ userUpdated, message: 'user updated' })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

module.exports = router