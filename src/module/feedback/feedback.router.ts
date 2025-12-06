import express from "express";
import auth from "../../app/middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import { feedbackController } from "./feedback.controller";

const router = express.Router();

router.post("/", auth(USER_ROLE.CUSTOMER, USER_ROLE.ADMIN), feedbackController.createFeedback);
router.get("/me", auth(USER_ROLE.CUSTOMER, USER_ROLE.ADMIN), feedbackController.getMyFeedback);
router.get("/", auth(USER_ROLE.ADMIN), feedbackController.getAllFeedback);
router.patch("/:id/reply", auth(USER_ROLE.ADMIN), feedbackController.replyToFeedback);

export const feedbackRoutes = router;
