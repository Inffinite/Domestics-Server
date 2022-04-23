const AdminModel = require('../models/AdminModel')

const admin = async (req, res, next) => {
    try{
        const isAdmin = await AdminModel.find({ adminId: req.user._id })
        
        if(isAdmin.length <= 0){
            throw new Error()
        } else {
            next()
        }
    }catch(e){
        res.status(401).send({ error: 'This does not concern you human.' })
    }
}

module.exports = admin