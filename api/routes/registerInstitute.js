const express = require('express')
const mongoose = require('mongoose')
const Admin = require('../models/admin')
const bcrypt = require('bcrypt')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json(
        {
            message: 'adminregister get method'
        }
    )
})

router.post('/', (req, res, next) => {
    Admin.find({ email: req.body.email }).exec((err, result) => {
        if (result.length > 0) {
            return res.status(409).json({
                message: 'User already exists'
            })
        }
        else 
        {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    })
                }
                else {
                    const admin = new Admin({
                        _id: new mongoose.Types.ObjectId,
                        email: req.body.email,
                        password: hash,
                        institute_name: req.body.institute_name
                    })
                    admin.save((err) => {
                        if (err) {
                            console.log(err)
                            res.status(500).json({
                                error: err
                            })
                        }
                        else {
                            res.status(201).json({
                                message: 'Admin created',
                            })
                        }
                    })
                }
            })
        }
    })
})
module.exports = router