import { Request, Response } from "express";
import { promotionService } from "./promotion.service";

const createPromotion = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const exists = await promotionService.findByCode(payload.code || "");
    if (exists) {
      return res.status(409).json({ success: false, message: "Promotion code already exists" });
    }
    const promo = await promotionService.createPromotion(payload);
    res.json({ success: true, data: promo });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || "Failed to create promo" });
  }
};

const getPromotions = async (_req: Request, res: Response) => {
  try {
    const promos = await promotionService.getAllPromotions();
    res.json({ success: true, data: promos });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || "Failed to load promos" });
  }
};

const updatePromotion = async (req: Request, res: Response) => {
  try {
    const promo = await promotionService.updatePromotion(req.params.id, req.body);
    if (!promo) {
      return res.status(404).json({ success: false, message: "Promotion not found" });
    }
    res.json({ success: true, data: promo });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || "Failed to update promo" });
  }
};

const validatePromotion = async (req: Request, res: Response) => {
  try {
    const code = (req.query.code as string) || "";
    const promo = await promotionService.findByCode(code);
    if (!promo) {
      return res.status(404).json({ success: false, message: "Code not found" });
    }

    const now = new Date();
    if (promo.startDate && now < new Date(promo.startDate)) {
      return res.status(400).json({ success: false, message: "Promotion not active yet" });
    }
    if (promo.endDate && now > new Date(promo.endDate)) {
      return res.status(400).json({ success: false, message: "Promotion expired" });
    }
    if (promo.usageLimit && promo.usedCount && promo.usedCount >= promo.usageLimit) {
      return res.status(400).json({ success: false, message: "Promotion limit reached" });
    }

    res.json({ success: true, data: promo });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || "Validation failed" });
  }
};

export const promotionController = {
  createPromotion,
  getPromotions,
  updatePromotion,
  validatePromotion,
};
