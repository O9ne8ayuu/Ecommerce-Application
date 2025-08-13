// controllers/couponController.js
import Coupon from "../models/couponModel.js";

export const applyCouponController = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    const userId = req.user?._id; // requires authentication middleware

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      return res.status(404).send({
        success: false,
        message: "Invalid or inactive coupon",
      });
    }

    // Check expiration
    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return res.status(400).send({
        success: false,
        message: "Coupon has expired",
      });
    }

    // Check min cart value
    if (cartTotal < (coupon.minCartValue || 0)) {
      return res.status(400).send({
        success: false,
        message: `Minimum cart value must be ₹${coupon.minCartValue}`,
      });
    }

    // Check per-user usage
    const usage = coupon.usedBy.find(
      (u) => u.userId.toString() === userId.toString()
    );
    if (usage && usage.count >= coupon.maxUses) {
      return res.status(400).send({
        success: false,
        message: "You’ve already used this coupon",
      });
    }

    return res.status(200).send({
      success: true,
      discountAmount: coupon.discountAmount,
      code: coupon.code,
      message: "Coupon applied successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "Error applying coupon",
    });
  }
};


export const getAllCouponsController = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true });
    res.status(200).send({
      success: true,
      coupons,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch coupons",
    });
  }
};

