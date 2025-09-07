import { Document, Types } from "mongoose";

export interface IOrder extends Document {
  user: Types.ObjectId;
  products: {
    product: Types.ObjectId;
    quantity: number;
    totalPrice: number;
  }[];
  totalAmount: number;
  address:string;
  status: "pending" | "processing" | "completed" | "canceled";
  paymentMethod: "Bkash" | "Nagad" | "COD" | "Card";
  createdAt: Date;
  updatedAt: Date;
}
