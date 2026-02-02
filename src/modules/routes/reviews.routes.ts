import { Router } from 'express';
import { ReviewsController } from '../controllers/reviews.controller.js';
import auth, { UserRole } from '../../middlewares/auth.js';

const router = Router();

router.get("/reviews/:tutorId", ReviewsController.getReviewsByTutor);

router.post("/reviews", auth(UserRole.STUDENT), ReviewsController.createReview);

export const reviewsRouter: Router = router;
