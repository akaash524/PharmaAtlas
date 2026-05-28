import { Schema,model } from "mongoose";

const pharmacieSchema=new Schema({
    name:{
        type:String
    },
    address:{
        type:String
    },
    location:{
        type:{
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates:{
            type: [Number],
            required: true
        }
    },
    city:{
        type:String
    },
    state:{
        type:String
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true,
    strict:"throw",
    versionKey:false 
})

pharmacieSchema.index({ location: '2dsphere' });
export const PharmacieModel=model('pharmacie',pharmacieSchema)