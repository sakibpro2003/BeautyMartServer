import express from "express";
import auth from "../../app/middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import { returnController } from "./return.controller";

const router = express.Router();

router.post("/", auth(USER_ROLE.CUSTOMER, USER_ROLE.ADMIN), returnController.createReturnRequest);
router.get("/me", auth(USER_ROLE.CUSTOMER, USER_ROLE.ADMIN), returnController.getMyReturns);
router.get("/analytics", auth(USER_ROLE.ADMIN), returnController.getReasonAnalytics);
router.get("/", auth(USER_ROLE.ADMIN), returnController.getAllReturns);
router.patch("/:id/status", auth(USER_ROLE.ADMIN), returnController.updateReturnStatus);

export const returnRoutes = router;
