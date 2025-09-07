import { Router } from "express";
import { orderController } from "./order.controller";
import auth from "../../app/middlewares/auth";
import { USER_ROLE } from "../User/user.constant";

const router = Router();

router.get(
  "/user-order/:email",
  auth(USER_ROLE.ADMIN),
  orderController.getUserSpecificOrders
);
router.get(
  "/payments/successful-transactions",
  auth(USER_ROLE.ADMIN),
  orderController.getSuccessfullPayments
);
router.post("/", auth(USER_ROLE.CUSTOMER), orderController.createOrder);
router.get(
  "/",
  auth(USER_ROLE.CUSTOMER),
  orderController.getOrders
);
router.get(
  "/:email",
  auth(USER_ROLE.CUSTOMER, USER_ROLE.ADMIN),
  orderController.getOrdersByAdmin
);
router.delete("/:orderId", auth(USER_ROLE.ADMIN), orderController.deleteOrder);
router.put(
  "/:orderId",
  auth(USER_ROLE.ADMIN),
  orderController.changeOrderStatus
);
router.put(
  "/submit-prescription/:orderId",
  auth(USER_ROLE.CUSTOMER),
  orderController.changePrescriptionStatus
);

export default router;
