import path from "path"; // this is a nodejs module
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

connectDB();

const app = express();

// We have to add a piece of middleware in order for the request.body to parse. This line will allow us to use json data in the body.
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Here we mount the product routes that we imported. Anything that goes to "/api/products" will use that route
app.use("/api/products", productRoutes);
// Here we mount the userRoutes
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

// When this route is hit, it fetches the PAYPAL_CLIENT_ID from process.env
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

// Here is how we can make our folder static so it can be accessed in the browser

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // using __dirname will point to the current directory. However, it is NOT available if we use ES modules, it is ONLY available if we use CommonJS. That's why we use the const variable to mimic __dirname

// Here we have a fallback for 404 errors (anything that it's not an actual route)
app.use(notFound);
// With this error middleware we want to overwrite the default error handler (we write it at the bottom, under the routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
  )
);
