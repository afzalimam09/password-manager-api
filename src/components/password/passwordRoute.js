import { Router } from "express";
import { protect } from "../auth/authController.js";
import {
    createPassword,
    deletePassword,
    encryptData,
    getAllPasswords,
    getPassword,
    protectMaster,
    updatePassword,
} from "./passwordController.js";

const router = Router();

const beforeGetAll = (req, res, next) => {
    req.query.userId = req.user._id;
    next();
};

router.use(protect);
router
    .route("/")
    .get(beforeGetAll, getAllPasswords)
    .post(encryptData, createPassword);

router.use(protectMaster);
router
    .route("/:id")
    .get(getPassword)
    .patch(updatePassword)
    .delete(deletePassword);

export default router;
