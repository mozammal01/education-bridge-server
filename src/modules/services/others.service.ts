import { prisma } from "../../lib/prisma";


const createTutorReview = async (studentId: string, tutorId: string, rating: number, comment: string) => {
    try {
        return await prisma.review.create({
            data: { studentId, tutorId, rating, comment }
        });
    }   
    catch (e: any) {
        throw new Error(e.message);
    }
}

export const OthersService = {
    createTutorReview
}