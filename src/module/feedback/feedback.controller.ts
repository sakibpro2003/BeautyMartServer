import { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../User/user.model";
import { feedbackService } from "./feedback.service";
import { FeedbackStatus } from "./feedback.interface";

const createFeedback = async (req: Request, res: Response) => {
  try {
    if (!req.user?.email) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await User.findOne({ email: req.user.email });
    if (!user?._id) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { subject, message, type } = req.body;
    const allowedTypes = ["complaint", "suggestion", "question"];
    const feedbackType = allowedTypes.includes(type) ? type : "complaint";
    if (!subject || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Subject and message are required" });
    }

    const doc = await feedbackService.createFeedback({
      subject: subject.trim(),
      message: message.trim(),
      type: feedbackType,
      user: user._id,
    } as any);

    res.json({ success: true, data: doc });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || "Failed to submit" });
  }
};

const getMyFeedback = async (req: Request, res: Response) => {
  try {
    if (!req.user?.email) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await User.findOne({ email: req.user.email });
    if (!user?._id) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const data = await feedbackService.getUserFeedback(new mongoose.Types.ObjectId(user._id));
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || "Failed to load feedback" });
  }
};

const getAllFeedback = async (_req: Request, res: Response) => {
  try {
    const data = await feedbackService.getAllFeedback();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || "Failed to load feedback" });
  }
};

const replyToFeedback = async (req: Request, res: Response) => {
  try {
    const { adminReply, status } = req.body as { adminReply?: string; status?: FeedbackStatus };
    const updated = await feedbackService.replyToFeedback(req.params.id, adminReply, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || "Failed to reply" });
  }
};

export const feedbackController = {
  createFeedback,
  getMyFeedback,
  getAllFeedback,
  replyToFeedback,
};
