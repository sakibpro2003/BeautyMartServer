import Product from "../products/product.model";
import mongoose, { ObjectId } from "mongoose";
import Order from "./order.model";
import Cart from "../cart/cart.model";

type paymentDetails = {
  address: string;
  paymentMethod: ["Bkash", "Nagad", "COD", "Card"];
};
const createOrder = async (
  userId: mongoose.Types.ObjectId,
  cartItems: any,
  paymentDetails: paymentDetails
) => {
  const orderProducts = cartItems.map((item: any) => ({
    product: item.product._id,
    quantity: item.quantity,
    totalPrice: item.product.price * item.quantity,
  }));

  const totalAmount = orderProducts.reduce(
    (sum: number, item: { totalPrice: number }) => sum + item.totalPrice,
    0
  );
  const { address, paymentMethod } = paymentDetails;

  const order = await Order.create({
    user: userId,
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
