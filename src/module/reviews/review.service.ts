import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../app/error/AppError";
import Order from "../orders/order.model";
import { User } from "../User/user.model";
import Review from "./review.model";
import { IReview, TReviewStatus, TSentiment } from "./review.interface";

type CreateReviewPayload = {
  productId: string;
  orderId: string;
  rating: number;
  title?: string;
  comment: string;
};

const positiveKeywords = [
  "love",
  "great",
  "excellent",
  "amazing",
  "good",
  "satisfied",
  "recommend",
  "happy",
  "fantastic",
  "glow",
  "soft",
  "smooth",
  "effective",
  "worth",
  "perfect",
  "gentle",
];

const negativeKeywords = [
  "bad",
  "poor",
  "awful",
  "disappointed",
  "hate",
  "broken",
  "late",
  "irritation",
  "refund",
  "return",
  "issue",
  "problem",
  "harsh",
  "waste",
  "leak",
  "damage",
];

const analyzeSentiment = (comment: string): { sentiment: TSentiment; keywords: string[] } => {
  const text = comment.toLowerCase();
  let score = 0;

  positiveKeywords.forEach((word) => {
    if (text.includes(word)) score += 1;
  });
  negativeKeywords.forEach((word) => {
    if (text.includes(word)) score -= 1;
  });

  const matchedKeywords = new Set<string>();
  positiveKeywords.forEach((word) => {
    if (text.includes(word)) matchedKeywords.add(word);
  });
  negativeKeywords.forEach((word) => {
    if (text.includes(word)) matchedKeywords.add(word);
  });

  let sentiment: TSentiment = "neutral";
  if (score > 0) sentiment = "positive";
  if (score < 0) sentiment = "negative";

  return { sentiment, keywords: Array.from(matchedKeywords) };
};

const createReview = async (
  userEmail: string,
  payload: CreateReviewPayload
): Promise<IReview> => {
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
  }

  const { productId, orderId, rating, title, comment } = payload;

  const order = await Order.findOne({
    _id: orderId,
    user: user._id,
    "products.product": new Types.ObjectId(productId),
  });

  if (!order) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only review products that you have ordered."
    );
  }

  const existing = await Review.findOne({
    user: user._id,
    product: productId,
    order: orderId,
  });

  if (existing) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You already submitted a review for this product in this order."
    );
  }

  const { sentiment, keywords } = analyzeSentiment(comment);

  const review = await Review.create({
    user: user._id,
    product: productId,
    order: orderId,
    rating,
    title,
    comment,
    sentiment,
    keywords,
  });

  return review.populate([
    { path: "user", select: "name email profileImage" },
    { path: "product", select: "name image" },
  ]);
};

const getProductReviews = async (productId: string) => {
  return await Review.find({ product: productId, status: "approved" })
    .sort({ createdAt: -1 })
    .populate([
      { path: "user", select: "name email profileImage" },
      { path: "product", select: "name image" },
    ]);
};

const getPublicReviews = async (limit?: number) => {
  const query = Review.find({ status: "approved" })
    .sort({ createdAt: -1 })
    .populate([
      { path: "user", select: "name email profileImage" },
      { path: "product", select: "name image" },
    ]);

  if (limit && limit > 0) {
    query.limit(limit);
  }

  return await query;
};

const getReviewById = async (id: string) => {
  return await Review.findById(id).populate([
    { path: "user", select: "name email profileImage" },
    { path: "product", select: "name image" },
  ]);
};

const getAdminReviews = async (status?: TReviewStatus | "all") => {
  const filter: Record<string, unknown> = {};
  if (status && status !== "all") {
    filter.status = status;
  }

  return await Review.find(filter)
    .sort({ createdAt: -1 })
    .populate([
      { path: "user", select: "name email profileImage" },
      { path: "product", select: "name image" },
    ]);
};

const updateReviewModeration = async (
  id: string,
  status: TReviewStatus,
  adminReply?: string
) => {
  const updatePayload: Partial<IReview> = { status };
  if (adminReply !== undefined) {
    updatePayload.adminReply = adminReply;
  }

  const result = await Review.findByIdAndUpdate(id, updatePayload, {
    new: true,
    runValidators: true,
  }).populate([
    { path: "user", select: "name email profileImage" },
    { path: "product", select: "name image" },
  ]);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  return result;
};

const getUserReviews = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
  }

  return await Review.find({ user: user._id })
    .sort({ createdAt: -1 })
    .populate([
      { path: "product", select: "name image" },
      { path: "user", select: "name email profileImage" },
    ]);
};

const getSentimentSummary = async () => {
  const total = await Review.countDocuments();
  const pending = await Review.countDocuments({ status: "pending" });
  const sentimentBreakdown = await Review.aggregate([
    { $group: { _id: "$sentiment", count: { $sum: 1 } } },
  ]);

  const averageRatingResult = await Review.aggregate([
    { $group: { _id: null, avgRating: { $avg: "$rating" } } },
  ]);

  const keywordCounts = await Review.aggregate([
    { $unwind: "$keywords" },
    {
      $group: {
        _id: "$keywords",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  return {
    total,
    pending,
    averageRating: averageRatingResult?.[0]?.avgRating || 0,
    sentiments: sentimentBreakdown.reduce(
      (acc: Record<TSentiment, number>, item) => {
        acc[item._id as TSentiment] = item.count;
        return acc;
      },
      { positive: 0, negative: 0, neutral: 0 }
    ),
    topKeywords: keywordCounts.map((item) => ({
      keyword: item._id,
      count: item.count,
    })),
  };
};

const replyTemplates = [
  "Thank you for sharing this feedback. We're thrilled you enjoyed it!",
  "We hear you and are already working on improving this experience.",
  "Thanks for reviewing your order. Let us know if we can support you further.",
  "Appreciate the honest review. We'll pass this to our quality team.",
  "Glad this product worked well for you. Your next order is on the way!",
];

const getReplyTemplates = () => replyTemplates;

export const reviewService = {
  createReview,
  getProductReviews,
  getReviewById,
  getAdminReviews,
  updateReviewModeration,
  getSentimentSummary,
  getPublicReviews,
  getUserReviews,
  getReplyTemplates,
};
