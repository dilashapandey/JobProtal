import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name :{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone_no:{
        type:Number,
        required:true
    },
    role:{
        type:String,
        enum:['student','recruiter'],
        required:true
    },
    profile:{
        bio:{
            type:String
        },
        skills:[{
            type:String
        }],
        resume:{
            type:String
        },
        resumeORiginalName:{
            type:String
        },
        company:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Company'
        },
        profilePic:{
            type:String,
            default:''
        }
    }
},{timestamps:true})

module.exports = mongoose.model("user",userSchema);