import mongoose from "mongoose";

// Address Schema for storing user addresses
const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    label: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home",
    },
    addressLine: {
      type: String,
      required: [true, "Address line is required"],
    },
    landmark: [
      {
        type: String,
        required: [true, "Landmark is required"], 
      }
    ],
    city: {
      type: String,
      required: [true, "City is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    country: {
      type: String,
      default: "India",
    },
    pinCode: {
      type: String,
      required: [true, "Pin code is required"],
    },
    geo: {
  latitude: {
    type: Number,
    required: [true, "Latitude is required"],
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: [true, "Longitude is required"],
    min: -180,
    max: 180
  }
},


    isDefaultAddress: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("Address", addressSchema);
export { addressSchema };
export default Address;
