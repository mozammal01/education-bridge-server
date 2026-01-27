import { prisma } from "../../lib/prisma";

const getCategoryById = async (id: string) => {
    return await prisma.category.findUnique({
        where: { id },
        include: {
        }
    })
}

const getCategories = async () => {
    return await prisma.category.findMany()
}

export const CategoriesService = {
    getCategories,
    getCategoryById
}