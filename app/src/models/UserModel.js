const mongoose = require('mongoose')
const validator = require('validator')
const chalk = require('chalk')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const bcryptjs = require('bcryptjs')
const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    lname: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        // validate(value) {
        //     if (!validator.isEmail(value)) {
        //         throw new Error('Invalid Email.')
        //     }
        // }
    },

    location: {
        type: String,
        default: "Nairobi, Kenya",
    },

    bio: {
        type: String,
        required: true,
        trim: true
    },

    isWorker: {
        type: Boolean,
        default: false
    },

    // tags a worker works under
    tagsWorker: [{
        tag: {
            type: String
        }
    }],

    // tags a client is searching for
    tagsClient: [{
        tag: {
            type: String
        }
    }],

    reviews: [{
        reviewer_id: {
            type: String,
        },

        message: {
            type: String,
        },

        starsCount: {
            type: String,
        }
    }, {
        timestamps: true,
    }],

    refferedTo: [{
        // the person being reffered
        reffered: {
            type: String
        },

        // the person doing the reffering
        refferer: {
            type: String
        },
    }, {
        timestamps: true,
    }],

    phone: {
        type: String,
        // minlength: 7,
        trim: true,
        // validate(value) {
        //     if (value.toLowerCase().includes('password')) {
        //         throw new Error('Password cannot contain "password"')
        //     }
        // }
    },

    email: {
        type: String,
        trim: true
    },

    password: {
        type: String,
        trim: true
    },

    imageUrl: {
        type: String,
        trim: true
        // validate(value) {
        //     if (value < 0) {
        //         throw new Error('Age a must be positive number.')
        //     }
        // }
    },

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }, {
        timestamps: true,
    }]
}, {
    timestamps: true
})

// userSchema.virtual('tasks', {
//     ref: 'Task',
//     localField: '_id',
//     foreignField: 'owner'
// })

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email })

    if (!user) {
        throw new Error('Unable to login.')
    }

    const isMatch = await bcrypt.compareSync(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login.')
    }

    return user
}

//hash plaintext password before saving
userSchema.pre('save', async function (next) {
    const user = this

    try {
        if (user.isModified('password')) {
            const salt = bcrypt.genSaltSync(10)
            user.password = await bcrypt.hashSync(user.password, salt)
        }
    } catch (e) {
        console.log(e)
    }

    next()
})

// Delete user tasks when the user is removed

// userSchema.pre('remove', async function (next) {
//     const user = this
//     await Task.deleteMany({ owner: user._id })
//     next()
// })

const User = mongoose.model('User', userSchema)

module.exports = User