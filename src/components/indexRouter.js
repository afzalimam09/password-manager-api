import { Router } from "express";

import authRoute from "./auth/authRoute.js";
import passwordRoute from "./password/passwordRoute.js";
import userRoute from "./user/userRoute.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/password", passwordRoute);
router.use("/users", userRoute);

export default router;
