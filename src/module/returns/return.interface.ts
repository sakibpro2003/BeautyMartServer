import { Types } from "mongoose";

export type ReturnStatus = "pending" | "approved" | "denied" | "refunded" | "exchanged" | "closed";
export type ReturnType = "refund" | "exchange";

export interface IReturnRequest {
  order: Types.ObjectId;
  user: Types.ObjectId;
  items: Array<{
    product: Types.ObjectId;
    quantity: number;
  }>;
  reason: string;
  notes?: string;
  images?: string[];
  status: ReturnStatus;
  type: ReturnType;
  resolutionNote?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
