import { UpdateUserPayload } from "../../interfaces/interfaces";
import { prisma } from "../../lib/prisma";



const getUsers = async () => {
    return await prisma.user.findMany({
        orderBy: { createdAt: "desc" }
    })
}



const updateUserById = async (id: string, payload: UpdateUserPayload) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        })
        if (!user) {
            throw new Error("User not found");
        }
        return await prisma.user.update({
        where: { id },
        data: payload
    })
    } catch (e: any) {
        throw new Error(e.message);
    }
}



export const UserService = {
    getUsers,
    updateUserById,
}