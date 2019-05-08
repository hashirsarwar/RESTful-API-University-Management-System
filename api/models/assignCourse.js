const mongoose = require('mongoose')

const assignCourseSchema = mongoose.Schema({
    _id : mongoose.Types.ObjectId,
    instructor: {type: mongoose.Types.ObjectId, ref: 'Instructor', required: true},
    course: {type: mongoose.Types.ObjectId, ref:'Course',required: true},
    section : {type: String, required: true},
    studentLimit: {type: Number, required: true},
    enrolledStudents: {type: Number, required:true}
})

module.exports = mongoose.model('assignCourse',assignCourseSchema)