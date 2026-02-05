import { Request, Response } from "express";
import { returnService } from "./return.service";
import { User } from "../User/user.model";
import mongoose from "mongoose";

const createReturnRequest = async (req: Request, res: Response) => {
  try {
    if (!req.user?.email) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await User.findOne({ email: req.user.email });
    if (!user?._id) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const payload = req.body;
    if (!payload.order || !payload.items?.length || !payload.reason || !payload.type) {
      return res
        .status(400)
        .json({ success: false, message: "Order, items, reason, and type are required" });
    }
    const sanitizedItems = payload.items
      .filter((i: any) => i?.product && Number(i?.quantity) > 0)
      .map((i: any) => ({ product: i.product, quantity: Number(i.quantity) }));
    if (!sanitizedItems.length) {
      return res.status(400).json({ success: false, message: "At least one item is required" });
    }

    const doc = await returnService.createReturn({
      ...payload,
      items: sanitizedItems,
      user: user._id,
    });

    res.json({ success: true, data: doc });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || "Failed to submit request" });
  }
};

const getMyReturns = async (req: Request, res: Response) => {
  try {
    if (!req.user?.email) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await User.findOne({ email: req.user.email });
    if (!user?._id) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const list = await returnService.getUserReturns(new mongoose.Types.ObjectId(user._id));
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || "Failed to load requests" });
  }
};

const getAllReturns = async (_req: Request, res: Response) => {
  try {
    const list = await returnService.getAllReturns();
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || "Failed to load returns" });
  }
};

const updateReturnStatus = async (req: Request, res: Response) => {
  try {
    const { status, resolutionNote } = req.body;
    const updated = await returnService.updateReturnStatus(req.params.id, status, resolutionNote);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Return request not found" });
    }
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || "Failed to update status" });
  }
};

const getReasonAnalytics = async (_req: Request, res: Response) => {
  try {
    const data = await returnService.getReasonAnalytics();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || "Failed to load analytics" });
  }
};

export const returnController = {
  createReturnRequest,
  getMyReturns,
  getAllReturns,
  updateReturnStatus,
  getReasonAnalytics,
};
