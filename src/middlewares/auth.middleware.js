import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized. Token missing");
  }

  const token = authHeader.split(" ")[1];

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Account disabled");
  }

  req.user = user;

  next();
});
