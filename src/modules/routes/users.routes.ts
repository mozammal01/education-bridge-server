import express, { Router } from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { UserController } from '../controllers/users.controller';
import { uploadAvatar } from '../../config/multer';

const router = express.Router();

router.post(
    "/user/image",
    auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
    uploadAvatar.single("image"),
    UserController.uploadAvatar
)

router.patch(
    "/user/profile",
    auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
    UserController.updateProfile
)

router.patch(
    "/user/role",
    auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
    UserController.updateRole
)

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