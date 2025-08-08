import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import catchAsyncError from "./CatchAsyncError.js";
import ErrorHandler from "./Error.js";

/**
 * @desc    Middleware to check if the user is authenticated
 * @use     This middleware checks if the user is logged in by verifying the JWT token
 *          stored in cookies. If the token is valid, it attaches the user information to the request object.
 */
export const isAuthenticate = catchAsyncError(async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return next(new ErrorHandler("You need to login first...", 400));
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  next();
});



/**
 * @desc    Middleware to check if the user is an admin
 * @use     This middleware checks if the authenticated user has an admin role.
 *          If the user is not an admin, it throws an error.
 */
export const isAdmin = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user || user.role !== "Admin") {
    return next(new ErrorHandler("Access denied. Admins only.", 400));
  }

  // If the user is an admin, allow the request to proceed
  next();
});
