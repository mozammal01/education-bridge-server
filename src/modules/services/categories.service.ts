import { prisma } from "../../lib/prisma";


const createCategory = async (name: string) => {

    return await prisma.category.create({
        data: { name, slug: name.toLowerCase().replace(/ /g, '-') }
    })

}

const updateCategoryById = async (id: string, name: string) => {
    return await prisma.category.update({
        where: { id },
        data: { name, slug: name.toLowerCase().replace(/ /g, '-') }
    })
}

const deleteCategoryById = async (id: string) => {
    return await prisma.category.delete({
        where: { id }
    })
}

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
    createCategory,
    updateCategoryById,
    deleteCategoryById,
    getCategories,
    getCategoryById
}