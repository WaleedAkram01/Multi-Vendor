import express from "express";

import { registerController } from "../controllers/auth.controller.js";
import { validateRegister } from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", validateRegister, registerController);

export default router;
