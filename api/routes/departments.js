const express = require('express')
const checkAuth = require('../middleware/check-auth')
const Department = require('../models/department')
const mongoose = require('mongoose')

const router = express.Router()

router.get('/',checkAuth,(req,res,next)=>{
    Department.find({institute_id:req.adminData.id},(err,result)=>
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

    /* check if unique (ignoring case) */

    Department.find({name:req.body.name,institute_id:req.adminData.id},(err,reslt)=>{
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
                const dept = new Department({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    institute_id: req.adminData.id
                })
                console.log(dept)
                dept.save((err)=>
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
                            message: 'Department Added'
                        })
                    }
                })
            }
            else
            {
                res.status(409).json({
                    error:'Department already exists'
                })
            }
            
        }
    })
    
})

router.delete('/:departmentID',checkAuth,(req,res,next)=> {
    const id = req.params.departmentID
    Department.remove({_id:id,institute_id:req.adminData.id},(err)=>{
        if(err)
        {
            res.status(404).json({
                error: err
            })
        }
        else
        {
            res.status(200).json({
                message:'Department deleted'
            })
        }
    })
})

router.get('/:departmentID',checkAuth,(req, res)=>{
    const id = req.params.departmentID
    Department.find({_id:id,institute_id:req.adminData.id},(err, result)=>{
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