import MenuItem from "../Models/MenuItem.js";
import Order from "../Models/Order.js";
import User from "../Models/User.js";

import catchAsyncError from "../Middleware/CatchAsyncError.js";
import ErrorHandler from "../Middleware/Error.js";
import Address from "../Models/Address.js";
import { sendToken } from "../Utils/SendToken.js";









// --- USER MANAGEMENT ---
export const adminLogin = catchAsyncError(async (req, res, next) => {
  const { email, password, secretKey } = req.body;

  let user = await User.findOne({ email, role: "Admin" }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid email or password", 404));

  const isMatchPassword = await user.matchPassword(password);

  if (!isMatchPassword) {
    return next(new ErrorHandler("Invalid Email or Password", 404));
  }

  if (secretKey !== process.env.ADMIN_SECRET_KEY) {
    return next(new ErrorHandler("Invalid Credentials", 401));
  }

  sendToken(res, user, "Admin Login Successfully", 200);
});

// Get all users with wallet & referral info
export const getAllUsers = catchAsyncError(async (req, res) => {
  const { query } = req.query;

  const filter = {};

  if (query && query.trim() !== '') {
    const regex = new RegExp(query, 'i');

    filter.$or = [
      { name: regex },
      { email: regex },
      { phoneNumber: regex },
    ];
  }

  const users = await User.find(filter).select('-password');

  res.status(200).json({
    success: true,
    message: "User Fetched",
    users
  });
});



// Get user by ID
export const getUserById = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return next(new ErrorHandler("User not found", 404));

  const address = await Address.find({ user: user._id });
const data = {
    ...user.toObject(),
    address: address || [],
  };
  res.status(200).json({ success: true, message: "User fetched successfully", data });
});

// Block user
export const blockUser = catchAsyncError(async (req, res, next) => {  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: "blocked" },
    { new: true }
  );
  if (!user) return next(new ErrorHandler("User not found", 404));
  res.status(200).json({ success: true, message: `${user.name} blocked successfully`, user });
});

// Unblock user
export const unblockUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: "active" },
    { new: true }
  );
  if (!user) return next(new ErrorHandler("User not found", 404));
  res.status(200).json({ success: true, message: `${user.name} unblocked successfully`, user });
});

// user role
export const updateUserRole = catchAsyncError(async (req, res, next) => {
  const { role } = req.body;
  if (!["User", "Admin"].includes(role)) {
    return next(new ErrorHandler("Invalid Role Value", 400));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  );
  if (!user) return next(new ErrorHandler("User not found", 404));

  res
    .status(200)
    .json({ success: true, message: `User role updated to ${role}`, user });
});

// get all customers
export const getAllCustomers = catchAsyncError(async (req, res, next) => {
  const customers = await User.find({ role: "User" }).select("-password");

  if (!customers || customers.length === 0) {
    return next(new ErrorHandler("No customers found", 404));
  }
  res
    .status(200)
    .json({ success: true, message: "All Customers Fetched Successfully", customers });
});

// Delete user profile
export const deleteProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params._id);

  console.log()

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // if (user.role === "Admin") {
  //   return next(new ErrorHandler("Admins are not allowed to delete their own profile.", 403))
  // }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: `${user.name}'s Profile deleted successfully`,
    user
  });
});



// --- MENU ITEM MANAGEMENT ---
// Get all menu items
export const getAllMenuItems = catchAsyncError(async (req, res, next) => {

  const { query } = req.query;


  const filter = {};

  if (query && query.trim() !== '') {
    const regex = new RegExp(query, 'i');

    filter.$or = [
      { name: regex },
      { category: regex },
    ];
      if (!isNaN(query)) {
        filter.$or.push({ price: Number(query) });
      }
  }
  
  const menuItems = await MenuItem.find(filter);
  if (menuItems.length === 0)
    return next(new ErrorHandler("No menu items available", 404));
  
  const count  = await MenuItem.countDocuments()
  res.status(200).json({
    success: true,
    message: "Available menu items fetched successfully",
    menuItems,
    count
  });
});

// Get menu item by ID
export const getMenuItemById = catchAsyncError(async (req, res, next) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) return next(new ErrorHandler("Menu item not found", 404));
  res.status(200).json({
    success: true,
    message: "Menu item fetched successfully",
    item,
  });
});


