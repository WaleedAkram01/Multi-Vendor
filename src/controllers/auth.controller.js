import {
  registerService,
  loginService,
  refreshTokenService,
  logoutService,
} from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";

const cookieOptions = {
  //means http request kyy sath hii cookie jai automatically.
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const registerController = asyncHandler(async (req, res) => {
  const user = await registerService(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

export const loginController = asyncHandler(async (req, res) => {
  //Yeh destructuring hai. loginService ek object return karta hai jismein 3 cheezein hoti hain: user, accessToken, refreshToken.
  //// loginService kuch aisa return karta hai:
  // return {
  //   user: { id: 1, name: "Amir" },
  //   accessToken: "abc123",
  //   refreshToken: "xyz789",
  // };
  const { user, accessToken, refreshToken } = await loginService({
    ...req.body,
    device: req.headers["user-agent"],
  });

  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.status(200).json({
    success: true,
    accessToken,
    user,
  });
});

export const refreshTokenController = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken } = await refreshTokenService(
    req.cookies.refreshToken,
  );

  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.status(200).json({
    success: true,
    accessToken,
  });
});

export const logoutController = asyncHandler(async (req, res) => {
  await logoutService(req);
  res.clearCookie("refreshToken", cookieOptions);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
