import { UpdateStudentProfilePayload } from "../../interfaces/interfaces";
import { prisma } from "../../lib/prisma";


const createTutorReview = async (studentId: string, tutorId: string, rating: number, comment: string) => {
    const result = await prisma.$transaction(async (tx) => {
        const review = await tx.review.create({
            data: { studentId, tutorId, rating, comment }
        });

        const stats = await tx.review.aggregate({
            where: { tutorId },
            _avg: { rating: true },
            _count: { rating: true }
        });

        await tx.tutorProfile.update({
            where: { id: tutorId },
            data: {
                averageRating: Math.round((stats._avg.rating || 0) * 10) / 10,
                totalReviews: stats._count.rating
            }
        });

        return review;
    });

    return result;
}

const updateStudentProfile = async (userId: string, payload: UpdateStudentProfilePayload) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    if (!user) {
        throw new Error("User not found");
    }
    return await prisma.user.update({
        where: { id: userId },
        data: payload
    });
}

const getTutorReviews = async () => {
    return await prisma.review.findMany({
        include: {
            student: true,
            tutor: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

const getTutorReviewsByTutorId = async (tutorId: string) => {
    return await prisma.review.findMany({
        where: { tutorId },
        include: {
            student: true,
            tutor: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}
export const OthersService = {
    createTutorReview,
    updateStudentProfile,
    getTutorReviews,
    getTutorReviewsByTutorId
}