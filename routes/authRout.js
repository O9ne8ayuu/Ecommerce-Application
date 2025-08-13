import express from 'express';
import { registerController, loginController, testController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController, getAllUsersController} from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { addToWishlistController, getWishlistController, removeFromWishlistController } from '../controllers/wishlistController.js';

//router object
const router = express.Router();

//============ AUTH ROUTES =============== //
router.post('/register', registerController);
router.post('/login', loginController);
router.post('/forgot-password', forgotPasswordController);

//============== TEST ==================== //
router.get('/test',requireSignIn ,isAdmin,testController);

//============ AUTH CHECK ===================//
router.get('/user-auth', requireSignIn, (req, res) => 
    res.status(200).send({ ok: true }));
 router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => 
    res.status(200).send({ ok: true }));

//============= USER ====================== //
router.put('/profile', requireSignIn, updateProfileController);
router.get('/orders', requireSignIn, getOrdersController);

//===========wishlist ============== //
router.post("/wishlist/add", requireSignIn, addToWishlistController);
router.post("/wishlist/remove", requireSignIn, removeFromWishlistController);
router.get("/wishlist", requireSignIn, getWishlistController);

// ✅ GET LOGGED-IN USER INFO (for your frontend get-user request)
router.get('/get-user', requireSignIn, (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error('Get user failed:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


//============== ADMIN ===================== //
router.get('/all-orders', requireSignIn,isAdmin,getAllOrdersController);
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController);

// ✅ New route for admin to fetch all users
router.get('/all-users', requireSignIn, isAdmin, getAllUsersController);


export default router;