import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import updateCouponUsage from "../helpers/updateCouponUsage.js";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create Razorpay Order
export const createOrderController = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ success: false, message: "Valid amount is required" });
    }

    const options = {
      amount: Math.round(amount * 100), // in paisa
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({
      success: true,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency || "INR",
      order_id: order.id,
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: error.message });
  }
};

// Verify Razorpay Payment
export const verifyPaymentController = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, couponCode,cartItems = [], totalAmount , deliverAddress} = req.body;

     // Auth check (ensure you run auth middleware before this controller)
    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }


    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // signature verified -update coupon code id applied 
    if(couponCode && req.user?._id) {
      await updateCouponUsage(couponCode,req.user?._id);
    }
  } catch (err) {
        console.warn("Coupon update failed (non-fatal):", err?.message || err);
        // Proceed even if coupon update fails
      } 
  
};




  





// Razorpay key fetch
export const getRazorpayKeyController = (req, res) => {
  return res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
};

