import express, { Router } from 'express';
import { CategoriesController } from '../controllers/categories.controller';

const router = express.Router();

router.get(
    "/categories",
    CategoriesController.getCategories
)
router.get(
    "/categories/:id",
    CategoriesController.getCategoryById
)

export const categoriesRouter: Router = router;