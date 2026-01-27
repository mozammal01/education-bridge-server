import express, { Router } from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { OthersController } from '../controllers/others.controller';

const router = express.Router();


router.post("/reviews", auth(UserRole.STUDENT), OthersController.createTutorReview)

export const othersRouter: Router = router;