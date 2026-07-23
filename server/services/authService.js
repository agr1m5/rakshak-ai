import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

const SALT_ROUNDS = 12;

export function signToken(userId) {
  return jwt.sign({ sub: userId.toString() }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

export function verifyToken(token) {
  // Throws if invalid/expired — caller (the `protect` middleware) is
  // responsible for turning that into a 401.
  return jwt.verify(token, env.jwtSecret);
}

export async function registerUser({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.badRequest("An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, passwordHash });

  const token = signToken(user._id);
  return { user, token };
}

export async function loginUser({ email, password }) {
  // passwordHash is select:false by default — opt back in explicitly here.
  const user = await User.findOne({ email }).select("+passwordHash");

  // Same error for "no such user" and "wrong password" — don't leak
  // which one it was, that tells an attacker whether an email is registered.
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const token = signToken(user._id);
  return { user, token };
}

export async function getUserById(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.unauthorized("User no longer exists");
  }
  return user;
}
