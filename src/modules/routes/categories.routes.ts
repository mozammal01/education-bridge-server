import express, { Router } from 'express';
import { CategoriesController } from '../controllers/categories.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();


router.post(
    "/categories",
    auth(UserRole.ADMIN),
    CategoriesController.createCategory
)

router.put(
    "/categories/:id",
    auth(UserRole.ADMIN),
    CategoriesController.updateCategoryById
)

router.delete(
    "/categories/:id",
    auth(UserRole.ADMIN),
    CategoriesController.deleteCategoryById
)

router.get(
    "/categories",
    CategoriesController.getCategories
)
router.get(
    "/categories/:id",
    CategoriesController.getCategoryById
)

export const categoriesRouter: Router = router;