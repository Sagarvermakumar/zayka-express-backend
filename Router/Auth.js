import { Router } from "express";
import {
    createUser,
    loginUser,
    logoutUser
} from "../controllers/User.js";
import { validateRequest } from "../Middleware/validateMiddleware.js";
import { loginValidator, registerValidator } from "../validators/user.js";

const router = Router();

/**
 * @route   POST /api/v1/user/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", registerValidator, validateRequest, createUser);

/**
 * @route   POST /api/v1/user/login
 * @desc    Log in an existing user
 * @access  Public
 */
router.post("/login", loginValidator, validateRequest, loginUser);


/**
 * @route   GET /api/v1/user/logout
 * @desc    Log out the current user
 * @access  Private
 */
router.post("/logout", logoutUser);


export default router;
