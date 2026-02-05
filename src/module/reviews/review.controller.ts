import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../app/utils/catchAsync";
import { reviewService } from "./review.service";
import { TReviewStatus } from "./review.interface";

const createReview = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?.email) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized: user not found",
    });
  }

  const payload = req.body;
  if (!payload.productId || !payload.orderId || !payload.rating || !payload.comment) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "productId, orderId, rating, and comment are required",
    });
  }

  const review = await reviewService.createReview(req.user.email, payload);

  return res.status(httpStatus.CREATED).json({
    success: true,
    message: "Review submitted for moderation",
    data: review,
  });
});

const getProductReviews = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const reviews = await reviewService.getProductReviews(productId);

  return res.status(httpStatus.OK).json({
    success: true,
    message: "Product reviews retrieved",
    data: reviews,
  });
});

const getPublicReviews = catchAsync(async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const reviews = await reviewService.getPublicReviews(limit);

  return res.status(httpStatus.OK).json({
    success: true,
    message: "Reviews retrieved",
    data: reviews,
  });
});

const getReviewById = catchAsync(async (req: Request, res: Response) => {
  const review = await reviewService.getReviewById(req.params.id);

  if (!review || review.status !== "approved") {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "Review not found",
    });
  }

  return res.status(httpStatus.OK).json({
    success: true,
    message: "Review retrieved",
    data: review,
  });
});

const getAdminReviews = catchAsync(async (req: Request, res: Response) => {
  const status = (req.query.status as TReviewStatus | "all") || undefined;
  const reviews = await reviewService.getAdminReviews(status);

  return res.status(httpStatus.OK).json({
    success: true,
    message: "Reviews loaded for moderation",
    data: reviews,
  });
});

const updateReviewModeration = catchAsync(async (req: Request, res: Response) => {
  const { status, adminReply } = req.body;
  const review = await reviewService.updateReviewModeration(
    req.params.id,
    status,
    adminReply
  );

  return res.status(httpStatus.OK).json({
    success: true,
    message: "Review updated",
    data: review,
  });
});

const getSentimentSummary = catchAsync(async (req: Request, res: Response) => {
  const summary = await reviewService.getSentimentSummary();

  return res.status(httpStatus.OK).json({
    success: true,
    message: "Sentiment summary generated",
    data: summary,
  });
});

const getUserReviews = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?.email) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized: user not found",
    });
  }

  const reviews = await reviewService.getUserReviews(req.user.email);

  return res.status(httpStatus.OK).json({
    success: true,
    message: "Your reviews",
    data: reviews,
  });
});

const getReplyTemplates = catchAsync(async (req: Request, res: Response) => {
  const templates = reviewService.getReplyTemplates();
  return res.status(httpStatus.OK).json({
    success: true,
    message: "Reply templates",
    data: templates,
  });
});

export const reviewController = {
  createReview,
  getProductReviews,
  getPublicReviews,
  getReviewById,
  getAdminReviews,
  updateReviewModeration,
  getSentimentSummary,
  getUserReviews,
  getReplyTemplates,
};
