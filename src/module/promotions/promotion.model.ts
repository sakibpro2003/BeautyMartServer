import { model, Schema } from "mongoose";
import { IPromotion } from "./promotion.interface";

const promotionSchema = new Schema<IPromotion>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, unique: true, uppercase: true },
    description: { type: String, trim: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    value: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    usageLimit: { type: Number, required: true, min: 1 },
    usedCount: { type: Number, default: 0, min: 0 },
    minimumOrder: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
  }
);

const Promotion = model<IPromotion>("Promotion", promotionSchema);

export default Promotion;
