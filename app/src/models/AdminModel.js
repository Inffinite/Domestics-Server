const mongoose = require('mongoose')
const adminSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
}, {
    timestamps: true
})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin