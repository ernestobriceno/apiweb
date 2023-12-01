const express = require("express");
const User = require("../models/user");
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/auth/sign_up', async (req, res) => {
    const { password, confirmPassword } = req.body

    try {
        if (password !== confirmPassword) throw new Error('Password are different')

        const user = new User(req.body)
        await user.save()

        const token = await user.generateAuthToken()

        res.status(201).send({ user, token, message: 'successfull sign up' })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

router.post('/auth/login', async (req, res) => {
    const { email, password, healthPersonnelCode } = req.body
    try {
        const user = await User.findByCredentials(email, password, healthPersonnelCode)
        const token = await user.generateAuthToken()

        res.send({ message: 'successfull login', user, token })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

router.get('/auth/check', auth, async (req, res) => {
    const { user, token } = req
    try {
        res.send({ message: 'User is authenticated', user, token })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})


router.post('/auth/logout', auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)

        await req.user.save()
        res.send({ message: 'successfull logout' })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

router.post('/auth/logoutall', auth, async (req, res) => {

    try {
        req.user.tokens = []

        await req.user.save()
        res.send({ message: 'successfull logout' })

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

module.exports = router