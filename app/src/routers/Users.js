const express = require('express')
const UserModel = require('../models/UserModel')
const auth = require('../middleware/auth')
// const { sendMessage, generateCode } = require('../functions/sms')
const router = new express.Router()

router.get('/', async (req, res) => {
    res.status(200).send("Heyoooo")
})

// router.post('/users', async (req, res) => {
//     const user = new UserModel(req.body)
//     // console.log(user) dc

//     try {
//         const otpCode = await generateCode()
//         const token = await user.generateAuthToken()
//         // user.otpCode = otpCode
//         await user.save()
//         res.status(201).send({ user, token })
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

router.get('/users', async (req, res) => {
    // sendMessage('Fuck you man!')
    const users = await UserModel.find()

    if(!users){
        res.status(400).send("No users found")
    }

    res.status(200).send(users)
})

router.get('/sendMessage', async (req, res) => {
    // sendMessage('Fuck you man!')
    res.status(200).send()
})

// generate otp

module.exports = router
