import { Router } from 'express';
import { TutorController } from '../controllers/tutor.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = Router();

router.get(
    "/tutors",
    TutorController.getTutors
)
router.get(
    "/tutors/:id",
    TutorController.getTutorById
)

router.post(
    "/tutors/apply",
    auth(UserRole.STUDENT),
    TutorController.applyAsTutor
)

export const tutorRouter: Router = router;