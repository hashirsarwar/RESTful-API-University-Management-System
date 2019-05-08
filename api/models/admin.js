const mongoose = require('mongoose')

const adminSchema = mongoose.Schema({
    _id : mongoose.Types.ObjectId,
    email : {type: String, required: true, unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password : {type: String, required: true},
    institute_name : {type: String, required: true}
})

module.exports = mongoose.model('Admin',adminSchema)