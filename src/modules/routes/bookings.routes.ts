import express, { Router } from 'express';
import { BookingsController } from '../controllers/bookings.controller';

const router = express.Router();

router.post(
    "/bookings",
    BookingsController.createBooking
)
router.get(
    "/bookings",
    BookingsController.getBookings
)
router.get(
    "/bookings/:id",
    BookingsController.getBookingsById
)


export const bookingsRouter: Router = router;