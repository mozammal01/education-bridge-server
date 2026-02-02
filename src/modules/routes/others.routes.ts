import express, { Router } from 'express';
import auth, { UserRole } from '../../middlewares/auth.js';
import { OthersController } from '../controllers/others.controller.js';

const router = express.Router();


router.post("/reviews", auth(UserRole.STUDENT), OthersController.createTutorReview)

router.get("/reviews", OthersController.getTutorReviews)

router.get("/reviews/:tutorId", OthersController.getTutorReviewsByTutorId)

router.put("/student/profile", auth(UserRole.STUDENT), OthersController.updateStudentProfile)

export const othersRouter: Router = router;