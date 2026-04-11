import { Request, Response } from "express";
import { AdminService } from "../services/admin.service.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";

const getStats = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getStats();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin stats fetched successfully",
        data: result
    });
});

const getPayments = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getRecentPayments();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin payments fetched successfully",
        data: result
    });
});

export const AdminController = {
    getStats,
    getPayments
}
