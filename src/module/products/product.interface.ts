import { Document, Types } from "mongoose";

interface IProduct extends Document {
  name: string;
  description: string;
  image: string;
  price: number;
  inStock: boolean;
  quantity: number;
  rating: number;
  dosage: string;
  discount: number;
  packSize: string;
  requiredPrescription: boolean;
  expiryDate: Date;
  category: "Skincare" | "Haircare" | "Makup" | "Vitamin" | "Fragrance" | "Lip";
  form:
    | "Cream"
    | "Serum"
    | "Lotion"
    | "Cleanser"
    | "Mask"
    | "Oil"
    | "Toner"
    | "Gel"
    | "Mist"
    | "Balm";
  manufacturer: {
    name: string;
    address?: string;
    contact?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export default IProduct;
