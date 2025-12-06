import { Types } from "mongoose";
import ReturnRequest from "./return.model";
import { IReturnRequest, ReturnStatus } from "./return.interface";

const createReturn = async (payload: Omit<IReturnRequest, "status">) => {
  const doc = await ReturnRequest.create({ ...payload, status: "pending" });
  return doc.populate(["order", "user", "items.product"]);
};

const getUserReturns = async (userId: Types.ObjectId) => {
  return ReturnRequest.find({ user: userId }).populate(["order", "items.product"]).sort({ createdAt: -1 });
};

const getAllReturns = async () => {
  return ReturnRequest.find().populate(["order", "user", "items.product"]).sort({ createdAt: -1 });
};

const updateReturnStatus = async (
  id: string,
  status: ReturnStatus,
  resolutionNote?: string
) => {
  return ReturnRequest.findByIdAndUpdate(
    id,
    { status, resolutionNote },
    { new: true, runValidators: true }
  ).populate(["order", "user", "items.product"]);
};

const getReasonAnalytics = async () => {
  const pipeline = [
    { $group: { _id: "$reason", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ];
  const results = await ReturnRequest.aggregate(pipeline);
  return results.map((r) => ({ reason: r._id, count: r.count }));
};

export const returnService = {
  createReturn,
  getUserReturns,
  getAllReturns,
  updateReturnStatus,
  getReasonAnalytics,
};
