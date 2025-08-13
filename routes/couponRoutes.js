// routes/couponRoutes.js
import express from "express";
import { applyCouponController, getAllCouponsController } from "../controllers/couponController.js";
import {isAdmin, requireSignIn} from "../middlewares/authMiddleware.js";
import { verifyPaymentController } from "../controllers/paymentController.js";
const router = express.Router();

router.post("/apply", requireSignIn, applyCouponController);
router.post("/verify", requireSignIn, verifyPaymentController);
// routes/couponRoutes.js
router.get("/all", requireSignIn, isAdmin, getAllCouponsController);
router.get("/all", getAllCouponsController);




export default router;
