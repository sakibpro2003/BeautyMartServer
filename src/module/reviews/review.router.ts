import { Router } from "express";
import auth from "../../app/middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import { reviewController } from "./review.controller";

const router = Router();

router.post("/", auth(USER_ROLE.CUSTOMER), reviewController.createReview);
router.get("/", reviewController.getPublicReviews);
router.get("/product/:productId", reviewController.getProductReviews);
router.get("/me", auth(USER_ROLE.CUSTOMER), reviewController.getUserReviews);
router.get("/admin/summary", auth(USER_ROLE.ADMIN), reviewController.getSentimentSummary);
router.get("/admin", auth(USER_ROLE.ADMIN), reviewController.getAdminReviews);
router.get("/templates", auth(USER_ROLE.ADMIN), reviewController.getReplyTemplates);
router.patch("/:id", auth(USER_ROLE.ADMIN), reviewController.updateReviewModeration);
router.get("/:id", reviewController.getReviewById);

export const reviewRoutes = router;

