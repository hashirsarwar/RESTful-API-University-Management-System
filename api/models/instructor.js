const mongoose = require('mongoose')

const instructorSchema = mongoose.Schema({
    _id : mongoose.Types.ObjectId,
    fname : {type:String,required:true},
    lname: {type:String,required:true},
    email : {type: String, required: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password : {type: String, required: true},
    phone: {type: String, required: true},
    institute_id : {type: mongoose.Types.ObjectId, ref:'Admin', required: true}
})

module.exports = mongoose.model('Instructor',instructorSchema)