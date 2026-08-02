const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    originalUrl : {
        type : String,
        required : true,
    },
    shortUrl : {
        type : String,
        required : true,
        unique : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,     // Reference to the User model
        ref : "User",
        required : true,
    },
    clicks : {
        type : Number,
        default : 0
    },
    expiresAt : {
        type : Date,
    },
    isMalicious : {
        type : Boolean,
        default : false
    },
    isDeleted : {
        type : Boolean,
        default : false
    },
    deletionReason : {
        type : String,
    }},
    {
        timestamps : true,
    }
);

module.exports = mongoose.model("Url", urlSchema);