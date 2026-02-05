import Product from "../products/product.model";
import mongoose, { ObjectId } from "mongoose";
import Order from "./order.model";
import Cart from "../cart/cart.model";
import Promotion from "../promotions/promotion.model";

type paymentDetails = {
  address: string;
  paymentMethod: "Bkash" | "Nagad" | "COD" | "Card";
  promoCode?: string;
  stripeSessionId?: string;
};

const validatePromotionForSubtotal = async (code: string, subtotal: number) => {
  const promo = await Promotion.findOne({ code: code.toUpperCase() });
  if (!promo) return null;

  const now = new Date();
  if (promo.startDate && now < new Date(promo.startDate)) return null;
  if (promo.endDate && now > new Date(promo.endDate)) return null;
  if (promo.usageLimit && promo.usedCount && promo.usedCount >= promo.usageLimit) return null;
  if (promo.minimumOrder && subtotal < promo.minimumOrder) return null;

  let discount = 0;
  if (promo.discountType === "percentage") {
    discount = (subtotal * promo.value) / 100;
  } else {
    discount = Math.min(promo.value, subtotal);
  }

  discount = Math.max(0, discount);
  return { promo, discount };
};

const applyProportionalDiscount = (
  items: { totalPrice: number }[],
  discount: number,
) => {
  if (!items.length || discount <= 0) return items;

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  if (subtotal <= 0) return items;

  const finalTotal = Math.max(0, subtotal - discount);
  const factor = finalTotal / subtotal;

  const adjusted = items.map((item) => ({
    ...item,
    totalPrice: Math.round(item.totalPrice * factor * 100) / 100,
  }));

  const roundedSum = adjusted.reduce((sum, item) => sum + item.totalPrice, 0);
  const remainder = Math.round((finalTotal - roundedSum) * 100) / 100;
  if (adjusted.length > 0 && remainder !== 0) {
    adjusted[adjusted.length - 1].totalPrice = Math.max(
      0,
      Math.round((adjusted[adjusted.length - 1].totalPrice + remainder) * 100) / 100,
    );
  }

  return adjusted;
};
const createOrder = async (
  userId: mongoose.Types.ObjectId,
  cartItems: any,
  paymentDetails: paymentDetails
) => {
  const baseOrderProducts = cartItems.map((item: any) => ({
    product: item.product._id,
    quantity: item.quantity,
    totalPrice: item.product.price * item.quantity,
  }));

  const subtotal = baseOrderProducts.reduce(
    (sum: number, item: { totalPrice: number }) => sum + item.totalPrice,
    0
  );

  const { address, paymentMethod, promoCode, stripeSessionId } = paymentDetails;

  let orderProducts = baseOrderProducts;
  let totalAmount = subtotal;

  if (promoCode) {
    const promoResult = await validatePromotionForSubtotal(promoCode, subtotal);
    if (promoResult) {
      orderProducts = applyProportionalDiscount(baseOrderProducts, promoResult.discount);
      totalAmount = orderProducts.reduce(
        (sum: number, item: { totalPrice: number }) => sum + item.totalPrice,
        0,
      );
      await Promotion.findByIdAndUpdate(promoResult.promo._id, { $inc: { usedCount: 1 } });
    }
  }

  const order = await Order.create({
    user: userId,
    ...(stripeSessionId ? { stripeSessionId } : {}),
    products: orderProducts,
    totalAmount,
    address,
    paymentMethod,
  });

  for (const item of cartItems) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { quantity: -item.quantity },
    });
  }

  await Cart.deleteMany({ user: userId });

  return order;
};


//allow user's to see their own orders
const getOrdersFromDb = async (_id:any ) => {
  const {convertedId} =  _id;
  return await Order.find({user:convertedId})
    .populate({
      path: "products.product",
    })
    .populate("user");
};

const getOrdersByAdminFromDb = async () => {
  return await Order.find()
    .populate({
      path: "products.product",
    })
    .populate("user");
};

const getAllOrdersFromDb = async () => {
  return await Order.find()
    .populate("user", "-password")
    .populate("products.product");
};

const getSuccessfullPaymentsFromDb = async () => {
  const status = "completed";
  return await Order.find({ status })
    .populate("user", "-password")
    .populate("products.product");
};

const deleteOrderFromDb = async (orderId: string) => {
  return await Order.findByIdAndDelete(orderId);
};

const changeOrderStatusIntoDb = async (orderId: string, status: string) => {
  return await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true }
  );
};
const changePrescriptionStatusIntoDb = async (
  orderId: string,
  isPrescriptionSubmitted: boolean
) => {
  return await Cart.findByIdAndUpdate(
    orderId,
    { isPrescriptionSubmitted },
    { new: true, runValidators: true }
  );
};

export const orderService = {
  createOrder,
  getOrdersFromDb,
  getAllOrdersFromDb,
  deleteOrderFromDb,
  changeOrderStatusIntoDb,
  getOrdersByAdminFromDb,
  getSuccessfullPaymentsFromDb,
  changePrescriptionStatusIntoDb,
};
