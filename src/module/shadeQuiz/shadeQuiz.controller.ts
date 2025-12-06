import { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../User/user.model";
import { shadeQuizService } from "./shadeQuiz.service";

const createShadeQuiz = async (req: Request, res: Response) => {
  try {
    if (!req.user?.email) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await User.findOne({ email: req.user.email });
    if (!user?._id) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const {
      skinTone,
      undertone,
      skinType,
      concerns = [],
      preferredFinish,
      preferredCoverage,
      currentShade,
      lighting,
      photoConsent = false,
      notes,
      recommendations = [],
      confidence,
    } = req.body;

    if (!skinTone || !undertone || !skinType) {
      return res.status(400).json({
        success: false,
        message: "skinTone, undertone, and skinType are required",
      });
    }

    const filteredConcerns = Array.isArray(concerns)
      ? concerns.filter((c: any) => typeof c === "string" && c.trim())
      : [];

    const sanitizedRecs = Array.isArray(recommendations)
      ? recommendations
          .filter((r: any) => r?.product)
          .map((r: any) => ({
            product: r.product,
            reason: r.reason,
            confidence: r.confidence,
          }))
      : [];

    const doc = await shadeQuizService.createShadeQuiz({
      user: new mongoose.Types.ObjectId(user._id),
      skinTone: skinTone.trim(),
      undertone: undertone.trim(),
      skinType: skinType.trim(),
      concerns: filteredConcerns,
      preferredFinish,
      preferredCoverage,
      currentShade,
      lighting,
      photoConsent,
      notes,
      recommendations: sanitizedRecs,
      confidence,
    });

    res.json({ success: true, data: doc });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || "Failed to save quiz" });
  }
};

const getMyShadeQuizzes = async (req: Request, res: Response) => {
  try {
    if (!req.user?.email) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await User.findOne({ email: req.user.email });
    if (!user?._id) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const list = await shadeQuizService.getUserShadeQuizzes(new mongoose.Types.ObjectId(user._id));
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || "Failed to load quiz" });
  }
};

export const shadeQuizController = {
  createShadeQuiz,
  getMyShadeQuizzes,
};
