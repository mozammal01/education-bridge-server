import { prisma } from "../../lib/prisma.js";

const getReviewsByTutor = async (tutorId: string) => {
    const tutorProfile = await prisma.tutorProfile.findFirst({
        where: {
            OR: [
                { id: tutorId },
                { userId: tutorId }
            ]
        }
    });

    if (!tutorProfile) {
        return [];
    }

    return await prisma.review.findMany({
        where: { tutorId: tutorProfile.id },
        include: {
            student: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });
};

const getPlatformReviews = async () => {
    return await prisma.review.findMany({
        where: { tutorId: null },
        include: {
            student: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        },
        orderBy: { createdAt: "desc" },
        take: 10
    });
};

const createReview = async (studentId: string, tutorId: string | null, rating: number, comment: string) => {
    if (!tutorId) {
        // Platform review
        return await prisma.review.create({
            data: {
                studentId,
                tutorId: null,
                rating,
                comment
            },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        });
    }

    const tutorProfile = await prisma.tutorProfile.findFirst({
        where: {
            OR: [
                { id: tutorId },
                { userId: tutorId }
            ]
        }
    });

    if (!tutorProfile) {
        throw new Error("Tutor not found");
    }

    const existingReview = await prisma.review.findFirst({
        where: {
            studentId,
            tutorId: tutorProfile.id
        }
    });

    if (existingReview) {
        throw new Error("You have already reviewed this tutor");
    }

    const review = await prisma.review.create({
        data: {
            studentId,
            tutorId: tutorProfile.id,
            rating,
            comment
        },
        include: {
            student: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        }
    });

    const allReviews = await prisma.review.findMany({
        where: { tutorId: tutorProfile.id }
    });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.tutorProfile.update({
        where: { id: tutorProfile.id },
        data: {
            averageRating: avgRating,
            totalReviews: allReviews.length
        }
    });

    return review;
};

export const ReviewsService = {
    getReviewsByTutor,
    getPlatformReviews,
    createReview
};
