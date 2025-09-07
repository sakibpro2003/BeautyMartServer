import { Types } from "mongoose";

const paymentMethods = ["bKash", "Nagad", "Cash on Delivery", "Card"] as const;

type PaymentMethod = (typeof paymentMethods)[number];

export type OrderPayload = {
  userId: Types.ObjectId;
  phone: string;
  address: string;
  items: {
    product: Types.ObjectId;
    quantity: number;
  }[];
  totalPrice: number;
  paymentMethod: PaymentMethod;
};
