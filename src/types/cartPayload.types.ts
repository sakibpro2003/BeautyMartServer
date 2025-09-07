import { ObjectId } from "mongoose";

export type TCartPayload = {
  product:ObjectId;
  quantity?: string;
  totalPrice: string;
};
