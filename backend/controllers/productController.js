// Extracting functionality from productRoutes.js file to controllers. Routes should just point to controller methods.

import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  // We use the Product model, and we are gonna get all the products because we are passing an empty object. This returns a promise because we use a mongoose method
  const products = await Product.find({});
  // Displays the raw json on the browser

  // This way we can force an error:
  // res.status(401);
  // throw new Error("Not Authorized");
  res.json(products);
});

// @desc   Fetch single product
// @route  GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  // This next line was written when this route was in the server.js. Now, it has to be substituted
  // const product = products.find((p) => p._id === req.params.id);
  const product = await Product.findById(req.params.id); // req.params.id will give us whatever id is in the url

  if (product) {
    res.json(product);
  } else {
    // Now that we have a custom errorHandler, we can change the line below
    // res.status(404).json({ message: "Product not found" });
    res.status(404); // if we remove this, by default will throw a 500
    throw new Error("Product not found");
  }
});

// @desc   Delete a product
// @route  DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id); // req.params.id will give us whatever id is in the url

  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404); // if we remove this, by default will throw a 500
    throw new Error("Product not found");
  }
});

export { getProducts, getProductById, deleteProduct };
