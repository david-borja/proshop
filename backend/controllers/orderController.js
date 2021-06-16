import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// @desc Create new order
// @route POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // It checks that orderItems exist, and that if its length is 0. So if order items is an empty array, orderItems will be truthy and its length will be equal to 0.
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
    return;
  } else {
    // It creates an order in the database
    const order = new Order({
      orderItems,
      // It also includes the logged in user since this is gonna be a protected route.
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      // itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    // It returns the created order as json.
    res.status(201).json(createdOrder);
  }
});

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  // In addition to the order info, it also populates some other information about the user that is associated with the order. We can pass the fields that we want as a space separated string as second argument.
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export { addOrderItems, getOrderById };
