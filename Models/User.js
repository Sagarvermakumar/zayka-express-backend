import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
      avatar: {
        public_id: {
          type:String,
          default :"Public_id"
        },
        url: {
          type:String,
          default:"user.png"
        },
    },
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      match: [/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email"],
      
    },
    password: {
      type: String,
      required: [true, "Please Enter your Password"],
      minLength: [6, "password must be at least 6 character"],
      select: false,
    },
    phoneNumber: {
      type: String,
      required: [true, "Please enter your WhatsApp phone number"],
      match: [
        /^\+91[6-9]\d{9}$/,
        "Please enter a valid phone number with country code",
      ],
      unique: true,
      index: true, // Index for faster lookups
    },
    referralCode: {
      type: String,
      unique: true,
      default: null,
    }, // Unique referral code for the user
    referredBy: {
      type: String,
      default: null,
    }, // ID of the user who referred this user
    walletBalance: {
      type: Number,
      default: 0,
    }, // User's wallet balance for payments

    role: {
      type: String,
      enum: ["User",  "Admin"],
      default: "User",
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,

    lastLogin: { type: Date },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

userSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.verificationToken = token;
  return token;
};
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
