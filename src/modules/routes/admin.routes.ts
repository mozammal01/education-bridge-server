import express, { Router } from 'express';
import auth, { UserRole } from '../../middlewares/auth.js';
import { AdminController } from '../controllers/admin.controller.js';

const router = express.Router();

router.get(
    "/stats",
    auth(UserRole.ADMIN),
    AdminController.getStats
);

router.get(
    "/payments",
    auth(UserRole.ADMIN),
    AdminController.getPayments
);

export const adminRouter: Router = router;
