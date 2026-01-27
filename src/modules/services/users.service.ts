import { prisma } from "../../lib/prisma";



const getUsers = async () => {
    return await prisma.user.findMany({
        orderBy: { createdAt: "desc" }
    })
}

const getUserById = async (id: string) => {
    return await prisma.user.findUnique({
        where: { id }
    });
}



export const UserService = {
    getUsers,
    getUserById,
}