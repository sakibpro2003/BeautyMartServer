export type DiscountType = "percentage" | "fixed";

export interface IPromotion {
  name: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  value: number;
  startDate: Date;
  endDate?: Date;
  usageLimit: number;
  usedCount?: number;
  minimumOrder?: number;
}
