import { Request, Response } from "express";
import { BookingsService } from "../services/bookings.service.js";
import { UserRole } from "../../middlewares/auth.js";


const createBooking = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id as string;
        const { tutorId, date, startTime, endTime } = req.body;

        // Validate required fields
        if (!tutorId || !date || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: tutorId, date, startTime, endTime"
            });
        }

        const result = await BookingsService.createBooking(userId, tutorId, date, startTime, endTime);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result
        });
    } catch (e: any) {
        console.error("Booking error:", e.message);
        res.status(400).json({
            success: false,
            message: e.message || "Booking creation failed"
        });
    }
}

const getBookings = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id as string
        const userRole = req.user?.role as UserRole
        const result = await BookingsService.getBookings(userId, userRole)
        res.status(200).json({
            success: true,
            message: "Bookings fetched successfully",
            data: result
        })
    } catch (e: any) {

        res.status(400).json({
            success: false,
            message: "Bookings fetched failed",
            error: e.message
        })
    }
}


const getBookingsById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await BookingsService.getBookingById(id as string)
        res.status(200).json({
            success: true,
            message: "Bookings fetched successfully",
            data: result
        })
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: "Bookings fetched failed",
            error: e.message
        })
    }
}

const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body as { status: 'COMPLETED' | 'CANCELLED' };
        const userId = req.user?.id as string;
        const userRole = req.user?.role as UserRole;

        if (!status || !['COMPLETED', 'CANCELLED'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be 'COMPLETED' or 'CANCELLED'"
            });
        }

        const result = await BookingsService.updateBookingStatus(id as string, userId, userRole, status);
        res.status(200).json({
            success: true,
            message: `Booking ${status.toLowerCase()} successfully`,
            data: result
        });
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: e.message || "Failed to update booking status"
        });
    }
}

export const BookingsController = {
    createBooking,
    getBookings,
    getBookingsById,
    updateBookingStatus
}