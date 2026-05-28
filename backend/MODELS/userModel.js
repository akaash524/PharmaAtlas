import { Schema,model } from "mongoose";

const userSchema=new Schema({
    name:{
        type:String,
        required:[true,'User name is required']
    },
    email:{
        type:String,
        unique:[true,'Email Already Exist']
    },
    password:{
        type:String,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default: 'user'
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
    strict:"throw",
    versionKey:false
})

export const UserModel=model('user',userSchema)