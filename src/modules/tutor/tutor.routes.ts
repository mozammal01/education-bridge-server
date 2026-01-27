import express, { Router } from 'express';
import { TutorController } from './tutor.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.get(
    "/tutors",
    TutorController.getTutors
)
router.get(
    "/tutors/:id",
    TutorController.getTutorById
)
router.get(
    "/categories",
    TutorController.getCategories
)


router.post(
    "/tutors/apply",
    auth(UserRole.STUDENT),
    TutorController.applyAsTutor
)

export const tutorRouter: Router = router;