import { Request, Response } from "express";
import { TutorService } from "../services/tutor.service.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import AppError from "../../errors/AppError.js";

const getTutors = catchAsync(async (req: Request, res: Response) => {
    const {
        categoryId,
        category,
        minRating,
        maxRating,
        minPrice,
        maxPrice,
        search,
        sortBy,
        sortOrder,
        page,
        limit
    } = req.query;

    const filters: Record<string, any> = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 100
    };

    if (categoryId) filters.categoryId = categoryId as string;
    if (category) filters.categorySlug = category as string;
    if (minRating) filters.minRating = parseFloat(minRating as string);
    if (maxRating) filters.maxRating = parseFloat(maxRating as string);
    if (minPrice) filters.minPrice = parseFloat(minPrice as string);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);
    if (search) filters.search = search as string;
    if (sortBy) filters.sortBy = sortBy as 'rating' | 'price' | 'experience';
    if (sortOrder) filters.sortOrder = sortOrder as 'asc' | 'desc';

    const result = await TutorService.getTutors(filters);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tutors fetched successfully",
        data: result.tutors,
        meta: result.meta
    });
});

const getTutorById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TutorService.getTutorById(id as string);

    if (!result) {
        throw new AppError(404, "Tutor not found");
    }

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tutor fetched successfully",
        data: result
    });
});

const getMyTutorProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const result = await TutorService.getMyTutorProfile(userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tutor profile fetched successfully",
        data: result
    });
});

const updateTutorProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        throw new AppError(401, "User not authenticated");
    }

    const result = await TutorService.updateTutorProfile(userId, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tutor profile updated successfully",
        data: result
    });
});

const updateTutorAvailability = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const { availability } = req.body;

    if (!Array.isArray(availability)) {
        throw new AppError(400, "Availability must be an array");
    }

    const result = await TutorService.updateTutorAvailability(userId, availability);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tutor availability updated successfully",
        data: result
    });
});

const getTutorAvailability = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const result = await TutorService.getTutorAvailability(userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tutor availability fetched successfully",
        data: result
    });
});

const applyAsTutor = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        throw new AppError(401, "User not authenticated");
    }

    const { bio, hourlyRate, experience, categoryId } = req.body;

    if (!bio || !hourlyRate || !experience || !categoryId) {
        throw new AppError(400, "Missing required fields: bio, hourlyRate, experience, categoryId");
    }

    const result = await TutorService.applyAsTutor({
        userId,
        bio,
        hourlyRate: parseFloat(hourlyRate),
        experience: parseInt(experience),
        categoryId
    });

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Successfully registered as a tutor!",
        data: result
    });
});

export const TutorController = {
    getTutors,
    getTutorById,
    applyAsTutor,
    getMyTutorProfile,
    updateTutorProfile,
    updateTutorAvailability,
    getTutorAvailability
}