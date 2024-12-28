const express  = require("express")
const routes = express.Router();
const {body , validationResult} = require('express-validator')
const User = require('../models/User')
const fetchuser = require('../middleware/fetchuser')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwt_sec = "Aniskhan1234"
const nodemailer = require("nodemailer")
const adminSecret = "AdminSecretKey123"
// const otpgenerator = require("otp-generator")



const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
    user: "familygullak9864@gmail.com",
    pass: "gyuy vhyc uybx wgia",
  }
});

function generateRandom6DigitNumber() {
  const min = 100000; // Smallest 6-digit number
  const max = 999999; // Largest 6-digit number
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  // console.log(randomNumber)
  return randomNumber;
}

let sharedOTP = "";




routes.post("/sendotp", async (req, res) => {
  const email = req.body.email;
  const otp = generateRandom6DigitNumber().toString()
  // console.log(otp);
    sharedOTP = otp;

    console.log(otp)
    setTimeout(() => {
      sharedOTP = "";  // Clear OTP after 120 seconds
      console.log("OTP cleared after 5 Minutes");
    }, 300 * 1000);
    // console.log("prnitidkf" , sharedOTP)
  try {
    // Send the OTP to the user's email
    const mailOptions = {
      from: '"Family Gullak" <familygullak9864@gmail.com>',
      to: email,
      subject: "Email Verification",
      html:`<div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px; color: #333;">
  <div style="background-color: #ffffff; padding: 25px; border-radius: 15px; max-width: 600px; margin: auto; text-align: center; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
    <!-- Header Section -->
    <div style="margin-bottom: 20px;">
      <img src="https://tse4.mm.bing.net/th?id=OIP.fWm8vBPA3er4tye_5LpWBAAAAA&pid=Api&P=0&h=180" alt="Brand Logo" style="height: 80px; width: auto; margin-bottom: 15px;" />
      <h1 style="font-size: 24px; font-weight: bold; color: #2596be; margin: 0;">Verify Your Email</h1>
    </div>

    <!-- OTP Section -->
    <h3 style="font-size: 18px; margin: 10px 0; color: #555;">Your OTP for Email Verification</h3>
    <h5 style="font-size: 18px; margin: 5px 0; color: #555;">Valid for 5 Minutes Only</h5>
    <div style="margin: 15px 0;">
      <h1 style="font-size: 40px; color: #2596be;">${otp}</h1>
    </div>

    <!-- Important Message -->
    <p style="font-size: 16px; background-color: #f8d7da; color: #721c24; padding: 10px; border-radius: 8px; margin: 15px 0;">
      ⚠ Be Careful! Do not share your OTP or credentials with anyone.
    </p>

    <!-- Thank You Section -->
    <p style="font-size: 14px; margin-top: 25px; color: #555;">Thank you for choosing our services. We are here to serve you better!</p>

    <!-- Footer Section -->
    <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e9ecef;">
      <p style="font-size: 12px; color: #777;">If you have any questions, feel free to contact us at <a href="mailto:aniskhan20171@gmail.com" style="color: #2596be; text-decoration: none;">support@familyGullak.com</a>.</p>
      <p style="font-size: 12px; color: #777;">© 2024 Family Gullak. All rights reserved.</p>
    </div>
  </div>
</div>
`
//    attachments: [
  // {
    //   filename: 'Anis.jpg', // Change the filename to the desired name
    //   path: 'http://res.cloudinary.com/dgmkwv786/image/upload/v1699028509/gpdu82jfrgsavbhkhav1.jpg' // URL to your image
    // }
  // ]
  };
    await transporter.sendMail(mailOptions);
    

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error");
  }
});




// update password api
// console.log( sharedOTP + "sharedotp")
routes.post('/changepassword', fetchuser, async (req, res) => {
  try {
    // const email = req.body.email;
    const providedOTPtochnagepassword = req.body.otp;
 
      //  (matching the one sent)
    const otppass = sharedOTP
    // console.log(otppass + "otppass");
      if (providedOTPtochnagepassword !== otppass) {
        return res.status(400).json({ success, message: "Invalid OTP" });
      }

    const salt = await bcrypt.genSalt(10);
    const secnewpass = await bcrypt.hash(req.body.newpassword, salt);
    await User.findByIdAndUpdate(req.user.id, { password: secnewpass });
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to change password" });
  }
});


//  forgot password

