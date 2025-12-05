import { model, Schema } from "mongoose";
import { IReview } from "./review.interface";

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: { type: String, trim: true },
    comment: { type: String, required: true, trim: true },
    sentiment: {
      type: String,
      enum: ["positive", "negative", "neutral"],
      default: "neutral",
    },
    keywords: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminReply: { type: String, trim: true },
  },
  { timestamps: true }
);

const Review = model<IReview>("Review", reviewSchema);
export default Review;

