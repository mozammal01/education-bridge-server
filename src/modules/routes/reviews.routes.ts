import { Router } from 'express';
import { ReviewsController } from '../controllers/reviews.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = Router();

router.get("/reviews/:tutorId", ReviewsController.getReviewsByTutor);

router.post("/reviews", auth(UserRole.STUDENT), ReviewsController.createReview);

export const reviewsRouter: Router = router;
