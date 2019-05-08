const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({
    _id : mongoose.Types.ObjectId,
    fname : {type: String,required:true},
    lname: {type: String,required:true},
    roll: {type: String, required: true},
    email : {type: String, required: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password : {type: String, required: true},
    phone: {type: String, required: true},
    department: {type:mongoose.Types.ObjectId, ref:'Department', required: true},
    degreeType : {type:String, enum:['Bachelors','Masters','Doctorate'],required:true},
    degree: {type:mongoose.Types.ObjectId, ref:'Degree',required: true},
    batch: {type: String, required: true},
    institute_id : {type: mongoose.Types.ObjectId, ref:'Admin', required: true}
})

module.exports = mongoose.model('Student',studentSchema)