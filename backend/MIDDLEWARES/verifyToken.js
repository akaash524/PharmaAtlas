import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
config()
export const verifyToken=(...allowedRoles)=>{ 
    return async(req,res,next)=>{
    //read token from req
    try{
    let token=req.cookies.token
    // console.log(token)
    if(!token){
        return res.status(401).json({
            message:'Unauthorised req, please Login'
        })
    }
    //verify the validity of token (decoding the token)
    let decodedToken=jwt.verify(token,process.env.JWT_SECRECT)
    //console.log(decodedToken)
    if(!allowedRoles.includes(decodedToken.role)){
        return res.status(403).json({message:'Forbidden. You dont have the permission '})
    }
    //attach user info to req
    req.user=decodedToken
    next();
    }catch(err){
        if(err.name==='TokenExpiredError'){
            return res.status(401).json({message:'Session Expired. Please Login Again'})
        }
        if(err.name==='JsonWebTokenError'){
            return res.status(401).json({message:'Invalid Token. Please Login Again'})
        }
        // next(err)
    }
    //forwad req to next middle ware or route
    }
}