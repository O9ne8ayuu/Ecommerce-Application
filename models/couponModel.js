import mongoose from "mongoose";

const usedBySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  count: {
    type: Number,
    default: 1,
  },
});

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  discountAmount: {
    type: Number,
    required: true,
  },
  minCartValue: {
    type: Number,
    default: 0,
  },
  maxUses: {
    type: Number,
    default: 1, // total allowed uses per user
  },
  expiresAt: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  usedBy: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  ],


},{timestamps:true});

export default mongoose.model("Coupon", couponSchema);
