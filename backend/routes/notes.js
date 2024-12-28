const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Policy");
const User = require("../models/User");
const routes = express.Router();
const { body, validationResult } = require('express-validator')

// fetchallPolicy   get
routes.get('/fetchpolicy', fetchuser, async (req, res) => {
    try {
        // Fetch the user based on the ID in the token
        const user = await User.findById(req.user.id);

        // Ensure the user exists
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Debugging: Log user and family code
        // console.log("User:", user);
        // console.log("User Family Code:", user.familycode);
        a = user.familycode
        // console.log(a)

        // Fetch policies with the same family code but not created by the user
        const policies = await Notes.find({ 
            familyCode: { $regex: new RegExp(`^${user.familycode}$`, 'i') },
            user: { $ne: req.user.id }
        });
        

        // Debugging: Log fetched policies
        // console.log("Fetched Policies:", policies);

        // Return the policies
        res.json(policies);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred");
    }
});




// fetch all video

routes.get('/fetchallvideo', fetchuser, async (req, res) => {
    try {
        const Policy = await Policy.find({ user: req.user.id ,  video: { $exists: true, $ne: null }  }).select("video").select("date");
        res.json(Policy) 
    } catch (error) {
        console.log(error.message)
        res.status(5000).send("Some Error occured")
    }
})

// fetch all Images

routes.get('/fetchallimages', fetchuser, async (req, res) => {
    try {
        const Policy = await Policy.find({ user: req.user.id ,  images: { $exists: true, $ne: null }  }).select("images").select("date");
        res.json(Policy) 
    } catch (error) {
        console.log(error.message)
        res.status(5000).send("Some Error occured")
    }
})
// fetch all pdf

routes.get('/fetchallpdf', fetchuser, async (req, res) => {
    try {
        const Policy = await Policy.find({ user: req.user.id ,  pdf: { $exists: true, $ne: null }  }).select("pdf").select("date");
        res.json(Policy) 
    } catch (error) {
        console.log(error.message)
        res.status(5000).send("Some Error occured")
    }
})


// addnote  [post]


routes.post(
    "/createpolicy",
    fetchuser,
    [
        body("title", "Title must have at least 3 characters").isLength({ min: 3 }),
        body("description", "Description must have at least 5 characters").isLength({ min: 5 }),
        body("effectiveDate", "Effective date is required").notEmpty(),
        body("expiryDate", "Expiry date is optional but must be valid").optional().isDate(),
        body("monthlyContributionAmount", "Monthly Contribution Amount is required and should be a number").isNumeric(),
        body("emergencyFundLimit", "Emergency Fund Limit must be a number").optional().isNumeric(),
    ],
    async (req, res) => {
        try {
            // Validate request body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Check if the user is authenticated
            if (!req.user) {
                return res.status(401).json({ error: "User not authenticated" });
            }

            // Fetch the user data (with role and family code) from the database
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Ensure the user is an admin
            if (user.role !== "admin") {
                return res.status(403).json({ error: "Access denied: Admins only." });
            }

            // Extract necessary fields from the request body
            const {
                title,
                description,
                tag,
                effectiveDate,
                expiryDate,
                monthlyContributionAmount,
                emergencyFundLimit,
                penaltyDetails,
                eligibility,
            } = req.body;

            // Create a new policy
            const policy = new Notes({
                title,
                description,
                tag: tag || "General",
                effectiveDate,
                expiryDate,
                financial: {
                    monthlyContributionAmount,
                    emergencyFundLimit: emergencyFundLimit || 0,
                    penaltyDetails: penaltyDetails || "",
                },
                users: {
                    eligibility: eligibility || "All members",
                    contributions: [],
                    emergencyFundRequests: [],
                },
                communication: {
                    notifications: [],
                    updates: [],
                },
                documents: {
                    pdf: [],
                    images: [],
                    videos: [],
                },
                admin: {
                    approvals: [],
                },
                audit: {
                    transactionHistory: [],
                    policyChanges: [],
                },
                familyCode: user.familycode, // Use the familyCode from the admin user
            });

            // Save the policy
            const savedPolicy = await policy.save();
            res.status(201).json(savedPolicy);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Some error occurred");
        }
    }
);



