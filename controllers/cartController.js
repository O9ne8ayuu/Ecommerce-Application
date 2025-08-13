// controllers/cartController.js
import Cart from "../models/cartModel.js";

// ➕ Add or update item in cart
export const addToCartController = async (req, res) => {
  try {
    const { productId, qty, size } = req.body;
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId });

    const safeQty = Math.min(Math.max(qty || 1, 1), 20); // Ensure between 1–20
    const exceededLimit = qty > 20;

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, qty: safeQty, size }],
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === productId &&
          item.size === size
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].qty = safeQty;
      } else {
        cart.items.push({ product: productId, qty: safeQty, size });
      }
    }

    const updatedCart = await cart.save();

    res.status(200).send({
      success: true,
      cart: updatedCart,
      message: exceededLimit ? "Maximum quantity is 20. Quantity capped." : undefined,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Failed to update cart",
      error: error.message,
    });
  }
};



//  Remove item
export const removeFromCartController = async (req, res) => {
  try {
    const { productId, size } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).send({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (item) =>
        !(item.product.toString() === productId && item.size === size)
    );

    await cart.save();
    const updatedCart = await Cart.findOne({user: userId}).populate("items.product");
    res.status(200).send({ success: true, cart: updatedCart });
  } catch (error) {
    console.error("Remove Cart Error:", error);
    res.status(500).send({ success: false, error: error.message });
  }
};

// 📥 Get user cart
export const getUserCartController = async (req, res) => {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      cart = { user: userId, items: [] };
    }
    res.status(200).send({ success: true, cart });
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).send({ success: false, error: error.message });
  }
};
