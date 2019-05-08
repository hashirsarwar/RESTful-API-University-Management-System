const mongoose = require('mongoose')

const degreeSchema = mongoose.Schema({
    _id : mongoose.Types.ObjectId,
    degreeType : {type: String, required: true, enum:['Bachelors','Masters','Doctorate']},
    degreeName : {type:String, required:true},
    department: {type: mongoose.Types.ObjectId, ref:'Department',required:true},
    institute_id : {type: mongoose.Types.ObjectId, ref:'Admin',required:true }
})

module.exports = mongoose.model('Degree',degreeSchema)