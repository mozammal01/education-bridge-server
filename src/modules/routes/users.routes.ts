import express, { Router } from 'express';
import { TutorController } from '../controllers/tutor.controller';
import auth, { UserRole } from '../../middlewares/auth';
import { UserController } from '../controllers/users.controller';

const router = express.Router();

router.get(
    "/admin/users",
    auth(UserRole.ADMIN),
    UserController.getUsers
)
router.patch(
    "/admin/users/:id",
    auth(UserRole.ADMIN),
    UserController.updateUserById
)

export const usersRouter: Router = router;