import express from "express";
import {
  getProfile,
  updateProfile,
  getAllUsers,
  getPendingUsers,
  createUserByManager,
  updateUserByManager,
  deleteUserByManager,
  approveUser,
  rejectUser,
} from "../controllers/userController.js";
import { protect, managerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

router.get("/", protect, managerOnly, getAllUsers);
router.get("/pending", protect, managerOnly, getPendingUsers);
router.post("/", protect, managerOnly, createUserByManager);
router.put("/:id", protect, managerOnly, updateUserByManager);
router.delete("/:id", protect, managerOnly, deleteUserByManager);
router.patch("/approve/:id", protect, managerOnly, approveUser);
router.patch("/reject/:id", protect, managerOnly, rejectUser);

export default router;