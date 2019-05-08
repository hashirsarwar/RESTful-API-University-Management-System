const express = require('express')
const Student = require('../models/student')
const checkAuth = require('../middleware/check-auth')
const mongoose = require('mongoose')
const Department = require('../models/department')
const Degree = require('../models/degree')
const bcrypt = require('bcrypt')

const router = express.Router()

router.get('/', checkAuth, (req, res, next) => {
    Student.find({ institute_id: req.adminData.id }, (err, result) => {
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
        else 
        {
            var deptID
            var degreeID
            Department.find({ name: new RegExp('^'+req.body.department+'$','i'), institute_id: req.adminData.id }, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    })
                }
                else {
                    if (result.length == 0) {
                        return res.status(400).json({
                            message: 'Invalid Department'
                        })
                    }

                    else {
                        deptID = result[0]._id
                        Degree.find({ degreeName: new RegExp('^'+req.body.degree+'$','i'), institute_id: req.adminData.id, department: deptID,degreeType:req.body.degreeType}, (err, result) => {
                            if (err) {
                                return res.status(500).json({
                                    error: err
                                })
                            }
                            else {
                                if (result.length == 0) {
                                    return res.status(400).json({
                                        message: 'Invalid Degree'
                                    })
                                }
                                else {
                                    degreeID = result[0]._id
                                    /* check if unique (ignoring case) */
                                    Student.find({email:req.body.email,institute_id:req.adminData.id},(err,reslt)=>{
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
                                                const student = new Student({
                                                    _id: new mongoose.Types.ObjectId(),
                                                    fname: req.body.fname,
                                                    lname: req.body.lname,
                                                    roll: req.body.roll,
                                                    email: req.body.email,
                                                    password: hash,
                                                    phone: req.body.phone,
                                                    department: deptID,
                                                    degreeType: req.body.degreeType,
                                                    degree: degreeID,
                                                    batch: req.body.batch,
                                                    institute_id: req.adminData.id
                                                })
                                                console.log(student)
                                                student.save((err) => {
                                                    if (err) {
                                                        return res.status(500).json({
                                                            error: err
                                                        })
                                                    }
                                                    else {
                                                        return res.status(200).json({
                                                            message: 'Student registered'
                                                        })
                                                    }
                                                })
                                            }
                                            else
                                            {
                                                res.status(409).json({
                                                    error:'Student already exists'
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
    })
})

router.get('/:studentID', checkAuth, (req, res, next) => {
    const id = req.params.studentID
    Student.find({ _id: id, institute_id: req.adminData.id }, (err, result) => {
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

module.exports = router