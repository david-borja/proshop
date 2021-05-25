import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

// We have to connect this file to the database again because this file is not connected to our server
dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    // we want to get the admin user from this array, and in this case, is the first user in the array
    const adminUser = createdUsers[0]._id;

    // we map through the products we want to add, and we add the adminUser to each one of them
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);
    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}.red.inverse`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}.red.inverse`);
    process.exit(1);
  }
};

// this stablishes that we will destroyData when we run: node backend/seeder -d
// -d is at the index 2 in the arguments vector
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}

// To run this commands faster, we added the following scripts to the package.json
// "data:import": "node backend/seeder",
// "data:destroy": "node backend/seeder -d"
