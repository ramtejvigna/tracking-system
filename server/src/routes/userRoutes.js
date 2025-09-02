import express from "express";
import {
    registerUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} from "../controllers/userControllers.js";

const router = express.Router();

// User CRUD routes
router.post("/users", registerUser);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
