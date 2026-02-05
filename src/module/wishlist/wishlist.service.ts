import httpStatus from "http-status";
import AppError from "../../app/error/AppError";
import Wishlist from "./wishlist.model";

const addToWishlist = async (userId: string, productId: string) => {
  try {
    const item = await Wishlist.create({ user: userId, product: productId });
    return item.populate("product");
  } catch (error: any) {
    if (error.code === 11000) {
      throw new AppError(httpStatus.CONFLICT, "Already in wishlist");
    }
    throw error;
  }
};

const removeFromWishlist = async (userId: string, productId: string) => {
  const deleted = await Wishlist.findOneAndDelete({ user: userId, product: productId });
  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Item not found in wishlist");
  }
  return deleted;
};

const getWishlist = async (userId: string) => {
  return Wishlist.find({ user: userId }).populate({
    path: "product",
  });
};

export const wishlistService = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};

