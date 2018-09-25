const mongoose=require('mongoose');

const employeeSchema = mongoose.Schema({
    firstName: {type: String, required:true},
    lastName: {type: String, required: true},
    employeeCode:{type: Number, required:true},
    phone:{type: Number,match: /^[1-9][0-9]{9}$/, unique:true, required:true},
    email:{
        type: String,
        unique:true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        required:true
    }
    // imagePath:{type: String}
});

module.exports=mongoose.model('emp',employeeSchema);