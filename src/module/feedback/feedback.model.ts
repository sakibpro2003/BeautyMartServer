import { model, Schema, Types } from "mongoose";
import { FeedbackStatus, FeedbackType, IFeedback } from "./feedback.interface";

const feedbackSchema = new Schema<IFeedback>(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["complaint", "suggestion", "question"] satisfies FeedbackType[],
      default: "complaint",
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"] satisfies FeedbackStatus[],
      default: "open",
    },
    adminReply: { type: String, trim: true },
  },
  { timestamps: true }
);

const Feedback = model<IFeedback>("Feedback", feedbackSchema);

export default Feedback;
