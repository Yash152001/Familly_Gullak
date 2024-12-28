const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const User = require("../models/User");
const Policy = require("../models/Policy")
const routes = express.Router();
const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
    key_id: 'rzp_test_H6izJaVSloYZS9',
    key_secret: 'lwPGX3Wi2PNqf2jNTpNiJDID',
});

routes.post('/create-payment-order', fetchuser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const policy = await Policy.findOne({ familyCode: user.familycode });
        if (!policy) {
            return res.status(404).json({ error: "Policy not found for this family code." });
        }
        // console.log(policy)
        // console.log(user.familycode)
        const admin = await User.findOne({ familycode: user.familycode, role: "admin" });
        // console.log(admin)
        if (!admin) {
            return res.status(404).json({ error: "Admin not found for this family code." });
        }
        const amount = policy.financial.monthlyContributionAmount;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid premium amount in the policy." });
        }

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);

        user.transactions.push({
            transactionId: order.id,
            amount,
            status: "Pending",
        });
        await user.save();

        res.status(201).json({ 
            order, 
            adminBankDetails: admin.bankDetails, 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Some error occurred.");
    }    
});

// routes.post("create-payment-order/validate" , fetchuser , async (req, res)=>{
//     const {razorpay_order_id , razorpay_payment_id , razorpay_signature} = 
//     req.body;
//     const sha = crypto.createHmac("sha256" , "lwPGX3Wi2PNqf2jNTpNiJDID")
//     sha.update(`${razorpay_order_id}| ${razorpay_payment_id}`);
//     const digest =sha.digest("hex");
//     if (digest !== razorpay_signature){
//         return res.status(400).json({msg :"Transaction is not Legit !!"});
//     }
//     res.json({
//         msg:"success",  
//         order_id:razorpay_order_id,
//         paymentID:razorpay_payment_id
//     })

// })


// Razorpay _Webhook
routes.post('/razorpay-webhook', async (req, res) => {
    try {
        console.log("Webhook triggered:", JSON.stringify(req.body, null, 2));
        const secret = 'aniskhan45';
        const crypto = require('crypto');
        const shasum = crypto.createHmac('sha256', secret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');

        if (digest !== req.headers['x-razorpay-signature']) {
            return res.status(400).json({ error: "Invalid signature" });
        }

        const { order_id, payment_id, status } = req.body.payload.payment.entity;

        if (status === "captured") {
            // Locate the user and transaction using order_id
            const user = await User.findOne({ "transactions.transactionId": order_id });
            if (!user) {
                return res.status(404).json({ error: "User not found for the transaction" });
            }

            const transaction = user.transactions.find(t => t.transactionId === order_id);
            if (!transaction) {
                return res.status(404).json({ error: "Transaction not found" });
            }

            const policy = await Policy.findOne({ familyCode: user.familycode });
            if (!policy) {
                return res.status(404).json({ error: "Policy not found for user's family code" });
            }

            const policyPremiumAmount = policy.financial.monthlyContributionAmount;

            if (transaction.amount !== policyPremiumAmount) {
                return res.status(400).json({ error: "Paid amount mismatch" });
            }

            // Update transaction status
            transaction.status = "Success";
            transaction.paymentId = payment_id;

            // Increment the collected amount
            policy.financial.totalCollectedAmount += policyPremiumAmount;

            await policy.save();
            await user.save();

            // console.log(`Payment captured: ${payment_id}`);
        }

        res.status(200).send("Webhook processed successfully");
    } catch (error) {
        console.error("Error processing webhook:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

const crypto = require('crypto');
const { appendFile } = require("fs");
const secret = 'aniskhan45';
const payload = JSON.stringify({
    "payload": {
        "payment": {
            "status": "captured",
            "order_id": "order_1234567890",
            "amount": 1000
        }
    }
});

const shasum = crypto.createHmac('sha256', secret);
shasum.update(payload);
const signature = shasum.digest('hex');
console.log(signature); // Use this as `x-razorpay-signature
module.exports = routes 