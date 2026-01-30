import { Request, Response } from "express";
import { UserService } from "../services/users.service";


const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await UserService.getUsers()
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: result
        })
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: "Users fetched failed",
            error: e.message
        })
    }
}

const updateUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await UserService.updateUserById(id as string, req.body)
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: result
        })
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: "User fetched failed",
            error: e.message
        })
    }
}

const uploadAvatar = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id as string;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file provided"
            });
        }

        const avatarPath = `/uploads/avatars/${req.file.filename}`;

        const result = await UserService.updateAvatar(userId, avatarPath);

        res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: e.message || "Image upload failed"
        });
    }
}

const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id as string;
        const { name, phone } = req.body;

        const result = await UserService.updateUserById(userId, { name, phone });

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: e.message || "Profile update failed"
        });
    }
}

export const UserController = {
    getUsers,
    updateUserById,
    uploadAvatar,
    updateProfile
}