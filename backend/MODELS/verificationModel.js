import { Schema,model } from "mongoose";

const verificationSchema=new Schema({
    reportId:{
        type:Schema.Types.ObjectId,
        ref: 'report'
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    type:{
        type:String,
        enum:['confirm', 'deny']
    }
},{
    timestamps:true,
    strict:"throw",
    versionKey:false   
})

export const VerificationModel=model('verification',verificationSchema)