import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

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

  return user;
};

export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid  password");
  }
  return user;
};
