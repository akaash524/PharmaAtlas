import { Schema, model } from "mongoose";

const interactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    action: {
        type: String,
        enum: ['verified', 'skipped','denied'],
        required: true
    },
    actedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false })  // no separate _id for each interaction

const reportSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    medicineId: {
        type: Schema.Types.ObjectId,
        ref: 'medicine'
    },
    pharmacyId: {
        type: Schema.Types.ObjectId,
        ref: 'pharmacie'
    },
    stockLevel: {
        type: String,
        enum: ['low', 'medium', 'high']
    },
    notes: {
        type: String
    },
    interactions: {
        type: [interactionSchema],
        default: []
    },
    expiresAt: {
        type: Date,
    }
}, {
    timestamps: true,
    strict: "throw",
    versionKey: false
})

export const ReportModel = model('report', reportSchema)