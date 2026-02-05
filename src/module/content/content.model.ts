import { model, Schema } from "mongoose";
import { BannerContent, FaqItem, HighlightItem, IContent } from "./content.interface";

const bannerSchema = new Schema<BannerContent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    ctaLabel: { type: String, trim: true },
    ctaLink: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const faqSchema = new Schema<FaqItem>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
  },
  { _id: true }
);

const highlightSchema = new Schema<HighlightItem>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    badge: { type: String, trim: true },
  },
  { _id: true }
);

const contentSchema = new Schema<IContent>(
  {
    banners: { type: [bannerSchema], default: [] },
    faqs: { type: [faqSchema], default: [] },
    highlights: { type: [highlightSchema], default: [] },
    updatedBy: { type: String, trim: true },
  },
  { timestamps: true }
);

const Content = model<IContent>("Content", contentSchema);

export default Content;
