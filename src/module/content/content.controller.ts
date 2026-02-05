import { Request, Response } from "express";
import { contentService } from "./content.service";

const getSiteContent = async (_req: Request, res: Response) => {
  try {
    const content = await contentService.getContent();
    res.json({ success: true, data: content });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to load content",
    });
  }
};

const updateSiteContent = async (req: Request, res: Response) => {
  try {
    const updated = await contentService.updateContent(req.body, req.user?.email);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to update content",
    });
  }
};

export const contentController = {
  getSiteContent,
  updateSiteContent,
};
