import Product from "./product.model";
import IProduct from "./product.interface";
import { ProductQueryOptions } from "./product.query";

const updateInventory = async (id: string, quantityOrdered: number) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.quantity < quantityOrdered) {
    throw new Error("Insufficient stock available");
  }

  product.quantity -= quantityOrdered;

  if (product.quantity === 0) {
    product.inStock = false;
  }

  await product.save();
  return product;
};

const createProduct = async (payload: IProduct): Promise<IProduct> => {
  const result = await Product.create(payload);
  return result;
};

const getProduct = async (options: ProductQueryOptions) => {
  const { filters, sort, limit, skip } = options;
  const result = await Product.find(filters)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();
  return result;
};

const countProducts = async (filters: Record<string, unknown>) => {
  return Product.countDocuments(filters);
};

const getSingleProduct = async (id: string) => {
  const result = await Product.findById(id);
  return result;
};
const updateProduct = async (id: string, data: IProduct) => {
  const result = await Product.findByIdAndUpdate(id, data, {
    new: true,
  });

  return result;
};
const deleteProduct = async (id: string) => {
  const result = await Product.findByIdAndDelete(id);
  return result;
};

export const userService = {
  createProduct,
  getProduct,
  countProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  updateInventory,
};
