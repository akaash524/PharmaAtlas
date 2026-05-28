import jwt from 'jsonwebtoken'
import {hash,compare} from 'bcryptjs'
import { UserModel } from '../MODELS/userModel.js'
import { config } from 'dotenv'
config()


export const register=async (userObj)=>{
    // craete document 
    const userDoc=new UserModel(userObj)
    //validate the empty password
    await userDoc.validate()
    // hash and replace password
    userDoc.password=await hash(userDoc.password,10)
    //save
    const created = await userDoc.save()
    //convert the document into obj 
    const newUserObj=created.toObject()
    //remove password
    delete newUserObj.password
    //return user object without password
    return newUserObj
}

export const authentication=async ({email,password})=>{
    //check user with email
    const user=await UserModel.findOne({email})
    if(!user){
        const err=new Error("Invalid email");
        err.status=401
        throw err
    }
    //compare passwords
    const isMatch=await compare(password,user.password)
    if(!isMatch){
        const err=new Error("Invalid password");
        err.status=401
        throw err
    }

    if(user.isActive===false){
        const err=new Error('Your Account is please contact admin')
        err.status=403
        throw err
    }

    const token=jwt.sign({_id:user._id,role:user.role,email:user.email,name:user.name},
        process.env.JWT_SECRECT,
        {expiresIn:"1h"}
    )
    const userObj=user.toObject()
    delete userObj.password

    return {token,user:userObj};
}