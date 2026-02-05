import express from "express";
import auth from "../../app/middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import { promotionController } from "./promotion.controller";

const router = express.Router();

router.post("/", auth(USER_ROLE.ADMIN), promotionController.createPromotion);
router.get("/", promotionController.getPromotions);
router.put("/:id", auth(USER_ROLE.ADMIN), promotionController.updatePromotion);
router.get("/validate", promotionController.validatePromotion);

export const promotionRoutes = router;
