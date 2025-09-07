import express from "express";
import { AuthValidation } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import validateRequest from "../../../app/middlewares/validateRequest";
import { UserController } from "../../User/user.controller";
import auth from "../../../app/middlewares/auth";
import { USER_ROLE } from "../../User/user.constant";

const router = express.Router();

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser
);

router.put(
  "/change-password",
  auth(USER_ROLE.CUSTOMER),
  validateRequest(AuthValidation.passwordChangeValidationSchema),
  UserController.changePassword
);

router.post("/register", UserController.createUser);

export const AuthRoutes = router;
