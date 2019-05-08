const express = require('express')
const Admin = require('../models/admin')
const Instructor = require('../models/instructor')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Student = require('../models/student')

const router = express.Router()

router.get('/',(req,res,next)=>
{
    res.status(200).json(
        {
            message:'homepage get method'
        }
    )
})
router.post('/',(req,res,next)=>
{
    const loginType = req.body.loginType
    if(loginType==='admin')
    {
        loginAdmin(req,res)
    }
    else if(loginType=='instructor')
    {
        loginInstructors(req,res)
    }
    else if(loginType=='student')
    {
        loginStudents(req,res)
    }
    else
    {
        return res.status(403).json({
            message:'Invalid login type'
        })
    }
})

function loginAdmin(req,res)
{
    Admin.find({email: req.body.email}).exec((err,result)=>
    {
        
        if(err)
        {
            return res.status(500).json({
                error:err
            })
        }
        else
        {
            if(result.length == 0)
            {
                return res.status(401).json({
                    message:'Auth failed'
                })
            }
            bcrypt.compare(req.body.password,result[0].password,(err, result2)=> {
                if(err)
                {
                    return res.status(500).json({
                        error:err
                    })
                }
                if(result2)
                {
                    const token = jwt.sign(
                        {
                            email:result[0].email,
                            id: result[0]._id
                        },

                        'hashirAdminKey',
                        {
                            expiresIn:'1000h' //just for testing
                        })
                        res.status(200).json({
                        message:'Auth successful admin',
                        token: token
                    })
                }
                else
                {
                    return res.status(401).json({
                        message:'Auth failed'
                    })
                }
            })
        }
    })
}

function loginInstructors(req,res)
{
    Instructor.find({email: req.body.email}).exec((err,result)=>{
        
        if(err)
        {
            return res.status(500).json({
                error:err
            })
        }
        else
        {
            if(result.length == 0)
            {
                return res.status(401).json({
                    message:'Auth failed'
                })
            }
            bcrypt.compare(req.body.password,result[0].password,(err, result2)=> {
                
                if(err)
                {
                    return res.status(500).json({
                        error:err
                    })
                }
                if(result2)
                {
                    const token = jwt.sign(
                        {
                            email:result[0].email,
                            id: result[0]._id
                        },

                        'hashirInstructorKey',
                        {
                            expiresIn:'1000h' //just for testing
                        })
                        res.status(200).json({
                        message:'Auth successful instructor',
                        token: token
                    })
                }
                else
                {
                    return res.status(401).json({
                        message:'Auth failed'
                    })
                }
            })
        }
    })
}

function loginStudents(req,res)
{
    Student.find({email: req.body.email}).exec((err,result)=>{
        
        if(err)
        {
            return res.status(500).json({
                error:err
            })
        }
        else
        {
            if(result.length == 0)
            {
                return res.status(401).json({
                    message:'Auth failed'
                })
            }
            bcrypt.compare(req.body.password,result[0].password,(err, result2)=> {
                
                if(err)
                {
                    return res.status(500).json({
                        error:err
                    })
                }
                if(result2)
                {
                    const token = jwt.sign(
                        {
                            email:result[0].email,
                            id: result[0]._id
                        },
                        'hashirStudentKey',
                        {
                            expiresIn:'1000h' //just for testing
                        })
                        res.status(200).json({
                        message:'Auth successful student',
                        token: token
                    })
                }
                else
                {
                    return res.status(401).json({
                        message:'Auth failed'
                    })
                }
            })
        }
    })
}

module.exports = router