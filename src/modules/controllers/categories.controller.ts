import { Request, Response } from "express";
import { CategoriesService } from "../services/categories.service";

const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body
        const result = await CategoriesService.createCategory(name)
        res.status(200).json({
            success: true,
            message: "Category created successfully",
            data: result
        })
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: "Category created failed",
            error: e.message
        })
    }
}


const updateCategoryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { name } = req.body
        const result = await CategoriesService.updateCategoryById(id as string, name)
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: result
        })
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: "Category updated failed",
            error: e.message
        })
    }
}

const deleteCategoryById = async (req: Request, res: Response) => {

    try {
        const { id } = req.params
        const result = await CategoriesService.deleteCategoryById(id as string)
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: result
        })
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: "Category deleted failed",
            error: e.message
        })
    }
}

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
    createCategory,
    updateCategoryById,
    deleteCategoryById,
    getCategories,
    getCategoryById
}