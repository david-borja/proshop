import express from "express";
const router = express.Router();
import {
  getProductById,
  getProducts,
} from "../controllers/productController.js";

// This would be one way of doing it
//router.get("/", getProducts);

// However, we would do:
router.route("/").get(getProducts);
router.route("/:id").get(getProductById);

export default router;
