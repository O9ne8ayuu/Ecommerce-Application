// routes/cartRoutes.js
import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  addToCartController,
  removeFromCartController,
  getUserCartController,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", requireSignIn, addToCartController);
router.post("/remove", requireSignIn, removeFromCartController);
router.get("/user", requireSignIn, getUserCartController);

export default router;
