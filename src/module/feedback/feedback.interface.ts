import { Types } from "mongoose";

export type FeedbackType = "complaint" | "suggestion" | "question";
export type FeedbackStatus = "open" | "in-progress" | "resolved";

export interface IFeedback {
  _id?: string;
  user: Types.ObjectId;
  subject: string;
  message: string;
  type: FeedbackType;
  status: FeedbackStatus;
  adminReply?: string;
  createdAt?: string;
  updatedAt?: string;
}
