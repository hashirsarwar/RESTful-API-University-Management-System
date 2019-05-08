const express = require('express')
const checkAuth = require('../middleware/check-auth')
const Admin = require('../models/admin')

const router = express.Router()

router.get('/', checkAuth, (req, res)=>{
	Admin.find({_id:req.adminData.id}, (err,result)=>{
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

module.exports = router