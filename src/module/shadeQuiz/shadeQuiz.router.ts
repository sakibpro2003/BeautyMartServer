import express from "express";
import auth from "../../app/middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import { shadeQuizController } from "./shadeQuiz.controller";

const router = express.Router();

router.post("/", auth(USER_ROLE.CUSTOMER, USER_ROLE.ADMIN), shadeQuizController.createShadeQuiz);
router.get("/me", auth(USER_ROLE.CUSTOMER, USER_ROLE.ADMIN), shadeQuizController.getMyShadeQuizzes);

export const shadeQuizRoutes = router;
