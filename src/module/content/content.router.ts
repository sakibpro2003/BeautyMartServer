import express from "express";
import auth from "../../app/middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import { contentController } from "./content.controller";

const router = express.Router();

router.get("/", contentController.getSiteContent);
router.put("/", auth(USER_ROLE.ADMIN), contentController.updateSiteContent);

export const contentRoutes = router;
