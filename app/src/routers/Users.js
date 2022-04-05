const express = require('express')
const User = require('../models/UserModel')
const auth = require('../middleware/auth')
// const { sendMessage, generateCode } = require('../functions/sms')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// delete a review with the review id
// user can only delete their own review
// reviewed_user_id is the id of the user who got reviewed
// review_id is the id of the review itself
router.post('/reviews/delete', auth, async (req, res) => {
    try {
        await User.updateOne({ _id: req.body.reviewed_user_id }, {
            $pull: { reviews: { _id: req.body.review_id, "reviewer_id": req.user._id } }
        })

        res.status(200).send()
    } catch (e) {
        res.status(400).send(e)
    }
})

// delete a tag by its id
router.post('/clientTag/delete', auth, async (req, res) => {
    try {
        await User.updateOne({ _id: req.user._id }, {
            $pull: { "tagsClient": { _id: req.body.tag_id } }
        })

        res.status(200).send()
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/workerTag/delete', auth, async (req, res) => {
    try {
        await User.updateOne({ _id: req.user._id }, {
            $pull: { "tagsWorker": { _id: req.body.tag_id } }
        })

        res.status(200).send()
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/addClientTags', auth, async (req, res) => {

    try {
        const tags = req.body.tags

        // loop through the submitted tags
        // and add them to the database
        for (let i = 0; i < tags.length; i++) {
            await User.updateOne({ "_id": req.user._id }, {
                $push: { "tagsClient": { "tag": tags[i] } }
            })
        }

        res.status(201).send()
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/addWorkerTags', auth, async (req, res) => {

    try {
        const tags = req.body.tags

        // loop through the submitted tags
        // and add them to the database
        for (let i = 0; i < tags.length; i++) {
            await User.updateOne({ "_id": req.user._id }, {
                $push: { "tagsWorker": { "tag": tags[i] } }
            })
        }

        res.status(201).send()
    } catch (e) {
        res.status(400).send(e)
    }
})

// add a new review to a worker
// cannot edit or delete review after adding it
router.post('/users/review', auth, async (req, res) => {
    try {
        // a user cannot review himself
        // if(req.user._id == req.body.id){
        //     return res.status(400).send()
        // }

        const user = await User.findById(req.body.id)

        if (!user) {
            res.status(400).send()
        }

        var review = req.body.review
        review.reviewer_id = req.user._id

        await User.updateOne({ "_id": req.body.id }, {
            $push: { "reviews": review }
        })

        res.status(201).send()
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['fname', 'lname', 'email', 'isWorker', 'bio', 'phone', 'imageUrl', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/sendMessage', async (req, res) => {
    // sendMessage('Fuck you man!')
    res.status(200).send()
})

// generate otp

module.exports = router
