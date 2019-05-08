const mongoose = require('mongoose')

const departmentSchema = mongoose.Schema({
    _id : mongoose.Types.ObjectId,
    name : {type: String, required: true},
    institute_id : {type: mongoose.Types.ObjectId, ref:'Admin',required:true }
})

module.exports = mongoose.model('Department',departmentSchema)