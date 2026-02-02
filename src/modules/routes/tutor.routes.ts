import { Router } from 'express';
import { TutorController } from '../controllers/tutor.controller.js';
import auth, { UserRole } from '../../middlewares/auth.js';

const router = Router();

router.get(
    "/tutors",
    TutorController.getTutors
)
router.get(
    "/tutors/:id",
    TutorController.getTutorById
)

router.get("/tutor/profile", auth(UserRole.TUTOR), TutorController.getMyTutorProfile)
router.put("/tutor/profile", auth(UserRole.TUTOR), TutorController.updateTutorProfile)

router.get("/tutor/availability", auth(UserRole.TUTOR), TutorController.getTutorAvailability)
router.put("/tutor/availability", auth(UserRole.TUTOR), TutorController.updateTutorAvailability)

router.post(
    "/tutor/apply",
    auth(UserRole.STUDENT),
    TutorController.applyAsTutor
)

export const tutorRouter: Router = router;