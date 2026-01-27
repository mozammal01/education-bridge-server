import { Request, Response } from "express";
import { TutorService } from "./tutor.service";

const getTutorById = async (req: Request, res: Response) => {
    res.status(200).json({
        message: "Tutor fetched successfully"
    })
    // try {
    //     const { tutorId } = req.params
    //     const result = await TutorService.getTutorById(tutorId as string)
    //     res.status(200).json(result)
    // } catch (e) {
    //     res.status(400).json({
    //         error: "Tutor fetched failed",
    //         details: e
    //     })
    // }
}

const getTutorByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const result = await TutorService.getTutorByUserId(userId as string)
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Tutor fetched failed",
            details: e
        })
    }
}

export const TutorController = {
    getTutorById,
    getTutorByUserId,
}