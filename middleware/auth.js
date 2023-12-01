const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = (async (req, res, next) => {

    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, 'jwtpassword')
       
        const user = await User.findOne({ _id: decode._id, 'tokens.token': token })
    
        if (!user) throw new Error('User does not exist')

        req.token = token
        req.user = user

        next()

    } catch (error) {
        res.status(401).send({ error: 'Auth Error' })
    }
})

module.exports = auth
