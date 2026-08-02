const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type: String, 
        required : true, 
        unique : true,
    },
    password : {
        type: String,
        required : true
    }, 
    mobile : {
        type: String,
    },
    role : {
        type : String,
        enum : ['USER', 'ADMIN', 'SUPER_ADMIN'],
        default : 'USER'
    },
    isBlocked : {
        type : Boolean,
        default : false
    },
    lastLogin : {
        type : Date,
    },
    promotedAt : {
        type : Date,
    },
    promotedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
},
    {
        timestamps : true,
    }
);

module.exports = mongoose.model('User', userSchema);
