const express = require('express')
const Student = require('../models/student')
const registerCourses = require('../models/registerCourse')
const checkStudentAuth = require('../middleware/checkAuthStudent')
const router = express.Router()

router.get('/',checkStudentAuth,(req,res,next)=>{
    Student.find({_id:req.studentData.id},(err,result)=>{
        if(err)
        {
            res.status(500).json({
                error: err
            })
        }
        else
        {
            if(result.length == 0)
            {
                res.status(404).json({
                    error: 'Page not found'
                })
            }
            else
            {
                registerCourses.find({student : req.studentData.id},(err,result2)=>{
                    if(err)
                    {
                        res.status(500).json({
                            error: err
                        })
                    }   
                    else
                    {
                        res.status(200).json({
                            info:result,
                            registration: result2
                        })
                    }
                })
            }
        }
    })
})

module.exports = router