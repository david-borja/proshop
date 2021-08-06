import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// Notice that here it is not the complete URL. The complete URL starts with api/users
router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/login", authUser);
// In order to protect this route below, we implement the "protect" function as middleware by passing it as the first argument
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route("/:id").delete(protect, admin, deleteUser);
export default router;
