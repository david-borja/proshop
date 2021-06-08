import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

// It creates a method that we can use with an instantiated user.
userSchema.methods.matchPassword = async function (enteredPassword) {
  // enteredPassword is gonna be a plain text password
  // The compare method comes from bcryptjs.
  // Due to calling .matchPassword on an specific user, we can access his/her encrypted password with this.password.
  return await bcrypt.compare(enteredPassword, this.password);
};

// Before we save, we want to encrypt the password with this middleware. And we want it to happen pre("save") -> belongs to mongoose middleware. THIS SHOULD AUTOMATICALLY RUN PRE SAVE. IT DOESN'T NEED TO BE ADDED TO OUR USER CONTROLLER.
userSchema.pre("save", async function (next) {
  // We only want to hash the password if the password field is sent or is modified. When the user updates other part of the profile (name for example) we don't want to create a new hash. Otherwise the user is NOT gonna be able to log in again. isModified() comes from mongoose
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  // It resets the user's password to be a hashed password
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