// Request Emergency Fund:
routes.post('/request-emergency-fund', fetchuser, async (req, res) => {
    try {
        const { amount, reason } = req.body;

        // Validate input
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount specified" });
        }

        // Fetch user details
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const familyCode = user.familycode; // Ensure family code is correct
        console.log(`Family Code: ${familyCode}`);

        // Fetch policy associated with the user's family code
        const policy = await Notes.findOne({ familyCode }); // Use Policy model
        if (!policy) {
            return res.status(404).json({ error: "No policy found for this family code" });
        }

        // Ensure the requested amount doesn't exceed the available emergency fund limit
        const availableFunds = policy.financial.emergencyFundLimit - policy.financial.allocatedFunds;
        if (amount > availableFunds) {
            return res.status(400).json({ error: `Requested amount exceeds the available emergency fund. Available: ${availableFunds}` });
        }

        // Add the request to the policy's emergencyFundRequests
        const newRequest = {
            userId: user._id,
            amount,
            reason: reason || "Emergency fund request",
            status: "Pending",
        };

        policy.users.emergencyFundRequests.push(newRequest);
        await policy.save();

        // Fetch the newly created request ID
        const createdRequest = policy.users.emergencyFundRequests.at(-1); // Last added request

        res.status(201).json({
            message: "Emergency fund request submitted successfully",
            request: createdRequest, // Includes the `_id`
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred");
    }
});


// Admin accept or reject Request for Emergency Fund

routes.put('/review-emergency-fund/:requestId', fetchuser, async (req, res) => {
    try {
        const { status } = req.body; // "Approved" or "Rejected"
        const { requestId } = req.params;

        // Fetch admin details
        const admin = await User.findById(req.user.id);
        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ error: "Access denied: Admins only" });
        }
        code = admin.familycode

        // Fetch policy associated with the admin's family code
        const policy = await Notes.findOne({ familyCode: code });
        if (!policy) {
            return res.status(404).json({ error: "No policy found for this family code" });
        }

        // Find the emergency fund request
        const request = policy.users.emergencyFundRequests.find(
            (req) => req._id.toString() === requestId
        );
        if (!request) {
            return res.status(404).json({ error: "Emergency fund request not found" });
        }

        if (request.status !== "Pending") {
            return res.status(400).json({ error: "Request has already been reviewed" });
        }

        // Update request status
        request.status = status;

        if (status === "Approved") {
            policy.financial.allocatedFunds += request.amount;
        }

        await policy.save();

        res.status(200).json({ message: `Request ${status.toLowerCase()} successfully`, policy });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred");
    }
});


routes.post('/repay-emergency-fund/:requestId', fetchuser, async (req, res) => {
    try {
        const { amount } = req.body;
        const { requestId } = req.params;

        // Fetch user details
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        code = user.familycode

        // Fetch policy associated with the user's family code
        const policy = await Notes.findOne({ familyCode: code });
        if (!policy) {
            return res.status(404).json({ error: "No policy found for this family code" });
        }

        // Find the emergency fund request
        const request = policy.users.emergencyFundRequests.find(
            (req) => req._id.toString() === requestId
        );
        if (!request) {
            return res.status(404).json({ error: "Emergency fund request not found" });
        }

        if (request.status !== "Approved") {
            return res.status(400).json({ error: "Only approved requests can be repaid" });
        }

        // Update repayment details
        request.repayment.paidAmount += amount;
        if (request.repayment.paidAmount >= request.amount) {
            request.repayment.isFullyRepaid = true;
            policy.financial.allocatedFunds -= request.amount; // Adjust allocated funds
        }

        // Save the policy
        await policy.save();

        res.status(200).json({ message: "Repayment successful", policy });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred");
    }
});









// update the Policy put


routes.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag , images , pdf   ,video} = req.body;
    const newNote = {}

    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };
    if (images) { newNote.images = images };
    if (pdf) { newNote.pdf = pdf };
    if (video) { newNote.video = video };

    let note = await Policy.findById(req.params.id)
    if (!note) {
        return res.status(404).send("Not Found")
    }

    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Authorized")
    }
    note = await Policy.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
    res.send({ note })
})


// delete the Policy put


routes.delete('/deletenote/:id', fetchuser, async (req, res) => {
    let note = await Policy.findById(req.params.id)

    if (!note) {
        return res.status(404).send("Not Found")
    }

    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("UnAuthorized Access")
    }
    note = await Policy.findByIdAndDelete(req.params.id)
    res.send({ "Success": "Note Has been deleted Succesfully", note: note })
})
module.exports = routes 