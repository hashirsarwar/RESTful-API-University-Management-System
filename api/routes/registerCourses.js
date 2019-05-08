const express = require('express')
const checkStudentAuth = require('../middleware/checkAuthStudent')
const Student = require('../models/student')
const Course = require('../models/course')
const assignCourse = require('../models/assignCourse')
const registerCourse = require('../models/registerCourse')
const mongoose = require('mongoose')
const router = express.Router()

router.get('/', checkStudentAuth, (req, res, next) => {

    const id = req.studentData.id
    var insID
    var degID
    Student.find({ _id: id }, (err, result) => {
        if (err) {
            res.status(500).json({
                error: err
            })
        }
        else {

            insID = result[0].institute_id
            degID = result[0].degree
            Course.find({ degree: degID, institute_id: insID }, '_id', (err2, result2) => {
                if (err2) {
                    res.status(500).json({
                        error: err2
                    })
                }
                else {
                    registerCourse.find({ student: id }, '-_id courseDetail', (err3, result3) => {
                        if (err3) {
                            res.status(500).json({
                                error: err3
                            })
                        }
                        else {
                            var arr = []
                            for (var i = 0; i < result3.length; i++) {
                                arr[i] = result3[i].courseDetail
                            }

                            assignCourse.find({ _id: { $in: arr } }, '-_id course', (err4, result4) => {
                                if (err4) {
                                    res.status(500).json({
                                        error: err4
                                    })
                                }
                                else {
                                    var available = []
                                    for (var i = 0; i < result2.length; i++) {
                                        available[i] = result2[i]._id.toString()
                                    }
                                    var registered = []
                                    for (var i = 0; i < result4.length; i++) {
                                        registered[i] = result4[i].course.toString()
                                    }
                                    var IDarr = diff(available,registered)
                                    Course.find({_id:{$in:IDarr}},(err5,result5)=>{
                                        if(err5)
                                        {
                                            res.status(500).json({
                                                error:err5
                                            })
                                        }
                                        else
                                        {
                                            res.status(200).json(result5)
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})
function diff(arr1,arr2)
{
    var result = []
    for(var i = 0; i < arr1.length; i++)
        if(arr2.indexOf(arr1[i])===-1)
            result.push(arr1[i])
    return result;
}

router.post('/:courseID', checkStudentAuth, (req, res, next) => {
    const section = req.body.section
    const courseID = req.params.courseID

    assignCourse.find({ course: courseID, section: section }, (err, result) => {
        if (err) {
            res.status(500).json({
                error: err
            })
        }
        else {
            if (result.length == 0) {
                res.status(404).json({
                    error: 'Invalid Course'
                })
            }
            else {
                if (result[0].enrolledStudents < result[0].studentLimit) {
                    const regCourse = new registerCourse({
                        _id: new mongoose.Types.ObjectId(),
                        student: req.studentData.id,
                        courseDetail: result[0]._id
                    })
                    console.log(regCourse)
                    regCourse.save((err) => {
                        if (err) {
                            res.status(500).json({
                                error: err
                            })
                        }
                        else {
                            assignCourse.updateOne(
                                { _id: result[0]._id }, { $set: { enrolledStudents: result[0].enrolledStudents + 1 } },
                                (err, result) => {
                                    if (err) {
                                        res.status(500).json({
                                            error: err
                                        })
                                    }
                                })
                            res.status(200).json({
                                message: 'Course registered'
                            })
                        }
                    })
                }
                else {
                    res.status(500).json({
                        message: 'No seat available'
                    })
                }
            }
        }
    })
})

router.delete('/:registrationID', (req, res, next) => {
    registerCourse.findById(registrationID, (err, result) => {
        if (err) {
            res.status(500).json({
                error: err
            })
        }
        else {
            registerCourse.remove({ _id: req.params.registrationID }, (err) => {
                if (err) {
                    res.status(500).json({
                        error: err
                    })
                }
                else {
                    assignCourse.findById(result[0].courseDetail, (err, result2) => {
                        assignCourse.updateOne(
                            { _id: result2[0]._id }, { $set: { enrolledStudents: result2[0].enrolledStudents - 1 } },
                            (err, reslt) => {
                                if (err) {
                                    res.status(500).json({
                                        error: err
                                    })
                                }
                            })
                    })
                }
            })
        }
    })
})

module.exports = router