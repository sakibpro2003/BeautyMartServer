import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../app/utils/catchAsync";
import { wishlistService } from "./wishlist.service";
import { User } from "../User/user.model";

const ensureUser = async (email?: string) => {
  if (!email) return null;
  return User.findOne({ email });
};

const addToWishlist = catchAsync(async (req: Request, res: Response) => {
  const user = await ensureUser(req.user?.email);
  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "User not found",
    });
  }
  const productId = req.params.productId;
  const item = await wishlistService.addToWishlist(user._id.toString(), productId);
  return res.status(httpStatus.CREATED).json({
    success: true,
    message: "Added to wishlist",
    data: item,
  });
});

const removeFromWishlist = catchAsync(async (req: Request, res: Response) => {
  const user = await ensureUser(req.user?.email);
  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "User not found",
    });
  }
  const productId = req.params.productId;
  await wishlistService.removeFromWishlist(user._id.toString(), productId);
  return res.status(httpStatus.OK).json({
    success: true,
    message: "Removed from wishlist",
  });
});

const getWishlist = catchAsync(async (req: Request, res: Response) => {
  const user = await ensureUser(req.user?.email);
  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "User not found",
    });
  }
  const items = await wishlistService.getWishlist(user._id.toString());
  return res.status(httpStatus.OK).json({
    success: true,
    message: "Wishlist retrieved",
    data: items,
  });
});

export const wishlistController = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};

