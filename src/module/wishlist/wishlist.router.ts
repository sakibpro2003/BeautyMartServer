import { Router } from "express";
import auth from "../../app/middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import { wishlistController } from "./wishlist.controller";

const router = Router();

router.get("/", auth(USER_ROLE.CUSTOMER), wishlistController.getWishlist);
router.post("/:productId", auth(USER_ROLE.CUSTOMER), wishlistController.addToWishlist);
router.delete("/:productId", auth(USER_ROLE.CUSTOMER), wishlistController.removeFromWishlist);

export const wishlistRoutes = router;

