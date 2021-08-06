import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

// @desc   Auth user & get token
// @route  POST /api/users/login
// @access Public

// This route is gonna authenticate the user, and is gonna send back some data. Ultimately, we want to send back a token that we can save on the client, so we can use that token to access protected routes.
const authUser = asyncHandler(async (req, res) => {
  // We get this data from the body that is comming from a form that the user submitted on the front end.
  const { email, password } = req.body;

  // We want to find in the database a user whose email matches the email from the req.body
  //const user = await User.findOne({ email: email });

  // The line above can be simplified as:
  const user = await User.findOne({ email });

  // It checks if the user exists, and checks if passwords match. The password coming from req.body is plain text, but the password stored in the database is encrypted. In order to use bcrypt, we can create a method in the model.
  // It needs to be preceeded by await, because user.matchPassword returns a promise.
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      // GENERATES TOKEN WHEN USER AUTHENTICATES
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc   Register a new user
// @route  POST /api/users
// @access Public

const registerUser = asyncHandler(async (req, res) => {
  // It also needs name to create a user
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // In this line below, password is unencrypted. Just plain text (It can be encrypted using some Mongoose middleware). Here, even we are using "create", is basically sytactic sugar for the .save method. So, the pre-save middleware will run before the user gets created
  const user = await User.create({ name, email, password });

  // Checks if everything went ok and the user is created
  if (user) {
    // We want to send back the same data we sent from the login.
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      // We also want to generate a token when the user registers because we want to be able to authenticate it right after the registration
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc   GET user profile
// @route  GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  // res.send("Success");

  // it uses req.user._id to get the loggedin user id -> we can use req.user in any protected route that we want.
  const user = await User.findById(req.user._id);

  if (user) {
    // This is the info it returns when a GET request is made with the correct token to get a specific user profile.
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc   Update user profile
// @route  PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      // If there is a new password, it will be encrypted automatically due to the pre-save middleware of the userModel
      user.password = req.body.password;
    }
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc   GET all users
// @route  GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc   Delete user
// @route  DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
};
