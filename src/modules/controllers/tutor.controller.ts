import { Request, Response } from "express";
import { TutorService } from "../services/tutor.service";
import { OthersService } from "../services/others.service";


const getTutors = async (req: Request, res: Response) => {
    try {
        const result = await TutorService.getTutors()
        res.status(200).json({
            success: true,
            message: "Tutors fetched successfully",
            data: result
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
        console.log(result)

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

        // Basic validation
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
    applyAsTutor
}