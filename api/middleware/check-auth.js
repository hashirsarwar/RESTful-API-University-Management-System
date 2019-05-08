//For admin
const jwt = require('jsonwebtoken')

module.exports = (req,res,next)=>
{
    try
    {
        const token = req.headers.authorization.split(' ')[1]
        var decoded = jwt.verify(token,'hashirAdminKey')
        req.adminData = decoded
        next()
    }
    catch(error)
    {
        return res.status(401).json({
            message:'Auth failed'
        })
    }
}