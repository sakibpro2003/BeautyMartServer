import express from "express";
import auth from "../../app/middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import { cartController } from "./cart.controller";

const router = express.Router();

router.post("/", auth(USER_ROLE.CUSTOMER), cartController.addToCart);
router.put("/increase/:productId", auth(USER_ROLE.CUSTOMER), cartController.increaseAmount);
router.put("/decrease/:productId", auth(USER_ROLE.CUSTOMER), cartController.decreaseAmount);
// router.post("/", auth(USER_ROLE.ADMIN), productController.createProduct);
router.get("/", auth(USER_ROLE.CUSTOMER), cartController.getAllProductsFromCart);
// router.get("/:productId", productController.getSingleProduct);
router.delete("/remove-item/:productId",auth(USER_ROLE.CUSTOMER), cartController.removeItemController);
// router.delete("/", auth(USER_ROLE.CUSTOMER), cartController.clearCart);
export const cartRoutes = router;
