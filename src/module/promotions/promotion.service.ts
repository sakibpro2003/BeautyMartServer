import Promotion from "./promotion.model";
import { IPromotion } from "./promotion.interface";

const createPromotion = async (payload: IPromotion) => {
  return Promotion.create(payload);
};

const getAllPromotions = async () => {
  return Promotion.find().sort({ startDate: -1 });
};

const updatePromotion = async (id: string, payload: Partial<IPromotion>) => {
  return Promotion.findByIdAndUpdate(id, payload, { new: true });
};

const findByCode = async (code: string) => {
  return Promotion.findOne({ code: code.toUpperCase() });
};

export const promotionService = {
  createPromotion,
  getAllPromotions,
  updatePromotion,
  findByCode,
};
