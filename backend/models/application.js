import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'job'
    },
    application:{
        type:mongoose.Schema.Types.ObjectId,
        ref : 'application'
    },
    status:{
        type:String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
},
{
    timestamps:true
});

module.exports = mongoose.model('application', applicationSchema);