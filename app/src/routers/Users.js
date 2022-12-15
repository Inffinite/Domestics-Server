const express = require('express')
const User = require('../models/UserModel')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const minioClient = require("../db/storage")
// const { sendMessage, generateCode } = require('../functions/sms')
const router = new express.Router()


router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        console.log(e)
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

// reffer a worker to a client
router.post('/refferWorker', auth, async (req, res) => {

    try {
        await User.updateOne({ "_id": req.body.id }, {
            $push: { "refferedTo": { "reffered": req.body.reffered, "refferer": req.user._id } }
        })

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
        if (req.user._id == req.body.id) {
            return res.status(400).send()
        }

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

router.post('/users/checkusername', async (req, res) => {
    try {
        const user = await User.find({ fname: req.body.fname, lname: req.body.lname })

        if (user.length == 0) {
            res.status(200).send()
        }

        res.status(400).send()
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})

router.post('/users/checkemail', async (req, res) => {
    try {
        const user = await User.find({ email: req.body.email })

        if (user.length == 0) {
            res.status(200).send()
        }

        res.status(400).send()
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})

router.post('/users/checkphone', async (req, res) => {
    try {
        const user = await User.find({ phone: req.body.phone })

        if (user.length == 0) {
            res.status(200).send()
        }

        res.status(400).send()
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    //limits: {
    //   fileSize: 1000000
    // },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
            return cb(new Error('Please upload a image file.'))
        }

        cb(undefined, true)
    }
})

router.post('/users/profileImage', auth, upload.single('image'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).toFormat('jpg').toBuffer()
    var filename = req.file.originalname

    // change image name to have specific image
    // file extension if you need to
    var extension = filename.substr(filename.indexOf('.'))

    // use jpg for now
    // might change later or never
    var imageName = `${req.user._id}.jpg`

    try {
        minioClient.putObject('domestics', imageName, buffer, req.file.size, function (err, etag) {
            if (err) return console.log(err)
            res.status(200).send()
        });
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/profileImage', auth, async (req, res) => {
    let data;
    await minioClient.getObject('domestics', `${req.user._id}.jpg`, function (e, dataStream) {
        if (e) {
            return console.log(e)
        }
        dataStream.on('data', function (chunk) {
            data = !data ? Buffer.from(chunk) : Buffer.concat([data, chunk])
        })
        dataStream.on('end', function () {
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            res.write(data)
            res.end();
        })
        dataStream.on('error', function (e) {
            console.log(e)
            res.status(500).send(e)
        })
    })
})

router.get('/users/workers', auth, async (req, res) => {
    var workers = await User.find({ isWorker: true })
        .sort({ createdAt: -1 })
        .select(["_id", "fname", "lname", "bio", "phone", "imageUrl", "tagsWorker", "reviews", "location"])

    res.status(200).send(workers)
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users/worker', auth, async (req, res) => {
    try {
        const worker = await User.find({ _id: req.query.workerid, isWorker: true })
            .select(["_id", "fname", "lname", "bio", "phone", "imageUrl", "tagsWorker", "reviews"])

        res.status(200).send(worker)
    } catch (e) {
        res.status(400).send()
    }
})

//  router.get('/myusers', async (req, res) => {
//      try {
//          const users = await User.find().sort({ isWorker: true, createdAt: -1 })
//          res.status(200).send(users)
//      } catch (e) {
//          console.log(e)
//      }

//  })

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
