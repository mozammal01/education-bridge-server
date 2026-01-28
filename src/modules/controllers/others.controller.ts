import { Request, Response } from "express";
import { OthersService } from "../services/others.service";
import { UpdateStudentProfilePayload } from "../../interfaces/interfaces";

const createTutorReview = async (req: Request, res: Response) => {
    try {
        const { tutorId, rating, comment } = req.body as { tutorId: string, rating: number, comment: string };
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            })
        }
        const result = await OthersService.createTutorReview(userId, tutorId, rating, comment);
        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: result
        })
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: "Review created failed",
            error: e.message
        })
    }
}

const updateStudentProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            })
        }
        const result = await OthersService.updateStudentProfile(userId, req.body as UpdateStudentProfilePayload);
        res.status(200).json({
            success: true,
            message: "Student profile updated successfully",
            data: result
        })
    } catch (e: any) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: e.message
        })
    }
}

const getTutorReviews = async (req: Request, res: Response) => {
    try {
        const result = await OthersService.getTutorReviews();
        res.status(200).json({
            success: true,
            message: "Tutor reviews fetched successfully",
            data: result
        })
    } catch (e: any) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: e.message
        })
    }
}

const getTutorReviewsByTutorId = async (req: Request, res: Response) => {
    try {
        const { tutorId } = req.params as { tutorId: string };
        const result = await OthersService.getTutorReviewsByTutorId(tutorId);
        res.status(200).json({
            success: true,
            message: "Tutor reviews fetched successfully",
            data: result
        })
    }
    catch (e: any) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: e.message
        })
    }
}

export const OthersController = {
    createTutorReview,
    updateStudentProfile,
    getTutorReviews,
    getTutorReviewsByTutorId
}