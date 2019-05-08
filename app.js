const express = require('express')
const morgan = require('morgan')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const homepageRoute = require('./api/routes/homepage')
const registerInstituteRoute = require('./api/routes/registerInstitute')
const CourseRoute = require('./api/routes/courses')
const DegreeRoute = require('./api/routes/degrees')
const registerCoursesRoute = require('./api/routes/registerCourses')
const DepartmentRoute = require('./api/routes/departments')
const InstructorRoute = require('./api/routes/instructors')
const StudentRoute = require('./api/routes/students')
const studentHomeRoute = require('./api/routes/studentHome')
const instructorHomeRoute = require('./api/routes/instructorHome')
const adminHomeRoute = require('./api/routes/adminHome')

const app = express()
app.use(morgan('dev'))
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

//connecting to database
mongoose.connect('mongodb+srv://hashir:hashir@hashir-scal1.mongodb.net/test?retryWrites=true',
{
    useNewUrlParser: true,
    useCreateIndex: true
},
(err)=>{
    if(err) {
        console.log(err)
    }
    else console.log('Connection to database successful')
})

//Allowing cross access resource sharing
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:4444");
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if(req.method === 'OPTIONS')
    {
        res.setHeader('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET')
        return res.status(200).json({})
    }
    next();
});

//register the routes here
app.use('/',homepageRoute)
app.use('/adminHome',adminHomeRoute)
app.use('/registerInstitute',registerInstituteRoute)
app.use('/departments',DepartmentRoute)
app.use('/degrees',DegreeRoute)
app.use('/courses',CourseRoute)
app.use('/instructors',InstructorRoute)
app.use('/students',StudentRoute)
app.use('/register',registerCoursesRoute)
app.use('/studentProfile',studentHomeRoute)
app.use('/instructorProfile',instructorHomeRoute)

//error handling
app.use((req,res,next)=>{
    var error = new Error("Page not found")
    error.status = 404
    next(error) 
})
app.use((error,req,res,next)=>{
    res.status(error.status || 500)
    res.json({
        status: error.status,
        error: error.message
    })
})
//export
module.exports = app