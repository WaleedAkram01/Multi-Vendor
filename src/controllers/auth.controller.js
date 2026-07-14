import { registerService, loginService } from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const registerController = asyncHandler(async (req, res) => {
  const user = await registerService(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

export const loginController = asyncHandler(async (req, res) => {
  const data = await loginService(req.body);

  res.status(200).json({
    success: true,
    data,
  });
});
