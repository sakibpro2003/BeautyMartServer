import { ParsedQs } from "qs";
import { FilterQuery } from "mongoose";
import IProduct from "./product.interface";

export type ProductQueryOptions = {
  filters: FilterQuery<IProduct>;
  sort: Record<string, 1 | -1>;
  limit: number;
  skip: number;
  page: number;
};

export const buildProductQueryOptions = (query: ParsedQs): ProductQueryOptions => {
  const {
    page = "1",
    limit = "20",
    sortBy = "created_at",
    sortOrder = "desc",
    search,
    category,
    form,
    brand,
    inStock,
    requiredPrescription,
    minPrice,
    maxPrice,
    minRating,
  } = query;

  const filters: FilterQuery<IProduct> = {};

  if (search && typeof search === "string") {
    const regex = { $regex: search, $options: "i" };
    filters.$or = [
      { name: regex },
      { description: regex },
      { category: regex },
      { "manufacturer.name": regex },
    ];
  }

  if (category && typeof category === "string") {
    filters.category = category;
  }

  if (form && typeof form === "string") {
    filters.form = form;
  }

  if (brand && typeof brand === "string") {
    filters["manufacturer.name"] = { $regex: brand, $options: "i" };
  }

  if (inStock !== undefined) {
    filters.inStock = inStock === "true";
  }

  if (requiredPrescription !== undefined) {
    filters.requiredPrescription = requiredPrescription === "true";
  }

  const parsedMinPrice = typeof minPrice === "string" ? Number(minPrice) : undefined;
  const parsedMaxPrice = typeof maxPrice === "string" ? Number(maxPrice) : undefined;
  const hasMinPrice = typeof minPrice === "string" && !Number.isNaN(parsedMinPrice);
  const hasMaxPrice = typeof maxPrice === "string" && !Number.isNaN(parsedMaxPrice);

  if (hasMinPrice || hasMaxPrice) {
    filters.price = {};
    if (hasMinPrice) {
      filters.price.$gte = parsedMinPrice as number;
    }
    if (hasMaxPrice) {
      filters.price.$lte = parsedMaxPrice as number;
    }
  }

  const ratingValue = typeof minRating === "string" ? Number(minRating) : undefined;
  if (typeof minRating === "string" && !Number.isNaN(ratingValue)) {
    filters.rating = { $gte: ratingValue };
  }

  const numericLimit = Math.max(1, Math.min(Number(limit) || 20, 100));
  const numericPage = Math.max(1, Number(page) || 1);
  const skip = (numericPage - 1) * numericLimit;

  const sortableFields = ["price", "created_at", "rating", "name"];
  const sortField = sortableFields.includes(String(sortBy)) ? String(sortBy) : "created_at";
  const sortDirection: 1 | -1 = sortOrder === "asc" ? 1 : -1;
  const sort = { [sortField]: sortDirection } as Record<string, 1 | -1>;

  return {
    filters,
    sort,
    limit: numericLimit,
    skip,
    page: numericPage,
  };
};
