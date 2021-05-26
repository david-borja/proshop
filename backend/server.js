import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Here we mount the product routes that we imported. Anything that goes to "/api/products" will use that route
app.use("/api/products", productRoutes);

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
