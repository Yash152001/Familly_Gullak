const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const User = require("../models/User");
const routes = express.Router();


routes.put('/add-bank-details', fetchuser, async (req, res) => {
    try {
        const { accountHolderName, bankName, accountNumber, ifscCode } = req.body;

        // Fetch the admin
        const admin = await User.findById(req.user.id);
        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ error: "Only admins can add bank details." });
        }

        // Update admin's bank details
        admin.bankDetails = { accountHolderName, bankName, accountNumber, ifscCode };
        await admin.save();

        res.status(200).json({ message: "Bank details updated successfully.", bankDetails: admin.bankDetails });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred.");
    }
});

module.exports = routes 