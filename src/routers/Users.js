const express = require('express')
const UserModel = require('../models/UserModel')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new UserModel(req.body)

    try{
        await user.save()
        res.status(201).send({ user, token })
    } catch(e){
        res.status(400).send(e)
    }
})

module.exports = router
