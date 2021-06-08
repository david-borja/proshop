import jwt from "jsonwebtoken";

// It takes in the userId, because that's what we want to add as the payload in this token
const generateToken = (id) => {
  // The payload is an object with the id, and the second argument is the secret, which we are gonna put in the .env file.
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    // An object that says the token is gonna expire in 30 days is passed as a third argument.
    {
      expiresIn: "30d",
    }
  );
};

export default generateToken;