routes.post('/forgotpassword', async (req, res) => {
try {
    const email = req.body.email;
    const providedOTP = req.body.otp;
    const newPassword = req.body.newpassword;

    // Fetch the stored OTP from your server (e.g., from the in-memory object or database)
    
const otppass = sharedOTP

  if (providedOTP !== otppass) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    const salt = await bcrypt.genSalt(10);
    const secnewpass = await bcrypt.hash(newPassword, salt);

    await User.findOneAndUpdate({ email }, { password: secnewpass });

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to change password' });
  }
});

  


routes.post('/createuser', [
  body('email', 'Enter valid Email').isEmail(),
  body('name', 'Enter Valid Name').isLength({ min: 5 }),
  body('password', 'Enter valid password').isLength({ min: 5 }),
  body('profile', 'Please Select Profile').exists(),
  body('familycode', 'Enter Family Code').exists(),
  body('role', 'Role is required').isIn(['user', 'admin']), // Validate role
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, name, password, profile, familycode, role , bankDetails } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success, message: "User with this email already exists" });
    }

    // If role is admin, ensure the family code is unique
    if (role === "admin") {
      const existingFamilyCode = await User.findOne({ familycode, role: "admin" });
      if (existingFamilyCode) {
        return res.status(400).json({ success, message: "Family code already exists. Please use a different one." });
      }
    }

    // If role is user, ensure the family code exists
    if (role === "user") {
      const existingFamilyCode = await User.findOne({ familycode, role: "admin" });
      if (!existingFamilyCode) {
        return res.status(400).json({ success, message: "Invalid family code. Please enter a valid one." });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: secPass,
      profile,
      familycode,
      role,
      bankDetails,
    });

    const data = {
      user: { id: user.id },
      role: { role: user.role },
    };
    const token = jwt.sign(data, jwt_sec);
    success = true;

    res.json({ success, token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occurred");
  }
});



// login


routes.post('/login', [
  body('email', 'Enter valid Email').isEmail(),
  body('password', 'Enter valid password').exists(),
  body('otp', 'OTP is required').isLength({ min: 6, max: 6 }), // Ensure OTP is 6 digits
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password, otp } = req.body;

  try {
    // Check if user exists by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success, errors: "Invalid credentials" });
    }
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      return res.status(400).json({ success, errors: "Invalid credentials" });
    }

    // Validate the OTP
    if (otp !== sharedOTP) {
      return res.status(400).json({ success, message: "Invalid OTP" });
    }

    const data = {
      user: { id: user.id },
      role:{ role:user.role},
    };
    const token = jwt.sign(data, jwt_sec);

    success = true;
    res.json({ success, token });

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Some error occurred");
  }
});


// change Familycode:
routes.post("/changefamilycode" , fetchuser ,   async(req , res) =>{
  try {
    // const email = req.body.email;
    const providedOTPtochnagepassword = req.body.otp;

    const otppass = sharedOTP
    // console.log(otppass + "otppass");
      if (providedOTPtochnagepassword !== otppass) {
        return res.status(400).json({ success, message: "Invalid OTP" });
      }
    const new_familycode  = await req.body.familycode;
    console.log(new_familycode)
    await User.findByIdAndUpdate(req.user.id, { familycode: new_familycode });
    console.log(req.user.id)
    return res.status(200).json({ message: "familycode changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to change familycode " });
  }
});




// getuser

routes.post('/getuser',fetchuser, async (req, res ) =>{
  try {
   const userID =await req.user.id; 
   const user = await  User.findById(userID).select("-password")
   res.send(user)
  } catch (error) {
    console.log(error.message)
    res.status(5000).send("Some Error occured")   
  }
})






// Amin portal

// const isAdmin = (req, res, next) => {
//   if (req.user.role !== "admin") {
//     console.log(req.user.role)
//     return res.status(403).json({ Error: "Access denied: Admins only." });
//   }
//   next(); // Proceed to the next middleware or route handler
// };
routes.get("/admin/users", fetchuser, async (req, res) => {
  try {
    const userID = req.user.id; 
    const user = await User.findById(userID);
    if (user.role !== "admin") {
      return res.status(403).json({ Error: "Access denied: Admins only." });
    }

    const searchName = req.query.name;
    if (!searchName) {
      return res.status(200).json([]);
    }
    const users = await User.find({
      _id: { $ne: userID }, 
      name: { $regex: `^${searchName}$`, $options: "i" } 
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Failed to fetch users." });
  }
});







// routes.get("/admin/users", fetchuser, isAdmin, async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch users" });
//   }
// });

// Delete User
routes.delete("/admin/deleteuser/:id", fetchuser, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// Update User Role
// routes.put("/admin/updateuser/:id", fetchuser, async (req, res) => {
//   try {
//     const { role } = req.body;
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { role },
//       { new: true }
//     );
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update user" });
//   }
// });

module.exports = routes; 