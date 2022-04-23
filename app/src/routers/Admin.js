const express = require('express')
const AdminModel = require('../models/AdminModel')
const auth = require('../middleware/auth')
const UserModel = require('../models/UserModel')
const admin = require('../middleware/admin')
// const { sendMessage, generateCode } = require('../functions/sms')
const router = new express.Router()

router.post('/adminperson', auth, admin, async (req, res) => {
    const admin = new AdminModel(req.body)

    try {
        await admin.save()
        res.status(201).send()
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})

router.get('/admin/allUsers', auth, admin, async (req, res) => {
    try {
        const all = await UserModel.find().sort({ createdAt: -1 })
        res.status(200).send(all)
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})

module.exports = router