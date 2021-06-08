// This middleware is gonna validate the token
import jwt from "jsonwebtoken";
// This handler helps us to avoid UnhandledPromiseRejectionWarning when there is no token.
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// This protect function can be added wherever we want to protect a route
const protect = asyncHandler(async (req, res, next) => {
  let token;
  // console.log(req.headers.authorization); -> this prints on the console the token we are getting from headers.

  // Checks that something has been sent under the "Authorization" header, and that starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // console.log("token found, but not verified yet");
    try {
      // IT VERIFIES THAT IT IS THE VERY SAME TOKEN THE USER GOT WHEN AUTHENTICATED.
      // In order to verify the token, we don't need "Bearer "
      token = req.headers.authorization.split(" ")[1];
      // In order to decode it, we pass it to verify and we add the secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded); -> this shows us the token id, issuedattime, and expirationtime

      // It sets req.user to the user that has the same id decoded from the token. Also, here we don't want to return the password. Eventhough we are not sending this back, there is no need to send the password.
      req.user = await User.findById(decoded.id).select("-password");
      // Now, we'll have access to this req.user in all our protected routes.
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  // The request was made without a token
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  // next();
});

export { protect };
