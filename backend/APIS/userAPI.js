import exp from 'express'
import { ReportModel } from '../MODELS/reportModel.js'
import { verifyToken } from '../MIDDLEWARES/verifyToken.js'
import { VerificationModel } from '../MODELS/verificationModel.js'
import { MedicineModel } from '../MODELS/medicineModel.js'
import { PharmacieModel } from '../MODELS/pharmacieModel.js'
import { UserModel } from '../MODELS/userModel.js'
import { register } from '../SERVICES/authService.js'
import { hash,compare } from 'bcryptjs'

// import { io } from '../server.js'

export const userApp = exp.Router()




//create or reg user
userApp.post("/users",async (req, res, next) => {

    let userObj=req.body
    const newUserObj = await register({...userObj,role: "user",});

    res.status(201).json({message: "user created",payload: newUserObj,});

});


// ─────────────────────────────────────────────
//  REPORTS
// ─────────────────────────────────────────────

// POST /api/reports → submit a new report
userApp.post('/reports', verifyToken('user'), async (req, res) => {
    req.body.userId=req.user._id
    let newReport = new ReportModel(req.body)
    //console.log(newReport)
    newReport.expiresAt = new Date(
        Date.now() + 48 * 60 * 60 * 1000
    )
    await newReport.validate()
    let newReportDoc = await newReport.save()
    res.status(201).json({ message: 'New report created', payload: newReportDoc })
})

// GET /api/reports/nearby → nearby reports (MUST be before /reports/:id)
userApp.get('/reports/nearby', verifyToken('user','admin'), async (req, res) => {
    // console.log('got request')
    const { lat, lng, radius } = req.query

    if (!lat || !lng) {
        return res.status(400).json({ message: 'lat and lng are required' })
    }

    // Step 1 — find nearby pharmacies
    const pharmacies = await PharmacieModel.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(lng), parseFloat(lat)]
                },
                $maxDistance: parseInt(radius)
            }
        }
    })
    // console.log(pharmacies)
    if (pharmacies.length === 0) {
        return res.status(200).json({ message: 'No pharmacies found nearby', payload: [] })
    }

    const pharmacyIds = pharmacies.map(p => p._id)

    // Step 2 — get active reports for those pharmacies
    const reports = await ReportModel.find({
        pharmacyId: { $in: pharmacyIds },
        expiresAt: { $gt: new Date() }
    })
        .populate('medicineId', 'name genericName')
        .populate('pharmacyId', 'name address location isVerified')

    // console.log(reports)// i get an empty array
    res.status(200).json({ message: 'Nearby reports', payload: reports })
})

// GET /api/reports → get all reports
userApp.get('/reports', verifyToken('user', 'admin'), async (req, res) => {
    let reports = await ReportModel.find()
        .populate('medicineId', 'name genericName')
        .populate('pharmacyId', 'name address location')
        .populate('userId', 'name')
    res.status(200).json({ message: 'All reports', payload: reports })
})

// GET /api/reports/:id → get single report
userApp.get('/reports/:id', verifyToken('user', 'admin'), async (req, res) => {
    let report = await ReportModel.findById(req.params.id)
        .populate('medicineId')
        .populate('pharmacyId')
        .populate('userId', 'name email')
        .populate({path: 'interactions.userId',select: 'name email'});
    if (!report) {
        return res.status(404).json({ message: 'Report not found' })
    }
    res.status(200).json({ message: 'Report found', payload: report })
})

// DELETE /api/reports/:id → delete own report
userApp.delete('/reports/:id', verifyToken('user', 'admin'), async (req, res) => {
    let report = await ReportModel.findOne({ _id: req.params.id, userId: req.user._id })
    if (!report) {
        return res.status(404).json({ message: 'Report not found or unauthorized' })
    }
    await ReportModel.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Report deleted', payload: report })
})


//get my reports 
userApp.get('/my-reports', verifyToken('user'), async (req, res) => {
    let reports = await ReportModel.find({ userId: req.user._id })
        .populate('medicineId', 'name genericName')
        .populate('pharmacyId', 'name address location')
        .populate('userId', 'name')
    if (!reports) {
        return res.status(404).json({ message: 'Reports not found' })
    }
    res.status(200).json({ message: 'Reports Found', payload: reports })
})

userApp.post("/reports/:id/interact",verifyToken("user",'admin'),async (req, res) => {
    try {
      const reportId = req.params.id;
      const { action } = req.body;
      // FIND REPORT
      const report = await ReportModel.findById(reportId);
      if (!report) {
        return res.status(404).json({message: "Report not found",});
      }
      // CHECK IF USER ALREADY INTERACTED
      const existingInteraction =
        report.interactions.find((interaction) =>interaction.userId.toString() ===req.user._id.toString());
      // IF EXISTS → UPDATE ACTION
      if (existingInteraction) {
        existingInteraction.action = action
        existingInteraction.actedAt = new Date();
      } else {
        // ADD NEW INTERACTION
        report.interactions.push({
            userId: req.user._id,
            action,
        });
      }
      // SAVE REPORT
      await report.save()
      res.status(200).json({message:"Interaction saved successfully",payload: report});
    } catch (err) {
      console.log(err);
      res.status(500).json({message:"Failed to save interaction",});
    }
  }
);

// ─────────────────────────────────────────────
//  VERIFICATIONS
// ─────────────────────────────────────────────

