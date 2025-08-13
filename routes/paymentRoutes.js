import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { createOrderController, getRazorpayKeyController, verifyPaymentController } from "../controllers/paymentController.js";

const router = express.Router();
// create order for Razorpay
router.post("/create-order", requireSignIn, createOrderController);

// Verify Razorpay payment
router.post("/verify-payment", requireSignIn, verifyPaymentController);

router.get('/razorpay-key', getRazorpayKeyController);


export default router;


