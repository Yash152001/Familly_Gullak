const mongoose = require("mongoose");

const PolicySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3
    },
    description: {
        type: String,
        required: true,
        minlength: 5
    },
    effectiveDate: {
        type: Date,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["Active", "Pending", "Closed"],
        default: "Active"
    },
    financial: {
        monthlyContributionAmount: {
            type: Number,
            required: true
        },
        emergencyFundLimit: {
            type: Number,
            default: 0
        },
        penaltyDetails: {
            type: String
        },
        totalCollectedAmount: {
            type: Number,
            default: 0
        },
        allocatedFunds: {
            type: Number,
            default: 0
        }
    },
    users: {
        eligibility: {
            type: String,
            default: "All Group Members"
        },
        contributions: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                amount: { type: Number },
                date: { type: Date, default: Date.now }
            }
        ],
        emergencyFundRequests: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                amount: { type: Number },
                reason: { type: String },
                status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
                date: { type: Date, default: Date.now },
                repayment: {
                    paidAmount: { type: Number, default: 0 },
                    isFullyRepaid: { type: Boolean, default: false }
                }
            }
        ]
    },
    admin: {
        approvals: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                requestId: { type: mongoose.Schema.Types.ObjectId },
                status: { type: String, enum: ["Approved", "Rejected"], default: "Pending" },
                date: { type: Date, default: Date.now }
            }
        ]
    },
    audit: {
        transactionHistory: [
            {
                transactionId: { type: String },
                amount: { type: Number },
                date: { type: Date, default: Date.now }
            }
        ],
        policyChanges: [
            {
                changedBy: { type: String },
                change: { type: String },
                date: { type: Date, default: Date.now }
            }
        ]
    },
    familyCode: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Policy", PolicySchema);
