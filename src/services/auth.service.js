import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import hashToken from "../utils/hashToken.js";

export const registerService = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  // 500 Server error is for unexpected errors, 409 Conflict is for expected errors like duplicate email
  //   if (existingUser) {
  //     throw new Error("Email already exists.");
  //   }

  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
  });

  //select:false sirf query pe lagta hai, naye document mein password mojood hota hai
  const safeUser = user.toObject();
  delete safeUser.password;

  return safeUser;
};
export const loginService = async ({ email, password, device }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(401, "Invalid Credentials");

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid Credentials");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const tokenHash = hashToken(refreshToken);

  user.refreshTokens.push({
    tokenHash,
    device: device || "Unknown Device",
  });

  await user.save();

  const safeUser = user.toObject();
  delete safeUser.password;

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};

export const refreshTokenService = async (refreshToken) => {
  //1. COOKIE MOJOOD HAI?
  if (!refreshToken) {
    throw new ApiError(401, "Unauthorized");
  }

  //2. JWT VERIFY (expired ya tampered ho to yahan throw hoga)
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new ApiError(401, "Invalid refresh token");
  }

  //3. HASH + USER
  const tokenHash = hashToken(refreshToken);
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  //4. DB SOURCE OF TRUTH - hash mojood hai ya nahi?
  const existingToken = user.refreshTokens.find(
    (token) => token.tokenHash === tokenHash,
  );

  if (!existingToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  //5. ROTATION - purana hash hatao
  user.refreshTokens = user.refreshTokens.filter(
    (token) => token.tokenHash !== tokenHash,
  );

  //6. NAYE TOKENS + NAYA HASH SAVE (device purane token se hi chalta rahega)
  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshTokens.push({
    tokenHash: hashToken(newRefreshToken),
    device: existingToken.device,
  });

  await user.save();

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};
