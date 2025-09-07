

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import config from "../../config";
import catchAsync from "../utils/catchAsync";
import AppError from "../error/AppError";

type TRequiredRoles = "customer" | "admin";

const auth = (...requiredRoles: TRequiredRoles[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenWithBearer = req.headers.authorization;
      if (!tokenWithBearer) {
        throw new AppError(httpStatus.UNAUTHORIZED, "No token provided");
      }

      const token = tokenWithBearer.split(" ")[1];
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token format");
      }

      const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload & { _id: string; role: TRequiredRoles };

      req.user = decoded;

      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to access this resource");
      }

      next();
    } catch (error) {
      next(error);
    }
  });
};

export default auth;

