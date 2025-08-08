import catchAsyncError from "../Middleware/CatchAsyncError.js";
import Address from "../Models/Address.js";
import MenuItem from "../Models/MenuItem.js";
import Order from "../Models/Order.js";
import User from "../Models/User.js";
import ErrorHandler from "../Middleware/Error.js";



// Place a new order
export const placeNewOrder = catchAsyncError(async (req, res, next) => {
  const { items, paymentMethod } = req.body || {};

  //  Validate items
  if (!items || !Array.isArray(items) || items.length === 0) {
    return next(new ErrorHandler("Missing items in order", 400));
  }

  //  Check  address if not exist then return error
  const isExistAddress = await Address.findOne({ user: req.user._id });
  if (!isExistAddress) {
    return next(new ErrorHandler("Add Address First", 404));
  }

  // Get all item IDs from the request
  const itemIds = items.map(i => i.item);

  //Check if any pending order contains any of these items
  const existingOrder = await Order.findOne({
    user: req.user._id,
    "items.item": { $in: itemIds },
    status: { $nin: ["delivered", "cancelled"] },
  });

  if (existingOrder) {
    return next(new ErrorHandler("You have already placed a similar order. Please wait or update it.", 400));
  }

  //  Calculate total price
  let totalPrice = 0;
  for (const i of items) {
    const menuItem = await MenuItem.findById(i.item);
    if (!menuItem) {
      return next(new ErrorHandler("Invalid menu item in your order", 404));
    }
    totalPrice += menuItem.price * i.quantity;
  }

  //  Create order
  const order = await Order.create({
    userID: req.user._id,
    items,
    totalPrice,
    deliveryAddressID: isExistAddress?._id,
    paymentMethod,
  });

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order,
  });
});


// Check order status
export const checkOrderStatus = catchAsyncError(async (req, res, next) => {
  const orderId = req.params.id;

  const order = await Order.findById(orderId).populate("items.item");

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  console.log("Order found:", order);

  // Make sure only the user who placed the order can access it
  if (order.userID.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Unauthorized access", 403));
  }

  res.status(200).json({
    success: true,
    orderStatus: `Your order is currently ${order.status}`,

  });
});


// Cancel an order 
export const cancelOrder = catchAsyncError(async (req, res) => {

    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only the user who placed it can cancel it
    if (order.userID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: Not your order" });
    }

    // Only allow cancellation if status is pending or confirmed
    if (order.status === "cancelled") {
      return res.status(400).json({ message: "Order already cancelled" });
    }

    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({
        message: `Cannot cancel an order with status: ${order.status}`,
      });
    }

    // If wallet credits were used, refund them
    if (order.walletUsed && order.walletUsed > 0) {
      const user = await User.findById(order.user);
      user.wallet += order.walletUsed;
      await user.save();
    }

    order.status = "cancelled";
    order.cancelledAt = new Date();
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully. Wallet refunded (if used).",
      orderStatus: order.status,
      cancelledAt: order.cancelledAt,
    });

});

// Delete a cancelled order
export const deleteCancelledOrder = catchAsyncError(async (req, res, next) => {
  const orderId = req.params.id;
console.log("Order id : ", orderId);
  const order = await Order.findById(orderId);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

// Ensure the order is cancelled before deletion
  if (order.status !== "cancelled") {
    return next(new ErrorHandler("Only cancelled orders can be deleted", 400));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
    orderId
  });
});


// Get all orders of a specific user
export const getAllOrdersOfSpecificUser = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ userID: req.user._id })
    .populate("items.item")
    .sort({ createdAt: -1 });

  if (!orders || orders.length === 0) {
    return next(new ErrorHandler("No orders found for this user", 404));
  }

  res.status(200).json({
    success: true,
    message: "Your all orders fetched successfully",
    orders,
  });
});

// Get order by ID
export const getOrderById = catchAsyncError(async (req, res, next) => {
  const orderId = req.params.id;

  const order = await Order.findById(orderId)
    .populate("userID")
    .populate("items.item");

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Order Details",
    order,
  });
});

//Re-order (Quick Repeat Order)
export const reorder = catchAsyncError(async (req, res, next) => {
  const orderId = req.params.id;

  const previousOrder = await Order.findById(orderId).populate("items.item");

  if (!previousOrder) {
    return next(new ErrorHandler("Previous order not found", 404));
  }

  // Create a new order with the same items and user
  const newOrder = await Order.create({
    userID: previousOrder.userID,
    items: previousOrder.items,
    totalPrice: previousOrder.totalPrice,
    deliveryAddressID: previousOrder.deliveryAddressID,
    paymentMethod: previousOrder.paymentMethod,
  });



  res.status(201).json({
    success: true,
    message: "Re-order placed successfully",
    order: newOrder,
  });
});




