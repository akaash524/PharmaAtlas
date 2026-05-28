import exp from 'express'
import { verifyToken } from '../MIDDLEWARES/verifyToken.js'
import { UserModel } from '../MODELS/userModel.js'
import { MedicineModel } from '../MODELS/medicineModel.js'
import { PharmacieModel } from '../MODELS/pharmacieModel.js'
import { ReportModel } from '../MODELS/reportModel.js'
export const adminApp=exp.Router()




//register 
//create or reg user
adminApp.post("/users",async (req, res, next) => {

    const newUserObj = await register({...userObj,role: "admin",});

    res.status(201).json({message: "user created",payload: newUserObj,});

});
//get all users 
adminApp.get('/users',verifyToken('admin'),async(req,res)=>{
    let users=await UserModel.find({role:'user'})
    if(users.length==0){
        return res.status(404).json({message:'No users found'})
    }
    res.status(200).json({message:'users found',payload:users})
})

//get user by id
adminApp.get('/users/:id',verifyToken('admin'),async(req,res)=>{
    let id=req.params.id
    let user=await UserModel.findById(id)
    if(!user){
        return res.status(404).json({message:'User not found'})
    }
    res.status(200).json({message:'User found',payload:user})
})

//activate or deactivate user
adminApp.patch('/users/:id/status',verifyToken('admin'),async(req,res)=>{
    let id=req.params.id
    let user=await UserModel.findById(id)
    if(!user){
        return res.status(404).json({message:'User not found'})
    }
    user.isActive=!user.isActive
    await user.save()
    res.status(200).json({message:user.isActive?'user activated':'user deactivated'})
})

//delete user
adminApp.delete('/users/:id',verifyToken('admin'),async(req,res)=>{
    let id=req.params.id
    let user=await UserModel.findByIdAndDelete(id)
    if(!user){
        return res.status(404).json({message:'User not found'})
    }
    res.status(201).json({message:'user deleted',payload:user})
})


//get all medicines
adminApp.get('/medicines',verifyToken('admin'),async(req,res)=>{
    let medicines=await MedicineModel.find()
    res.status(200).json({message:'all medicines',payload:medicines})
})
//add a medicine
adminApp.post('/medicines',verifyToken('admin'),async(req,res)=>{
    let newMedicineData=req.body
    let newMedicine=new MedicineModel(newMedicineData)
    await newMedicine.validate()
    let medicine=await newMedicine.save()
    res.status(201).json({message:'Added new medicine',payload:medicine})
})

//edit a medicine
adminApp.patch('/medicines/:id',verifyToken('admin'),async(req,res)=>{
    let medicineId=req.params.id
    let { name,genericName,category,manufacturer,isRare }=req.body
    let updatedMedicine = await MedicineModel.findByIdAndUpdate(
        medicineId,
        { $set: { name, genericName, category, manufacturer, isRare } },
        { new: true }
    )
    if (!updatedMedicine) {
        return res.status(404).json({ message: 'Medicine not found' })
    }
    res.status(201).json({message:'Medicine info updated',payload:updatedMedicine})
})

//delete medicine
adminApp.delete('/medicines/:id',verifyToken('admin'),async(req,res)=>{
    let medicineId=req.params.id
    let deletedMedicine=await MedicineModel.findByIdAndDelete(medicineId)
    if(!deletedMedicine){
        return res.status(404).json({message:'Medicine not found'})
    }
    res.status(201).json({message:'Medicine deleted',payload:deletedMedicine})
})


//Pharmacy Management
//add a pharmacie 
adminApp.post('/pharmacies', verifyToken('admin'), async (req, res) => {
    let newPharmacie = new PharmacieModel(req.body)
    await newPharmacie.validate()
    let newPharmacieDoc = await newPharmacie.save()
    res.status(201).json({ message: 'New pharmacy added', payload: newPharmacieDoc })
})

//get all pharmacies
adminApp.get('/pharmacies', verifyToken('admin','user'), async (req, res) => {
    let pharmacies =await PharmacieModel.find()
    res.status(201).json({ message: 'All Pharmacies', payload: pharmacies })
})

adminApp.patch('/pharmacies/:id/verify',verifyToken('admin'),async(req,res)=>{
    let pharmaId=req.params.id
    let pharma=await PharmacieModel.findById(pharmaId)
    if(!pharma){
        return res.status(404).json({message:'Pharmacy not found'})
    }
    pharma.isVerified=true
    await pharma.save()
    res.status(201).json({message:'Pharmacie verified',payload:pharma})
})

//delete a pharmacie
adminApp.delete('/pharmacies/:id',verifyToken('admin'),async(req,res)=>{
    let pharmaId=req.params.id
    let pharma=await PharmacieModel.findByIdAndDelete(pharmaId)
    if(!pharma){
        return res.status(404).json({message:'Pharmacy not found'})
    }
    res.status(201).json({message:'Pharmacie verified',payload:pharma})
})

//Report Management

//get all reports (no expiry filter)
adminApp.get('/reports',verifyToken('admin'),async(req,res)=>{
    let reports=await ReportModel.find()
        .populate('userId','name')
        .populate('pharmacyId','name address')
        .populate('medicineId','name')

    if(!reports||reports.length==0){
        return res.status(200).json({message:'No reports found'})
    }
    res.status(200).json({message:'Reports Found',payload:reports})
})

//delete any report (no ownership check)
adminApp.delete('/reports/:id',verifyToken('admin'),async(req,res)=>{
    let reportId=req.params.id

    let report=await ReportModel.findByIdAndDelete(reportId)
    if(!report){
        return res.status(404).json({message:'Report Not Found'})
    }
    res.status(200).json({message:'Report deleted',payload:report})
})

// Dashboard / Stats
adminApp.get('/stats', verifyToken('admin'), async (req, res) => {
    const [users, reports, medicines, pharmacies] = await Promise.all([
        UserModel.countDocuments(),
        ReportModel.countDocuments(),
        MedicineModel.countDocuments(),
        PharmacieModel.countDocuments()
    ])
    res.status(200).json({
        message: 'All stats',
        payload: { users, reports, medicines, pharmacies }
    })
})
