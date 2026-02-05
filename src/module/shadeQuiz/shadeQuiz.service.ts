import { Types } from "mongoose";
import ShadeQuiz from "./shadeQuiz.model";
import { IShadeQuiz } from "./shadeQuiz.interface";

const createShadeQuiz = async (payload: Omit<IShadeQuiz, "user"> & { user: Types.ObjectId }) => {
  const doc = await ShadeQuiz.create(payload);
  return doc.populate(["user", "recommendations.product"]);
};

const getUserShadeQuizzes = async (userId: Types.ObjectId) => {
  return ShadeQuiz.find({ user: userId })
    .populate(["recommendations.product"])
    .sort({ createdAt: -1 });
};

export const shadeQuizService = {
  createShadeQuiz,
  getUserShadeQuizzes,
};
