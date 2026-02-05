import { model, Schema, Types } from "mongoose";
import { IReturnRequest } from "./return.interface";

const returnSchema = new Schema<IReturnRequest>(
  {
    order: { type: Types.ObjectId, ref: "Order", required: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    reason: { type: String, required: true, trim: true },
    notes: { type: String, trim: true },
    images: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ["pending", "approved", "denied", "refunded", "exchanged", "closed"],
      default: "pending",
    },
    type: { type: String, enum: ["refund", "exchange"], required: true },
    resolutionNote: { type: String, trim: true },
  },
  { timestamps: true }
);

const ReturnRequest = model<IReturnRequest>("ReturnRequest", returnSchema);

export default ReturnRequest;
