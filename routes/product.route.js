import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  uploadImage,
} from "../controllers/product.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getProducts).post(uploadImage, createProduct);
router
  .route("/:id")
  .get(getProduct)
  .put(uploadImage, updateProduct)
  .delete(deleteProduct);

export default router;
