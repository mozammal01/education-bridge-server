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

const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await UserService.getUserById(id as string)

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



export const UserController = {
    getUsers,
    getUserById,
}