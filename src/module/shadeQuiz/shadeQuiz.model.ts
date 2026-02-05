import { model, Schema, Types } from "mongoose";
import { IShadeQuiz, IShadeRecommendation } from "./shadeQuiz.interface";

const recommendationSchema = new Schema<IShadeRecommendation>(
  {
    product: { type: Types.ObjectId, ref: "Product" },
    reason: { type: String, trim: true },
    confidence: { type: Number, min: 0, max: 100 },
  },
  { _id: false }
);

const shadeQuizSchema = new Schema<IShadeQuiz>(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    skinTone: { type: String, required: true, trim: true },
    undertone: { type: String, required: true, trim: true },
    skinType: { type: String, required: true, trim: true },
    concerns: [{ type: String, trim: true }],
    preferredFinish: { type: String, trim: true },
    preferredCoverage: { type: String, trim: true },
    currentShade: { type: String, trim: true },
    lighting: { type: String, trim: true },
    photoConsent: { type: Boolean, default: false },
    notes: { type: String, trim: true },
    confidence: { type: Number, min: 0, max: 100 },
    recommendations: [recommendationSchema],
  },
  { timestamps: true }
);

const ShadeQuiz = model<IShadeQuiz>("ShadeQuiz", shadeQuizSchema);

export default ShadeQuiz;
