import express from "express";
import { protect } from "../middlewares/auth.middleware.js";

import {
  registerController,
  loginController,
  refreshTokenController,
} from "../controllers/auth.controller.js";
import {
  validateRegister,
  validateLogin,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", validateRegister, registerController);
router.post("/login", validateLogin, loginController);
router.post("/refresh-token", refreshTokenController);
router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;
