import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import Formidable from 'express-formidable';
import {
  createProductController,
  deleteProductController,
  getDealProductsController,
  getProductController,
  getsingleProductController,
  productCategoryControler,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  relatedProductController,
  searchProductController,
  updateProductController
} from '../controllers/productController.js';


const router = express.Router();

// ✅ ROUTES
router.get('/get-product', getProductController);
router.get('/get-product/:slug', getsingleProductController);
router.get('/product-photo/:pid', productPhotoController);
router.delete('/delete-product/:pid', requireSignIn, isAdmin, deleteProductController);
router.put('/update-product/:pid', requireSignIn, isAdmin, Formidable(), updateProductController);
router.post('/product-filters', productFiltersController);
router.get('/product-count', productCountController);
router.get('/product-list/:page', productListController);
router.get('/search/:keyword', searchProductController);
router.get('/related-product/:pid/:cid', relatedProductController);
router.get('/product-category/:slug', productCategoryControler);
router.get("/deals", getDealProductsController);

router.post('/create-product',requireSignIn,isAdmin,Formidable({ multiples: true }),createProductController
);

export default router;
