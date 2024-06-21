const express = require("express");
const path = require("path");
const router = express.Router();
const { upload } = require("../multer");
const User = require("../Model/User");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../Utils/sendMail");
const ErrorHandler = require("../Utils/ErrorHandler");

const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const sendToken = require("../Utils/jwtToken");
const { isAuthenticated } = require("../Middleware/auth");

router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });

    if (userEmail) {
      const fileName = req.file.filename;
      const filePath = uploads/${fileName};
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error deleting File" });
        }
      });
      return next(new ErrorHandler("User already exists", 400));
    }
    const filename = req.file.filename;
    const fileUrl = path.join(filename);
    console.log(filename, fileUrl);
    const user = {
      name: name,
      email: email,
      password: password,
      avatar: {
        public_id: fileUrl,
        url: fileUrl,
      },
    };
    
    const activationToken = createActivationToken(user);
    const activationUrl = http://localhost:5173/activation/${activationToken};

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your Account",
        message: `Hello ${user.name} Please Click on the link to activate your account: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: Please check your email :- ${user.email} to activate your Account,
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
    
  } catch (err) {

    return next(new ErrorHandler(err.message, 400));
  }
});

//function to create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

//activate user message
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;
      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newUser) {
        return next(new ErrorHandler("Invalid Token", 400));
      }

      const { name, email, password, avatar } = newUser;

      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("user already exists", 400));
      }

      user = await User.create({ name, email, password, avatar });
      sendToken(user, 201, res);
      
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  })
);

//login function
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new ErrorHandler("Please Provide all fields", 400));
      }
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandler("Requested user not found", 400));
      }
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return next(new ErrorHandler("Invalid Credentials", 400));
      }
      sendToken(user, 201, res);
    } catch (err) {
      console.log(err);
      return next(new ErrorHandler(err.message, 500));
    }
  })
);

//load user
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("Requested user not found", 400));
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  })
);

//logout user

router.get(
  "/logout",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });

      res.status(201).json({
        success: true,
        message: "Logout Successful!",
      });
    } catch (err) {
      return next(Error(err.message, 500));
    }
  })
);

module.exports = router;