// POST /api/reports/:id/verify → verify a report (confirm/deny)
userApp.post('/reports/:id/verify', verifyToken('user'), async (req, res) => {
    const { id } = req.params
    const { type } = req.body
    let verifiedReport = new VerificationModel({
        reportId: id,
        userId: req.user._id,
        type: type
    })
    await verifiedReport.validate()
    let verifiedReportDoc = await verifiedReport.save()
    res.status(201).json({ message: 'Report verified', payload: verifiedReportDoc })
})

// DELETE /api/reports/:id/verify → remove own verification
userApp.delete('/reports/:id/verify', verifyToken('user'), async (req, res) => {
    const { id } = req.params
    let isExist = await VerificationModel.findOne({ reportId: id, userId: req.user._id })
    if (!isExist) {
        return res.status(404).json({ message: 'Verification not found' })
    }
    let removed = await VerificationModel.findByIdAndDelete(isExist._id)
    res.status(200).json({ message: 'Verification removed', payload: removed })
})


// ─────────────────────────────────────────────
//  MEDICINES
// ─────────────────────────────────────────────

// GET /api/medicines → list all medicines
userApp.get('/medicines', verifyToken('user','admin'), async (req, res) => {
    let medicines = await MedicineModel.find()
    res.status(200).json({ message: 'All medicines', payload: medicines })
})

// GET /api/medicines/:id → get single medicine
userApp.get('/medicines/:id', verifyToken('user'), async (req, res) => {
    let medicine = await MedicineModel.findById(req.params.id)
    if (!medicine) {
        return res.status(404).json({ message: 'Medicine not found' })
    }
    res.status(200).json({ message: 'Medicine found', payload: medicine })
})


// ─────────────────────────────────────────────
//  PHARMACIES
// ─────────────────────────────────────────────

// GET /api/pharmacies/nearby → nearby pharmacies (MUST be before /pharmacies/:id)
userApp.get('/pharmacies/nearby', verifyToken('user'), async (req, res) => {
    const { lat, lng, radius = 5000, medicineId } = req.query

    if (!lat || !lng) {
        return res.status(400).json({ message: 'lat and lng are required' })
    }

    // Step 1 — find pharmacies within radius
    const pharmacies = await PharmacieModel.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(lng), parseFloat(lat)]
                },
                $maxDistance: parseInt(radius)
            }
        }
    })

    if (pharmacies.length === 0) {
        return res.status(200).json({ message: 'No pharmacies found nearby', payload: [] })
    }

    // Step 2 — if medicineId provided, filter by active reports
    if (medicineId) {
        const pharmacyIds = pharmacies.map(p => p._id)
        const reports = await ReportModel.find({
            pharmacyId: { $in: pharmacyIds },
            medicineId: medicineId,
            expiresAt: { $gt: new Date() }
        }).populate('pharmacyId')

        return res.status(200).json({ message: 'Nearby pharmacies with medicine', payload: reports })
    }

    res.status(200).json({ message: 'Nearby pharmacies', payload: pharmacies })
})

// GET /api/pharmacies → list all pharmacies
userApp.get('/pharmacies', verifyToken('user'), async (req, res) => {
    let pharmacies = await PharmacieModel.find()
    res.status(200).json({ message: 'All pharmacies', payload: pharmacies })
})

// POST /api/pharmacies → add a new pharmacy
userApp.post('/pharmacies', verifyToken('user'), async (req, res) => {
    let newPharmacie = new PharmacieModel(req.body)
    await newPharmacie.validate()
    let newPharmacieDoc = await newPharmacie.save()
    res.status(201).json({ message: 'New pharmacy added', payload: newPharmacieDoc })
})

// GET /api/pharmacies/:id → get single pharmacy
userApp.get('/pharmacies/:id', verifyToken('user'), async (req, res) => {
    let pharmacie = await PharmacieModel.findById(req.params.id)
    if (!pharmacie) {
        return res.status(404).json({ message: 'Pharmacy not found' })
    }
    res.status(200).json({ message: 'Pharmacy found', payload: pharmacie })
})


// ─────────────────────────────────────────────
//  PROFILE
// ─────────────────────────────────────────────

// GET /api/users/me → get own profile
userApp.get('/users/me', verifyToken('user'), async (req, res) => {
    let profile = await UserModel.findById(req.user._id).select('-passwordHash')
    if (!profile) {
        return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json({ message: 'User profile', payload: profile })
})

// PATCH /api/users/me → update name/email
userApp.patch('/users/me', verifyToken('user'), async (req, res) => {
    const { name, email } = req.body
    let updatedProfile = await UserModel.findByIdAndUpdate(
        req.user._id,
        { $set: { email, name } },
        { new: true }
    ).select('-passwordHash')
    if (!updatedProfile) {
        return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json({ message: 'User profile updated', payload: updatedProfile })
})



//update the password
userApp.put('/change-password',verifyToken('user'),async(req,res)=>{
    //get all details 
    // console.log(req.user)
    let {currentPassword,newPassword}=req.body
    //find and get the user
    let user=await UserModel.findOne({email:req.user.email})
    //check the user existed
    if(!user){
        return res.status(404).json({maessage:'User Not found'})
    }
    //c ompare the passwords
    let check=await compare(currentPassword,user.password)
    //if not matched send res
    if(!check){
        return res.status(400).json({message:'Incorrect Old Password'})
    }
    //replace new password and save
    let newHashPassword=await hash(newPassword,10)
    user.password=newHashPassword
    await user.save()
    // console.log('password updated',newPassword)
    //send res
    res.status(200).json({message:'Password Updated Sucessfully'})

})