// Create a new menu item
export const createMenuItem = catchAsyncError(async (req, res, next) => {
  const {
    name,
    description,
    price,
    category,
    isVegetarian,
    isVegan,
  } = req.body;

  const numericPrice = Number(price);

  console.log("Menu Data : ", name, description, numericPrice, category, isVegetarian, isVegan);
  console.log("Image file : ", req.file);

  if (!req.file) {
    return next(new ErrorHandler("Image file is required", 400));
  }

  const imageUrl = req.file.path;

  const isExistAddress = await Address.findOne({ user: req.user._id });
  if (!isExistAddress)
    return next(new ErrorHandler("Add Your Kitchen Address First", 404));

  // Create new menu item
  const newMenuItem = await MenuItem.create({
    createdBy: req.user._id,
    name,
    description,
    price: numericPrice,
    image: imageUrl || "",
    category,
    isVegetarian,
    isVegan,
  });

  res.status(201).json({
    success: true,
    message: "Menu item created successfully",
    menuItem: newMenuItem,
  });
});



// Update a menu item
export const updateMenuItem = catchAsyncError(async (req, res, next) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) return next(new ErrorHandler("Menu item not found", 404));



  Object.assign(item, req.body);
  const updated = await item.save();
  if (!updated) return next(new ErrorHandler("Failed to update item", 500));
  // Return success response
  console.log("Updated")
  res.status(200).json({
    success: true,
    message: "Menu item updated successfully",
    menuItem: updated,
  });
});


// Delete a menu item
export const deleteMenuItem = async (req, res, next) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) return next(new ErrorHandler("Menu item not found", 404));

  res.status(200).json({ success: true, message: "Menu item deleted", _id: req.params.id });
};
// Toggle availability of a menu item
export const toggleMenuItemAvailability = catchAsyncError(
  async (req, res, next) => {
    const { menuitemId } = req.params;

    if (!menuitemId) return next(new ErrorHandler("Menu item ID is required", 400));
    const item = await MenuItem.findById(menuitemId);

    if (!item) return next(new ErrorHandler("Menu item not found", 404));

    // Toggle availability
    item.isAvailable = !item.isAvailable;
    const updatedItem = await item.save();

    res.status(200).json({
      success: true,
      message: `${item.name} is now ${
        updatedItem.isAvailable ? "available" : "unavailable"
      }`,
      updatedItem

        });
  }
);  

// --- ORDER MANAGEMENT ---

// Filter orders by status, user query params
// get all order to show in admin panel
export const getAllOrders = catchAsyncError(async (req, res, next) => {
   const { date } = req.query;

  let filter = {};

  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999); // full day range

    filter.createdAt = { $gte: start, $lte: end };
  }

  const orders = await Order.find(filter)
    .populate("userID")
    .populate("items.item")
    .populate('deliveryAddressID')
    .sort({ createdAt: -1 });

  if (!orders || orders.length === 0) {
    return next(new ErrorHandler("No orders found", 404));
  }

  const count = await Order.countDocuments()

  res.status(200).json({
    success: true,
    message: "All orders fetched successfully",
    orders,
    count
  });
});

// Update order status forcefully by admin
export const updateOrderStatus = catchAsyncError(async (req, res, next) => {
  const { status } = req.query;
  console.log("status : ",req.query)
  if (!status) {
    return next(
      new ErrorHandler("New Status Is Required to updated Status", 400)
    );
  }
  const validStatuses = [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
  ];
  if (!validStatuses.includes(status)) {
    return next(new ErrorHandler("Invalid order status", 400));
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  )
    .populate("userID")
    .populate("items.item")
    .populate('deliveryAddressID');
  if (!order) next(new ErrorHandler("Order not found!", 400));

  res.status(200).json({
    success: true,
    message: `Order status Updated to ${order.status} `,
    status,
    id: req.params.id,
    order
  });
});

// get order by id
export const getOrderByID = catchAsyncError(async(req,res,next)=>{
  const order = await Order.findById(req.params.id)
  .populate("userID", "name email phoneNumber  ")
  if (!order) return next(new ErrorHandler("Order not found", 404));

  res.status(200).json({
    success: true,
    message: "Order fetched successfully",
    order,
  });
});

// delete order by id
export const deleteOrder = catchAsyncError(async (req, res, next) => {

  const id = req.params.id
  const order = await Order.findByIdAndDelete(id);
  console.log(order)
  if (!order) return next(new ErrorHandler("Order not found", 404));

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
    id,
    name:order.name
  });
});




