import { Router } from "express";
import { protect, restrictToAdmin } from "../auth/authController.js";
import {
    createMasterPassword,
    createUser,
    deleteMe,
    deleteUser,
    getAllUsers,
    getMe,
    getUser,
    updateMe,
    updateUser,
} from "./userController.js";

const router = Router();

// Protect all the route after this point (only logged in user can access)
router.use(protect);

router.get("/me", getMe, getUser);

router.patch("/updateme", updateMe);

router.delete("/deleteme", deleteMe);

router.patch("/create-master-password", createMasterPassword);

// Restrict to only admin after this point
router.use(restrictToAdmin);

router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
