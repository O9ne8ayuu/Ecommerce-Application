import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { createCategoryController , deleteCategoryController, getAllCategoryController, singleCategoryController, updateCategoryController} from '../controllers/categoryController.js';



const router = express.Router();
// ====================== CATEGORY ROUTES ================ //

//Create category
router.post("/create-category", requireSignIn, isAdmin, createCategoryController);

//Update category
router.put("/update-category/:id", requireSignIn, isAdmin, updateCategoryController);

//Get all categories
router.get('/get-category', getAllCategoryController);

// Get single category by slug
router.get('/single-category/:slug', singleCategoryController);

//Delete category
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController);


export default router;