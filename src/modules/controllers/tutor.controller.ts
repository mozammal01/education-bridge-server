import { Request, Response } from "express";
import { TutorService } from "../services/tutor.service";
import { OthersService } from "../services/others.service";


const getTutors = async (req: Request, res: Response) => {
    try {
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

        const result = await TutorService.getTutors(filters)
        res.status(200).json({
            success: true,
            message: "Tutors fetched successfully",
            data: result.tutors,
            meta: result.meta
        })
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: "Tutors fetched failed",
            error: e.message
        })
    }
}

const getTutorById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await TutorService.getTutorById(id as string)

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Tutor not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Tutor fetched successfully",
            data: result
        })
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: "Tutor fetched failed",
            error: e.message
        })
    }
}

const getMyTutorProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id as string;
        const result = await TutorService.getMyTutorProfile(userId);
        res.status(200).json({
            success: true,
            message: "Tutor profile fetched successfully",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: e.message || "Failed to fetch tutor profile"
        });
    }
}

const updateTutorProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        console.log("Update tutor profile - userId:", userId);
        console.log("Update tutor profile - body:", req.body);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const result = await TutorService.updateTutorProfile(userId, req.body)
        res.status(200).json({
            success: true,
            message: "Tutor profile updated successfully",
            data: result
        })
    } catch (e: any) {
        console.error("Update tutor profile error:", e);
        res.status(400).json({
            success: false,
            message: e.message || "Tutor profile update failed",
            error: e.message
        })
    }
}

const updateTutorAvailability = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id as string;
        const { availability } = req.body;

        if (!Array.isArray(availability)) {
            return res.status(400).json({
                success: false,
                message: "Availability must be an array"
            });
        }

        const result = await TutorService.updateTutorAvailability(userId, availability);
        res.status(200).json({
            success: true,
            message: "Tutor availability updated successfully",
            data: result
        })
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: e.message || "Tutor availability update failed"
        })
    }
}

const getTutorAvailability = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id as string;
        const result = await TutorService.getTutorAvailability(userId);
        res.status(200).json({
            success: true,
            message: "Tutor availability fetched successfully",
            data: result
        })
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: e.message || "Failed to fetch availability"
        })
    }
}

const applyAsTutor = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            })
        }

        const { bio, hourlyRate, experience, categoryId } = req.body;

        if (!bio || !hourlyRate || !experience || !categoryId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: bio, hourlyRate, experience, categoryId"
            })
        }

        const result = await TutorService.applyAsTutor({
            userId,
            bio,
            hourlyRate: parseFloat(hourlyRate),
            experience: parseInt(experience),
            categoryId
        });

        res.status(201).json({
            success: true,
            message: "Successfully registered as a tutor!",
            data: result
        })
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: e.message || "Failed to apply as tutor"
        })
    }
}


export const TutorController = {
    getTutors,
    getTutorById,
    applyAsTutor,
    getMyTutorProfile,
    updateTutorProfile,
    updateTutorAvailability,
    getTutorAvailability
}