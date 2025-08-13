import Coupon from "../models/couponModel.js";

const updateCouponUsage = async (code, userId) => {
  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) return;

    const index = coupon.usedBy.findIndex(
      (u) => u.userId.toString() === userId.toString()
    );

    if (index !== -1) {
      coupon.usedBy[index].count += 1;
    } else {
      coupon.usedBy.push({ userId, count: 1 });
    }

    await coupon.save();
  } catch (err) {
    console.error("Error updating coupon usage:", err);
  }
};

export default updateCouponUsage;
