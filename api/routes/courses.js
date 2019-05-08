const express = require('express')
const mongoose = require('mongoose')
const checkAuth = require('../middleware/check-auth')
const Course = require('../models/course')
const Degree = require('../models/degree')

const router = express.Router()

router.get('/',checkAuth,(req,res,next)=>{

    Course.find({institute_id:req.adminData.id},(err,result)=>
    {
        if(err)
        {
            res.status(500).json({
                error: err
            })
        }
        else
        {
            res.status(200).json(result)
        }
    })
})

router.post('/add',checkAuth,(req,res,next)=>{
    
    var insID = req.adminData.id
    Degree.find({degreeName : req.body.degree,degreeType:req.body.degreeType,institute_id: insID}).exec((err,result)=>
    {
        if(err)
        {
            res.status(500).json({
                error:err
            })
        }
        else
        {
            if(result.length == 0)
            {
                res.status(401).json({
                    message: 'Invalid Degree'
                })
            }
            else
            {
                /*
                check if unique 
                */

                Course.find({title:req.body.title,institute_id:req.adminData.id},(err,reslt)=>{
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
                            const course = new Course({
                                _id: new mongoose.Types.ObjectId(),
                                course_code: req.body.course_code,
                                title: req.body.title,
                                credit_hrs:req.body.credit_hrs,
                                degree: result[0]._id,
                                institute_id: insID
                            })
                            console.log(course)
                            course.save((err)=>
                            {
                                if(err)
                                {
                                    res.status(500).json({
                                        error: err
                                    })
                                }
                                else
                                {
                                    res.status(200).json({
                                        message: 'Course Added'
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
        }
    })
})

router.delete('/:courseID',checkAuth,(req,res,next)=> {
    const id = req.params.courseID
    Course.remove({_id:id,institute_id:req.adminData.id},(err)=>{
        if(err)
        {
            res.status(404).json({
                error: err
            })
        }
        else
        {
            res.status(200).json({
                message:'Course deleted'
            })
        }
    })
})

module.exports = router