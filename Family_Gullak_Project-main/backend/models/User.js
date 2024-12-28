const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    required: true,
  },
  familycode: {
    type: String,
    required: true,
    // Do not add `unique: true` here
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
  },
  transactions: [
    {
        transactionId: { type: String },
        amount: { type: Number },
        date: { type: Date, default: Date.now },
        status: { type: String, enum: ["Success", "Pending", "Failed"], default: "Pending" },
    },
],
  bankDetails:{
    accountHolderName: { type: String },
    bankName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
  },
});

// Add a unique index only for admins
UserSchema.index({ familycode: 1, role: 1 }, { unique: true, partialFilterExpression: { role: "admin" } });

module.exports = mongoose.model("User", UserSchema);
