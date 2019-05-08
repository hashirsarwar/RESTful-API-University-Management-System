const mongoose = require('mongoose')

const courseSchema = mongoose.Schema({
    _id : mongoose.Types.ObjectId,
    course_code : {type: String, required: true},
    title : {type: String, required: true, unique: true},
    credit_hrs : {type: Number, required:true},
    degree : {type : mongoose.Types.ObjectId, ref: 'Degree',required:true},
    institute_id : {type: mongoose.Types.ObjectId, ref:'Admin',required:true }
})

module.exports = mongoose.model('Course',courseSchema)