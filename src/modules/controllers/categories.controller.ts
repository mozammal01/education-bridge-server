import { Request, Response } from "express";
import { CategoriesService } from "../services/categories.service";


const getCategories = async (req: Request, res: Response) => {
    try {
        const result = await CategoriesService.getCategories()
        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: result
        })
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: "Categories fetched failed",
            error: e.message
        })
    }
}

const getCategoryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await CategoriesService.getCategoryById(id as string)
        res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            data: result
        })
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: "Category fetched failed",
            error: e.message
        })
    }
}

export const CategoriesController = {
    getCategories,
    getCategoryById,
}