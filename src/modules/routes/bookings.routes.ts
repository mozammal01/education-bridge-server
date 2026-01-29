import express, { Router } from 'express';
import { BookingsController } from '../controllers/bookings.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.post(
    "/bookings",
    auth(UserRole.STUDENT),
    BookingsController.createBooking
)

// router.post(
//     "/bookings/:id",
//     auth(UserRole.STUDENT),
//     BookingsController.cancelBooking
// )
router.get(
    "/bookings",
    auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
    BookingsController.getBookings
)
router.get(
    "/bookings/:id",
    auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
    BookingsController.getBookingsById
)

router.patch(
    "/bookings/:id/status",
    auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
    BookingsController.updateBookingStatus
)

export const bookingsRouter: Router = router;