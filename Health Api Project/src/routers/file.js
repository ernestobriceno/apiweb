const express = require("express");
const auth = require('../middleware/auth');
const File = require("../models/file");
const User = require("../models/user");
const checkFileSize = require("../middleware/checkFileSize");

const router = new express.Router()

router.get('/files/:dui', auth, async (req, res) => {
    const { dui } = req.params;

    try {
        const user = await User.findOne({ dui })
        const files = await File.find({ userId: user?._id });

        res.send({ files, message: 'Files get successfully', user });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/upload_file', auth, checkFileSize, async (req, res) => {
    const { user } = req;
    const { name, data, } = req.body

    try {
        const file = new File({
            userId: user?._id,
            name,
            data,
        });

        await file.save()

        res.send({ file, message: 'File uploaded successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});



module.exports = router