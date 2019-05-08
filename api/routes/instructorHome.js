const express = require('express')
const Instructor = require('../models/instructor')
const assignCourse = require('../models/assignCourse')
const checkInstructorAuth = require('../middleware/checkAuthInstructor')
const router = express.Router()

router.get('/',checkInstructorAuth,(req,res,next)=>{
    Instructor.find({_id:req.instructorData.id},(err,result)=>{
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
                assignCourse.find({instructor:req.instructorData.id},(err,result2)=>{
                    if(err)
                    {
                        res.status(500).json({
                            error: err
                        })          
                    }
                    else
                    {
                        res.status(200).json({
                            Info : result,
                            AssignedCourses: result2
                        })
                    }
                })
            }
        }
    })
})

module.exports = router