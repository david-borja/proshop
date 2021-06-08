import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// @desc Auth user & get token
// @route POST /api/users/login
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
      token: null,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

export { authUser };
