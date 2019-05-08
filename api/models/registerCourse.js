const mongoose = require('mongoose')

const registerCourseSchema = mongoose.Schema({
    _id : mongoose.Types.ObjectId,
    student: {type: mongoose.Types.ObjectId,ref:'Student',required:true},
    courseDetail : {type: mongoose.Types.ObjectId,ref: 'assignCourse', required: true,unique: true}
})

module.exports = mongoose.model('registerCourse',registerCourseSchema)