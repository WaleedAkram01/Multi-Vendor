import User from "../models/user.model.js";

export const registerService = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already exists.");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  return user;
};
