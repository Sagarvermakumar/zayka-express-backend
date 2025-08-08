import { Router } from "express";
import { isAuthenticate } from "../Middleware/Auth.js";
import {
  cancelOrder,
  checkOrderStatus,
  deleteCancelledOrder,
  getAllOrdersOfSpecificUser,
  getOrderById,
  placeNewOrder,
  reorder
} from "../controllers/Order.js";

const orderRouter = Router();

orderRouter.post("/place-new", isAuthenticate, placeNewOrder);
orderRouter.get("/status/:id", isAuthenticate, checkOrderStatus);
orderRouter.patch("/cancel/:id", isAuthenticate, cancelOrder);
orderRouter.delete("/delete/:id", isAuthenticate, deleteCancelledOrder); 
orderRouter.get("/my-orders", isAuthenticate, getAllOrdersOfSpecificUser);
orderRouter.get("/details/:id", isAuthenticate,  getOrderById);
orderRouter.post("/re-order/:id", isAuthenticate, reorder);



export default orderRouter;
