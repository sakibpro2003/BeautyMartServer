import { Document, Types } from "mongoose";

export type TSentiment = "positive" | "negative" | "neutral";
export type TReviewStatus = "pending" | "approved" | "rejected";

export interface IReview extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  order: Types.ObjectId;
  rating: number;
  title?: string;
  comment: string;
  sentiment: TSentiment;
  keywords: string[];
  status: TReviewStatus;
  adminReply?: string;
  createdAt: Date;
  updatedAt: Date;
}

