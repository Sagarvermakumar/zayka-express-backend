import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { errorMiddleware } from "./Middleware/Error.js";
import addressRouter from "./Router/Address.js";
import adminRouter from "./Router/Admin.js";
import authRouter from "./Router/Auth.js";
import menuItemRouter from "./Router/MenuItem.js";
import orderRouter from "./Router/Order.js";
import userRouter from "./Router/User.js";
const app = express();

config({
  path: "./.env",
});
const allowedOrigins = [
  "http://localhost:3000",
   "https://zayka-express-six.vercel.app"
];

app.use(
  cors({
 origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }, methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ FIXED as array
  })
)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb'  }));
app.use(cookieParser());
// Middleware


//home route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Food Delivery API",
  });
});

// Routes
app.use("/api/v1/auth", authRouter); // Auth routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/address", addressRouter);
app.use("/api/v1/menu-item", menuItemRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/admin", adminRouter);


//error middleware
app.use(errorMiddleware);

export default app;
