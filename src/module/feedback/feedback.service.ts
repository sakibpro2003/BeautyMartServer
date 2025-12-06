import { Types } from "mongoose";
import Feedback from "./feedback.model";
import { FeedbackStatus, IFeedback } from "./feedback.interface";

const createFeedback = async (payload: Omit<IFeedback, "status">) => {
  const doc = await Feedback.create({ ...payload, status: "open" });
  return doc.populate("user");
};

const getUserFeedback = async (userId: Types.ObjectId) => {
  return Feedback.find({ user: userId }).populate("user").sort({ createdAt: -1 });
};

const getAllFeedback = async () => {
  return Feedback.find().populate("user").sort({ createdAt: -1 });
};

const replyToFeedback = async (
  id: string,
  adminReply?: string,
  status?: FeedbackStatus
) => {
  const updates: Partial<IFeedback> = {};
  if (adminReply !== undefined) updates.adminReply = adminReply;
  if (status) updates.status = status;

  return Feedback.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate(
    "user"
  );
};

export const feedbackService = {
  createFeedback,
  getUserFeedback,
  getAllFeedback,
  replyToFeedback,
};
