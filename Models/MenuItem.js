import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Created by is required"],
  },
  name: { type: String, required: [true, "Name is required"] },
  description: { type: String, required: [true, "Description is required"] },
  price: {
    type: Number,
    required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },
  category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Appetizer", "Main Course", "Dessert"], // Example categories
    },
    image: { type: String, required: [true, "Image URL is required"] },
    isVegetarian: { type: Boolean, default: false },
    isVegan: { type: Boolean, default: false },
    ratings: {
      type: Number,
      default: 0,
      min: [0, "Ratings must be a positive number"],
      max: [5, "Ratings cannot exceed 5"],
    },
    reviews: {
      type: Number,
      default: 0,
      min: [0, "Reviews cannot be negative"],
    },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;
