import { ApplyAsTutorPayload, TutorFilterParams, UpdateTutorAvailabilityPayload, UpdateTutorProfilePayload } from "../../interfaces/interfaces";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";



const getTutors = async (filters: TutorFilterParams = {}) => {
    const {
        categoryId,
        minRating,
        maxRating,
        minPrice,
        maxPrice,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10
    } = filters;

    const where: Prisma.TutorProfileWhereInput = {};

    if (categoryId) {
        where.categoryId = categoryId;
    }

    if (minRating !== undefined || maxRating !== undefined) {
        where.averageRating = {};
        if (minRating !== undefined) {
            where.averageRating.gte = minRating;
        }
        if (maxRating !== undefined) {
            where.averageRating.lte = maxRating;
        }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        where.hourlyRate = {};
        if (minPrice !== undefined) {
            where.hourlyRate.gte = minPrice;
        }
        if (maxPrice !== undefined) {
            where.hourlyRate.lte = maxPrice;
        }
    }

    if (search) {
        where.user = {
            name: {
                contains: search,
                mode: 'insensitive'
            }
        };
    }

    let orderBy: Prisma.TutorProfileOrderByWithRelationInput = {};
    
    switch (sortBy) {
        case 'rating':
            orderBy = { averageRating: sortOrder };
            break;
        case 'price':
            orderBy = { hourlyRate: sortOrder };
            break;
        case 'experience':
            orderBy = { experience: sortOrder };
            break;
        default:
            orderBy = { createdAt: sortOrder };
    }

    const skip = (page - 1) * limit;

    const total = await prisma.tutorProfile.count({ where });

    const tutors = await prisma.tutorProfile.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true
                }
            },
            category: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

    return {
        tutors,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

const getTutorById = async (id: string) => {
    let tutor = await prisma.tutorProfile.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true
                }
            },
            category: {
                select: {
                    id: true,
                    name: true
                }
            },
            availability: true,
            reviews: {
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
            }
        }
    });

    if (!tutor) {
        tutor = await prisma.tutorProfile.findUnique({
            where: { userId: id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                availability: true,
                reviews: {
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
                }
            }
        });
    }

    return tutor;
}

const updateTutorProfile = async (id: string, payload: UpdateTutorProfilePayload) => {
    try {
        return await prisma.tutorProfile.update({
            where: { id },
            data: payload
        })
    } catch (e: any) {
        throw new Error(e.message);
    }
}

const updateTutorAvailability = async (id: string, payload: UpdateTutorAvailabilityPayload) => {
    try {
        return await prisma.tutorAvailability.update({
            where: { id },
            data: payload
        })
    } catch (e: any) {
        throw new Error(e.message);
    }
}



const applyAsTutor = async (payload: ApplyAsTutorPayload) => {
    const { userId, bio, hourlyRate, experience, categoryId } = payload;

    const existingProfile = await prisma.tutorProfile.findUnique({
        where: { userId }
    });

    if (existingProfile) {
        throw new Error("You already have a tutor profile!");
    }

    const category = await prisma.category.findUnique({
        where: { id: categoryId }
    });

    if (!category) {
        throw new Error("Category not found!");
    }

    const result = await prisma.$transaction(async (tx) => {
        const tutorProfile = await tx.tutorProfile.create({
            data: {
                userId,
                bio,
                hourlyRate,
                experience,
                categoryId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                category: true
            }
        });

        await tx.user.update({
            where: { id: userId },
            data: { role: "TUTOR" }
        });

        return tutorProfile;
    });

    return result;
}




export const TutorService = {
    getTutors,
    getTutorById,
    updateTutorProfile,
    updateTutorAvailability,
    applyAsTutor
}