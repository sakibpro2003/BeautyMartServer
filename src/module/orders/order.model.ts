import mongoose, { Schema, model } from "mongoose";
import { IOrder } from "./order.interface";

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        totalPrice: { type: Number, required: true },
      },
    ],
    address: { type: String, required: true },
    paymentMethod: { type: String, enum: ["Bkash", "Nagad", "COD", "Card"] },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = model<IOrder>("Order", OrderSchema);
export default Order;
