import express from "express";
import formidable from "express-formidable";
import {
  authenticate,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";
import {
  addProduct,
  updateProductDetail,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} from "../controllers/productController.js";
const router = express.Router();

router.route("/").post(authenticate, authorizedAdmin, formidable(), addProduct); // 1
router.route("/").get(fetchProducts); // 4

router.route("/allproducts").get(fetchAllProducts); // 6

router.get("/top", fetchTopProducts); // 8
router.get("/new", fetchNewProducts); // 9

router.route("/filtered-products").post(filterProducts); // 10

// review the product
router.route("/:id/reviews").post(authenticate, checkId, addProductReview); // 7

router
  .route("/:id")
  .put(authenticate, authorizedAdmin, formidable(), updateProductDetail) //2
  .get(fetchProductById) // 5
  .delete(authenticate, authorizedAdmin, removeProduct); // 3

export default router;
