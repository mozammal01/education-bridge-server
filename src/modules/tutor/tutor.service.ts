import { prisma } from "../../lib/prisma";
  const getTutorById = async (id: string) => {
    return await prisma.tutorProfile.findUnique({
        where: {
            id
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })
}

const getTutorByUserId = async (userId: string) => {
    return await prisma.tutorProfile.findMany({
        where: {
            userId
        },
        orderBy: { createdAt: "desc" },
        include: {
            category: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })
}


export const TutorService = {
    getTutorById,
    getTutorByUserId,
}