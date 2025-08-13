import userModel from "../models/userModel.js";


//  Add to Wishlist
export const addToWishlistController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).send({ success: false, message: "User not found" });

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    const populatedUser = await user.populate("wishlist");
    res.status(200).send({
      success: true,
      message: "Product added to wishlist",
      wishlist: populatedUser.wishlist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error adding to wishlist",
      error,
    });
  }
};
    

    

//  Remove from Wishlist
export const removeFromWishlistController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;
    const user = await userModel.findByIdAndUpdate(
      userId,
       { $pull: { wishlist: productId } },
      { new: true }
    ).populate("wishlist");

    res.status(200).send({
      success: true,
      message: "Product removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error removing from wishlist",
      error,
    });
  }
};
    

    

//  Get Wishlist Products
export const getWishlistController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).populate("wishlist", "-photo");

    res.status(200).send({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).send({ success: false,
      message: "Error fetching wishlist",
      error,
     });
  }
};
