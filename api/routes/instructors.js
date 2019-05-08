const express = require('express')
const Instructor = require('../models/instructor')
const checkAuth = require('../middleware/check-auth')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const assignCourse = require('../models/assignCourse')
const Course = require('../models/course')
const Degree = require('../models/degree')

const router = express.Router()

router.get('/', checkAuth, (req, res, next) => {
    Instructor.find({ institute_id: req.adminData.id }, (err, result) => {
        if (err) {
            res.status(500).json({
                error: err
            })
        }
        else {
            res.status(200).json(result)
        }
    })
})

router.post('/add', checkAuth, (req, res, next) => {

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            })
        }
        else {
            /* check if unique (ignoring case) */

            Instructor.find({email:req.body.email,institute_id:req.adminData.id},(err,reslt)=>{
                if(err)
                {
                    res.status(500).json({
                        error:err
                    })
                }
                else
                {
                    if(reslt.length==0)
                    {
                        const instr = new Instructor({
                            _id: new mongoose.Types.ObjectId(),
                            fname: req.body.fname,
                            lname: req.body.lname,
                            email: req.body.email,
                            password: hash,
                            phone: req.body.phone,
                            institute_id: req.adminData.id
                        })
                        console.log(instr)
                        instr.save((err) => {
                            if (err) {
                                return res.status(500).json({
                                    error: err
                                })
                            }
                            else {
                                res.status(200).json({
                                    message: 'Instructor registered'
                                })
                            }
                        })
                    }
                    else
                    {
                        res.status(409).json({
                            error:'already exists'
                        })
                    }
                    
                }
            })
            
        }
    })
})

router.get('/:instructorID', checkAuth, (req, res, next) => {
    const id = req.params.instructorID
    Instructor.find({ _id: id, institute_id: req.adminData.id }, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err
            })
        }
        else {
            if (result.length == 0) {
                return res.status(404).json({
                    error: 'Page not found'
                })
            }
            else {
                res.status(200).json(result[0])
            }
        }
    })
})

router.post('/:instructorID/assign', checkAuth, (req, res, next) => {

    const id = req.params.instructorID
    Instructor.find({ _id: id, institute_id: req.adminData.id }, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err
            })
        }
        else {
            if (result.length == 0) {
                return res.status(404).json({
                    error: 'Page not found'
                })
            }
            else {
                Degree.find({ institute_id: req.adminData.id, degreeName: req.body.degreeName, degreeType: req.body.degreeType }, (err, result1) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    }
                    else {
                        if (result1.length == 0) {
                            res.status(404).json({
                                message: 'Invalid degree'
                            })
                        }
                        else {
                            Course.find({ title: req.body.course, institute_id: req.adminData.id, degree:result1[0]._id}, (err, result) => {
                                if (err) {
                                    return res.status(500).json({
                                        error: err
                                    })
                                }
                                else {
                                    if (result.length == 0) {
                                        return res.status(404).json({
                                            error: 'Course not found'
                                        })
                                    }
                                    else {
                                        assignCourse.find({instructor:id,course:result[0]._id},(err,reslt)=>{
                                            if(err)
                                            {
                                                res.status(500).json({
                                                    error:err
                                                })
                                            }
                                            else
                                            {
                                                if(reslt.length==0)
                                                {
                                                    const assign = new assignCourse({
                                                        _id: new mongoose.Types.ObjectId(),
                                                        instructor: id,
                                                        course: result[0]._id,
                                                        section: req.body.section,
                                                        studentLimit: req.body.studentLimit,
                                                        enrolledStudents: 0
                                                    })
                                                    assign.save((err) => {
                                                        if (err) {
                                                            return res.status(500).json({
                                                                error: err
                                                            })
                                                        }
                                                        else {
                                                            return res.status(200).json({
                                                                message: 'Course assigned'
                                                            })
                                                        }
                                                    })
                                                }
                                                else
                                                {
                                                    res.status(409).json({
                                                        error:'Already assigned'
                                                    })
                                                }
                                                
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }
                })
            }
        }
    })
})

router.get('/:instructorID/assign', checkAuth, (req, res, next) => {
    const id = req.params.instructorID
    assignCourse.find({ instructor: id }, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err
            })
        }
        else {
            if (result.length == 0) {
                return res.status(200).json({
                    message: 'No course assigned'
                })
            }
            else {
                return res.status(200).json(result)
            }
        }
    })
})

module.exports = router