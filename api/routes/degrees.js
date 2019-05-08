const express = require('express')
const Degree = require('../models/degree')
const mongoose = require('mongoose')
const Department = require('../models/department')
const checkAuth = require('../middleware/check-auth')

const router = express.Router()

router.get('/', checkAuth, (req, res, next) => {
    Degree.find({ institute_id: req.adminData.id }, (err, result) => {
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

    var deptID

    Department.find({ name: new RegExp('^'+req.body.department+'$','i') , institute_id: req.adminData.id }, (err, result) => {

        if (err) {
            res.status(500).json({
                error: err
            })
        }
        else 
        {
            if (result.length == 0) 
            {
                res.status(401).json({
                    message: 'Invalid department'
                })
            }
            else {
                deptID = result[0]._id
                /* check if unique (ignoring case) */

                Degree.find({degreeName:req.body.degreeName,degreeType:req.body.degreeType,institute_id:req.adminData.id},(err,reslt)=>{
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
                            const degree = new Degree({
                                _id: new mongoose.Types.ObjectId(),
                                degreeType: req.body.degreeType,
                                degreeName: req.body.degreeName,
                                department: deptID,
                                institute_id: req.adminData.id
                            })
                            console.log(degree)
                            degree.save((err) => {
                                if (err) {
                                    res.status(500).json({
                                        error: err
                                    })
                                }
                                else {
                                    res.status(200).json({
                                        message: 'Degree Added'
                                    })
                                }
                            })
                        }
                        else
                        {
                            res.status(409).json({
                                error:'Degree already exists'
                            })
                        }
                        
                    }
                })
                
            }
        }
    })
})
router.delete('/:degreeID', checkAuth, (req, res, next) => {
    const id = req.params.degreeID
    Degree.remove({ _id: id, institute_id: req.adminData.id }, (err) => {
        if (err) {
            res.status(404).json({
                error: err
            })
        }
        else {
            res.status(200).json({
                message: 'Degree deleted'
            })
        }
    })
})

router.get('/:degreeID',checkAuth,(req, res)=>{
    const id = req.params.degreeID
    Degree.find({_id:id,institute_id:req.adminData.id},(err, result)=>{
        if(err)
        {
            res.status(404).json({
                error: err
            })
        }
        else
        {
            res.status(200).json(result)
        }
    })
})

module.exports = router