import { Request, Response } from "express";
import { ReviewsService } from "../services/reviews.service.js";

const getReviewsByTutor = async (req: Request, res: Response) => {
    try {
        const { tutorId } = req.params;
        const result = await ReviewsService.getReviewsByTutor(tutorId as string);
        res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: e.message || "Failed to fetch reviews"
        });
    }
};

const getPlatformReviews = async (req: Request, res: Response) => {
    try {
        const result = await ReviewsService.getPlatformReviews();
        res.status(200).json({
            success: true,
            message: "Platform reviews fetched successfully",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: e.message || "Failed to fetch platform reviews"
        });
    }
};

const createReview = async (req: Request, res: Response) => {
    try {
        const studentId = req.user?.id as string;
        const { tutorId, rating, comment } = req.body;

        if (!rating || !comment) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: rating, comment"
            });
        }

        const result = await ReviewsService.createReview(studentId, tutorId || null, rating, comment);
        res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: e.message || "Failed to submit review"
        });
    }
};

export const ReviewsController = {
    getReviewsByTutor,
    getPlatformReviews,
    createReview
};
