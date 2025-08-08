import catchAsyncError from "../Middleware/CatchAsyncError.js";
import User from "../Models/User.js";
import ErrorHandler from "../Middleware/Error.js";
import { sendToken } from "../Utils/SendToken.js";
import crypto from "crypto";
import Address from "../Models/Address.js";
/**
 * @desc    Register a new user
 * @route   POST /api/v1/user/register
 * @access  Public
 */
export const createUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, phoneNumber, referredBy } =
    req.body || {};


  let userExists = await User.findOne({ email }).select("+password");

  if (userExists) return next(new ErrorHandler("User Already Exist", 400));

  // Generate unique referralCode for this user (e.g. first 6 hex chars)
  let referralCode = crypto.randomBytes(3).toString("hex").toUpperCase();

  // Make sure referral code is unique (very rare collision)
  while (await User.findOne({ referralCode })) {
    referralCode = crypto.randomBytes(3).toString("hex").toUpperCase();
  }

  const newUserData = {
    name,
    email,
    password,
    phoneNumber,
    referralCode,
    referredBy: referredBy || null,
    walletBalance: 0,
  };

  // If referredBy code is valid, give wallet reward to referrer
  if (referredBy) {
    const referrer = await User.findOne({ referralCode: referredBy });
    if (referrer) {
      referrer.walletBalance += 50; // reward to referrer
      await referrer.save();

      newUserData.walletBalance = 25; // reward to new user
    } else {
      return next(new ErrorHandler("Invalid Referral Code", 400));
    }
  }

  const user = await User.create(newUserData);

  sendToken(res, user, "Registered Successfully", 201);
});

/**
 * @desc    Log in an existing user
 * @route   POST /api/v1/user/login
 * @access  Public
 */
export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid email or password", 404));

  const isMatchPassword = await user.matchPassword(password);

  if (!isMatchPassword) {
    return next(new ErrorHandler("Invalid Email or Password", 404));
  }

  sendToken(res, user, "Login Successfully", 200);
});

/**
 * @desc    Log out the currently logged-in user
 * @route   GET /api/v1/user/logout
 * @access  Private
 */
export const logoutUser = catchAsyncError((req, res) => {
  return res
    .status(200)
    .cookie("token", "", {
      maxAge: 0,
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      sameSite: "none", // or 'None' if cross-origin
    })
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
});

/**
 * @desc    Get profile details of the logged-in user
 * @route   GET /api/v1/user/me
 * @access  Private
 */
export const getMyProfile = async(req, res) => {
  const user = req.user;
  const address = await Address.find({ user: user._id });
const data = {
    ...user.toObject(),
    address: address || [],
  };
  res.status(200).json({
    success: true,
    message: "Profile fetched",
    user: data,
  });
};

/**
 * @desc    Change password for the logged-in user
 * @route   PUT /api/v1/user/change-password
 * @access  Private
 */
export const changePassword = catchAsyncError(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if(currentPassword === newPassword) {
    return next(new ErrorHandler("New password cannot be the same as current password", 400));
  }

  const user = await User.findById(req.user._id).select("+password"); // Ensure password field is selected

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Compare current password with stored password
  const isMatch = await user.matchPassword(currentPassword); // Ensure comparePassword is defined in your model

  if (!isMatch) {
    return next(new ErrorHandler("Incorrect current password", 401));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

/**
 * @desc    Update profile information of the logged-in user
 * @route   PUT /api/v1/user/update-profile
 * @access  Private
 */
export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { name, email, phoneNumber } = req.body || {};

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (name) user.name = name || user.name;
  if (email) user.email = email || user.email;
  if (phoneNumber) user.phoneNumber = phoneNumber || user.phoneNumber;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

export const updateProfilePic = catchAsyncError(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(new ErrorHandler("Please Upload Your Avatar", 400));
  }

  const user = await User.findById(req.user._id);

  // Only allow if: user is updating their own profile OR admin
  if (req.user._id.toString() !== user._id.toString() && req.user.role !== "Admin") {
    return next(new ErrorHandler("You are not authorized to update this profile picture", 403));
  }

  user.avatar = {
    public_id: file.filename,
    url: file.path,
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: "Your Profile Pic Updated Successfully",
    user
  });
});