// get order stats 
export const getOrderStats = catchAsyncError(async (req, res, next) => {

  const { lastXDays = 3 } = req.query;
  console.log("ok 1")
  const stats = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalPrice: { $sum: "$totalPrice" },
      },
    },
    {
      $project: {
        status: "$_id",
        count: 1,
        totalPrice: 1,
      },
    },
  ]);

  console.log("ok 2")

  if (!stats || stats.length === 0) {
    return next(new ErrorHandler("No order statistics found", 404));
  }

  

  // Sort stats by status for better readability
  const statusOrder = [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ]
  stats.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));

  // Format the stats to include total count and total price
  const formattedStats = stats.map(stat => ({
    status: stat.status,
    count: stat.count,
    totalPrice: stat.totalPrice,
  }));


  //get last X days stats
  const lastXDaysStats = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(Date.now() - lastXDays * 24 * 60 * 60 * 1000), // Last X days
        },
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalPrice: { $sum: "$totalPrice" },
      },
    },
    {
      $project: {
        status: "$_id",
        count: 1,
        totalPrice: 1,
      },
    },
  ]);

  if (!lastXDaysStats || lastXDaysStats.length === 0) {
    return next(new ErrorHandler(`No order statistics found for the last ${lastXDays} days`, 404));
  }

  // Sort last X days stats by status for better readability
  lastXDaysStats.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));

  // Format the last X days stats to include total count and total price
  const formattedLastXDaysStats = lastXDaysStats.map(stat => ({
    status: stat.status,
    count: stat.count,
    totalPrice: stat.totalPrice,
  }));


  // last 180 days stats


  res.status(200).json({
    success: true,
    message: "Order statistics fetched successfully",
    stats: formattedStats,
    lastXDaysStats: formattedLastXDaysStats
  });
});

// --- Stats REPORTS ---

export const getAllStats = catchAsyncError(async (req, res, next) => {
  const users = await User.countDocuments();
  const orders = await Order.countDocuments();
  const menus = await MenuItem.countDocuments();

  const userGrowth = await User.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const orderGrowth = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);


  const menuGrowth = await MenuItem.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  // Check if any stats are missing
  if (!userGrowth || userGrowth.length === 0) {
    return next(new ErrorHandler("No user growth data found", 404));
  }
  if (!orderGrowth || orderGrowth.length === 0) {
    return next(new ErrorHandler("No order growth data found", 404));
  }

  if (!menuGrowth || menuGrowth.length === 0) {
    return next(new ErrorHandler("No menu growth data found", 404));
  }

  if (!users && !orders  && !menus) {
    return next(new ErrorHandler("No stats found", 404));
  }

  const currentDate = new Date();
  const currentMonth = currentDate.toISOString().slice(0, 7); // YYYY-MM format
  const currentYear = currentDate.getFullYear();
  const currentMonthData = userGrowth.find((item) => item._id === currentMonth);
  if (!currentMonthData) {
    userGrowth.push({ _id: currentMonth, count: 0 });
  }
  userGrowth.sort((a, b) => new Date(a._id) - new Date(b._id));
  orderGrowth.sort((a, b) => new Date(a._id) - new Date(b._id));
  menuGrowth.sort((a, b) => new Date(a._id) - new Date(b._id));

  res.status(200).json({
    success: true,
    message: "Stats Fetched Successfully",
    stats: {
      users,
      orders,
      menus,
      userGrowth: userGrowth.map((item) => ({
        month: item._id,
        count: item.count,
      })),
      orderGrowth: orderGrowth.map((item) => ({
        month: item._id,
        count: item.count,
      })),
 
      menuGrowth: menuGrowth.map((item) => ({
        month: item._id,
        count: item.count,
      })),
      currentMonth: {
        month: currentMonth,
        users: currentMonthData ? currentMonthData.count : 0,
      },
      currentYear: {
        year: currentYear,
        users: userGrowth
          .filter((item) => item._id.startsWith(currentYear))
          .reduce((acc, item) => acc + item.count, 0),
      },
      currentMonthOrders:
        orderGrowth.find((item) => item._id === currentMonth)?.count || 0,
      currentYearOrders: orderGrowth
        .filter((item) => item._id.startsWith(currentYear))
        .reduce((acc, item) => acc + item.count, 0),
      currentMonthMenus:
        menuGrowth.find((item) => item._id === currentMonth)?.count || 0,
      currentYearMenus: menuGrowth
        .filter((item) => item._id.startsWith(currentYear))
        .reduce((acc, item) => acc + item.count, 0),
    },
  });
});


