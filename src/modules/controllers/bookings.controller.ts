import { Request, Response } from "express";
import { BookingsService } from "../services/bookings.service";
import { UserRole } from "../../middlewares/auth";


const createBooking = async (req: Request, res: Response) => {
    try {
        const { userId, tutorId, date, startTime, endTime } = req.body
        const result = await BookingsService.createBooking(userId, tutorId, date, startTime, endTime)
        res.status(200).json({
            success: true,
            message: "Booking created successfully",
            data: result
        })
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: "Booking created failed",
            error: e.message
        })
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

export const BookingsController = {
    createBooking,
    getBookings,
    getBookingsById
}