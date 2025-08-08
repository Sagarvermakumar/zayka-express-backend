// routes/adminRoutes.js
import express from "express";
import {
  adminLogin,
  blockUser,
  createMenuItem,
  deleteMenuItem,
  deleteProfile,
  getAllCustomers,
  getAllMenuItems,
  getAllOrders,
  getAllStats,
  getAllUsers,
  getMenuItemById,
  getOrderByID,
  getOrderStats,
  getUserById,
  toggleMenuItemAvailability,
  unblockUser,
  updateMenuItem,
  updateOrderStatus,
  updateUserRole
} from "../controllers/Admin.js";
import { isAdmin, isAuthenticate } from "../Middleware/Auth.js";
import { avatarUpload } from "../Middleware/upload.js";
import { validateRequest } from "../Middleware/validateMiddleware.js";
import { createMenuItemValidator } from "../validators/menuItem.js";
import { adminLoginValidator } from "../validators/user.js";
import { deleteCancelledOrder } from "../controllers/Order.js";
import { getMyProfile } from "../controllers/User.js";

const router = express.Router();




/**
 * @route   POST /api/v1/admin/login
 * @desc    Log in an existing admin
 * @access  Public
 */
router.post("/login", adminLoginValidator, validateRequest, adminLogin);





router.use(isAuthenticate, isAdmin);


// =======================================>>>>>>>>> User Management Routes <<<<<<<<<<<<<<<<<<<<<<=======================================

// 🧑‍💻 User Routes
/**
 * @route   GET /api/v1/admin/user/all
 * @desc    Get all users
 * @access  Private (only accessible by admin)
 */
router.get("/user/all", getAllUsers);

/** 
 * @route   GET /api/v1/admin/user/:id
 * @desc    Get user by ID
 * @access  Private (only accessible by admin)
 * @params  id - user ID
 */
router.get("/user/:id", getUserById);

/** 
 * @route   PATCH /api/v1/admin/user/:id/block
 * @desc    Block a user
 * @access  Private (only accessible by admin)
 * @params  id - user ID
 */
router.patch("/user/:id/block", blockUser);

/** * @route   PATCH /api/v1/admin/user/:id/unblock
 * @desc    Unblock a user
 * @access  Private (only accessible by admin)
 * @params  id - user ID
 */
router.patch("/user/:id/unblock", unblockUser);

/** * @route   PATCH /api/v1/admin/user/:id/role
 * @desc    Update user role (e.g., from User to Vendor)
 * @access  Private (only accessible by admin)
 * @params  id - user ID
 */
router.patch("/user/:id/role", updateUserRole);

/** 
 * @route   GET /api/v1/admin/user/customers
 * @desc    Get all customers
 * @access  Private (only accessible by admin)
 * @returns  {Array} - List of all customers
 */
router.get("/user/customers", getAllCustomers);
/**
 * @route   DELETE /api/v1/admin/user/delete-profile
 * @desc    Delete the account/profile of the logged-in user
 * @access  Private
 */
router.delete("/user/:_id/delete-profile", isAuthenticate, deleteProfile);


// Menu Management


//=================================>>>>>>>>>>>>>>>>>>>>🍔 Menu Item Management Routes <<<<<<<<<<<<<<<<<<<<===============================
/**
 * @desc    Create a new menu item
 * @route   POST /api/v1/admin/menu-item/create
 * @access  Private (only authenticated vendors can create menu items)
 * @body    name, description, price, ingredients, image, category, isVegetarian, isVegan, isGlutenFree, isSpicy
 */
router.post("/menu-item/create",  avatarUpload.single("image"), createMenuItemValidator, validateRequest ,createMenuItem);



/**
 * @desc    Get all menu items
 * @route   GET /api/v1/admin/menu-item/all
 * @access  Public (anyone can view menu items)
*/
router.get("/menu-item/all", getAllMenuItems);



/**
 * @desc    Get  menu items by id
 * @route   GET /api/v1/admin/menu-item/:id
 * @access  Public (anyone can view menu items)
 */
router.get("/menu-item/:id", getMenuItemById);



/**
 * @desc    Delete a menu item
 * @route   DELETE /api/v1/admin/menu-item/delete/:id
 * @access  Private (only authenticated vendors can delete their menu items)
 * @params  id - menu item ID
 */
router.delete("/menu-item/delete/:id", deleteMenuItem);

/**
 * @desc    Update a menu item
 * @route   PUT /api/v1//admin/menu-item/update/:id
 * @access  Private (only authenticated vendors can update their menu items)
 * @params  id - menu item ID
 * @body    name, description, price, imageUrl, category, isVegetarian, isVegan, 
 */
router.patch("/menu-item/update/:id",  updateMenuItem);




/**
 * @desc    Toggle availability of a menu item
 * @route   PATCH /api/v1/admin/menu-item/toggle/:menuitemId
 * @access  Private (only authenticated vendors can toggle availability)
 * @params  id - menu item ID
 */

router
  .route("/menu-item/toggle/:menuitemId")
  .patch( toggleMenuItemAvailability);

/**
 * @desc    Get all menu items
 * @route   GET /api/v1/menu-item/all
 * @access  Public (anyone can view menu items)
 * */


//========================>>>>>>>>>>>>>>>>> Order Management Routes <<<<<<<<<<<<<<<<<<<<===============================

/**
 * @desc    Get all orders
 * @route   GET /api/v1/admin/order/all 
 * @access  Private (only accessible by admin)
 * @returns {Array} - List of all orders
 * */
router.get("/order/all", getAllOrders);
/**
 * @desc    Update the status of an order
 * @route   PATCH /api/v1/admin/order/update-status/:id
 * @access  Private (only accessible by admin)
 * @params  id - order ID
 */
router.patch("/order/update-status/:id", updateOrderStatus);

/**
 * @desc    Get all order by ID
 * @route   GET /api/v1/admin/vendor/:vendorId/orders
 * @access  Private (only accessible by admin)
 */
router.get("/order/:id", getOrderByID);

/**
 * @desc   Delete a cancelled order
 * @route  DELETE /api/v1/admin/order/delete/:id
 * @access Private (only accessible by admin)
 * @params id - order ID
 */
router.delete("/order/delete/:id", deleteCancelledOrder);

// ========================>>>>>>>>>>>>>>>>> Order Statistics and Reports <<<<<<<<<<<<<<<<<<<<===============================



/**
 * @desc    Get order statistics
 * @route   GET /api/v1/admin/order/stats
 * @access  Private (only accessible by admin)
 * @returns {Object} - Order statistics
 */
router.get("/orders/stats", getOrderStats); // For getting order statistics

/**
 * @desc    Get financial reports
 * @route   GET /api/v1/admin/financial-reports
 * @access  Private (only accessible by admin)
 * @returns {Object} - Financial reports data
 */
router.get("/stats/all", getAllStats);



// Financial Reports


export default router;
