import { Schema,model } from "mongoose";

const medicineSchema=new Schema({
    name:{
        type:String,
    },                
    genericName:{
        type:String,
    },        
    category:{
        type:String,
    },            
    manufacturer:{
        type:String,  
    },
    isRare:{ 
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
    strict:"throw",
    versionKey:false    
})

export const MedicineModel=model('medicine',medicineSchema)