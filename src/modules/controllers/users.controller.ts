import { Request, Response } from "express";
import { UserService } from "../services/users.service.js";
import { prisma } from "../../lib/prisma.js";


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

        // Check if we're using disk storage (has filename) or memory storage (has buffer)
        if (req.file.filename) {
            // Disk storage - local development
            const avatarPath = `/uploads/avatars/${req.file.filename}`;
            const result = await UserService.updateAvatar(userId, avatarPath);

            res.status(200).json({
                success: true,
                message: "Image uploaded successfully",
                data: result
            });
        } else if (req.file.buffer) {
            return res.status(501).json({
                success: false,
                message: "File uploads require cloud storage configuration in production. Please contact support."
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid file upload"
            });
        }
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: e.message || "Image upload failed"
        });
    }
}

const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        console.log("Update profile - userId:", userId);
        console.log("Update profile - body:", req.body);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const { name, phone } = req.body;

        // Only include defined fields
        const updateData: { name?: string; phone?: string } = {};
        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;

        const result = await UserService.updateUserById(userId, updateData);

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: result
        });
    } catch (e: any) {
        console.error("Update profile error:", e);
        res.status(400).json({
            success: false,
            message: e.message || "Profile update failed"
        });
    }
}

// Update role after social signup (only STUDENT -> TUTOR allowed)
const updateRole = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const currentRole = req.user?.role;
        const { role } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        // Only allow STUDENT to TUTOR transition
        if (currentRole !== "STUDENT" || role !== "TUTOR") {
            return res.status(400).json({
                success: false,
                message: "Invalid role update. Only Student to Tutor transition is allowed."
            });
        }

        // Update user role
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: "TUTOR" }
        });

        // Create tutor profile if it doesn't exist
        const existingProfile = await prisma.tutorProfile.findUnique({
            where: { userId }
        });

        if (!existingProfile) {
            await prisma.tutorProfile.create({
                data: {
                    userId,
                    bio: "",
                    hourlyRate: 0,
                    experience: 0,
                }
            });
        }

        res.status(200).json({
            success: true,
            message: "Role updated successfully",
            data: updatedUser
        });
    } catch (e: any) {
        console.error("Update role error:", e);
        res.status(400).json({
            success: false,
            message: e.message || "Role update failed"
        });
    }
}

export const UserController = {
    getUsers,
    updateUserById,
    uploadAvatar,
    updateProfile,
    updateRole
}