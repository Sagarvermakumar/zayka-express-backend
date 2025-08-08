import mongoose from "mongoose";
import { addressSchema } from "./Address.js";

//
const orderSchema = new mongoose.Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: [true, "Menu item is required"],
        },
        quantity: { type: Number, default: 1 },
      },
    ],
    totalPrice: { type: Number, required: [true, "Total price is required"] },
    referralDiscountApplied: { type: Boolean, default: false },
    deliveryAddressID: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: [true, "Delivery address is required"] },
    paymentMethod: { type: String, enum: ["COD", "Online"], default: "COD" },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    deliveryTime: { type: Date, default: Date.now() + 30 * 60 * 1000 }, // 30 minutes from now
    walletUsed: { type: Number, default: 0 },
    cancelledAt: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
