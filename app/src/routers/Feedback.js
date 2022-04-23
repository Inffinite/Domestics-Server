const express = require('express')
const User = require('../models/UserModel')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const Feedback = require('../models/Feedback')
// const { sendMessage, generateCode } = require('../functions/sms')
const router = new express.Router()

router.post('/feedback', auth, async (req, res) => {
    req.body.userId = req.user._id
    const message = new Feedback(req.body)

    try {
        await message.save()
        res.status(201).send()
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})

router.get('/feedbacks', auth, admin, async (req, res) => {
    try {
        const messages = await Feedback.find().sort({ createdAt: -1 })
        res.status(200).send(messages)
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})


module.exports = router