import { Request, Response } from "express";
import { OthersService } from "../services/others.service";

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
export const OthersController = {
    createTutorReview
}