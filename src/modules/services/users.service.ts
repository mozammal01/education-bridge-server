import { UpdateUserPayload } from "../../interfaces/interfaces.js";
import { prisma } from "../../lib/prisma.js";
import fs from "fs";
import path from "path";


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


const updateAvatar = async (userId: string, avatarPath: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new Error("User not found");
        }

        if (user.image && user.image.startsWith("/uploads/")) {
            const oldAvatarPath = path.join(process.cwd(), user.image);
            if (fs.existsSync(oldAvatarPath)) {
                fs.unlinkSync(oldAvatarPath);
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { image: avatarPath },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
                emailVerified: true,
                createdAt: true
            }
        });

        return updatedUser;
    } catch (e: any) {
        throw new Error(e.message);
    }
}


export const UserService = {
    getUsers,
    updateUserById,
    updateAvatar,
}