import express, { Router } from 'express';
import { TutorController } from './tutor.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();
router.get(
    "/tutors",
    TutorController.getTutorById
)
router.get(
    "/tutors/:id",
    TutorController.getTutorById
)
router.get(
    "/categories",
    TutorController.getTutorById
)

export const tutorRouter: Router = router;