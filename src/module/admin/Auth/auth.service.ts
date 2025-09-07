import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { TLoginUser } from "./auth.interface";
import httpStatus from "http-status";
import config from "../../../config";
import { User } from "../../User/user.model";
import AppError from "../../../app/error/AppError";

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByCustomId(payload?.email);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
  }

  if (user?.isBlocked) {
    throw new AppError(StatusCodes.FORBIDDEN, "The user is blocked!");
  }

  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");

  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };

  const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "10d",
  });

  return {
    token,
  };
};

export const AuthServices = {
  loginUser,
};
