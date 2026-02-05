import { Types } from "mongoose";

export interface IShadeRecommendation {
  product?: Types.ObjectId;
  reason?: string;
  confidence?: number;
}

export interface IShadeQuiz {
  _id?: string;
  user: Types.ObjectId;
  skinTone: string;
  undertone: string;
  skinType: string;
  concerns: string[];
  preferredFinish?: string;
  preferredCoverage?: string;
  currentShade?: string;
  lighting?: string;
  photoConsent?: boolean;
  notes?: string;
  recommendations?: IShadeRecommendation[];
  confidence?: number;
  createdAt?: string;
  updatedAt?: string;
}
