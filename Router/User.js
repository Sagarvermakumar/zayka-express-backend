import { Router } from "express";
import {
  changePassword,
  getMyProfile,
  updateProfile,
  updateProfilePic
} from "../controllers/User.js";
import { isAuthenticate } from "../Middleware/Auth.js";
import { avatarUpload } from "../Middleware/upload.js";
import { validateRequest } from "../Middleware/validateMiddleware.js";
import { changePasswordValidator, updateProfileValidator } from "../validators/user.js";

const router = Router();


/**
 * @route   GET /api/v1/user/me
 * @desc    Get logged-in user's profile
 * @access  Private
 */
router.get("/me", isAuthenticate, getMyProfile);

/**
 * @route   PUT /api/v1/user/change-password
 * @desc    Change password for logged-in user
 * @access  Private
 */
router.put("/change-password", isAuthenticate, changePasswordValidator, validateRequest, changePassword);

/**
 * @route   PUT /api/v1/user/update-profile
 * @desc    Update profile details for logged-in user
 * @access  Private
 */
router.put("/update-profile", isAuthenticate, updateProfileValidator, validateRequest, updateProfile);
/**
 * @desc    Update User profile Picture
 * @route   PUT /api/v1/profile/update/avatar
 */

router.patch(
  "/profile/update/avatar",
  isAuthenticate,
  avatarUpload.single("avatar"),
  updateProfilePic
);

export default router;
