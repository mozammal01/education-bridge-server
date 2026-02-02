import { ApplyAsTutorPayload, TutorFilterParams, UpdateTutorAvailabilityPayload, UpdateTutorProfilePayload } from "../../interfaces/interfaces.js";
import { prisma } from "../../lib/prisma.js";
import { Prisma } from "@prisma/client";



const getTutors = async (filters: TutorFilterParams & { categorySlug?: string } = {}) => {
    const {
        categoryId,
        categorySlug,
        minRating,
        maxRating,
        minPrice,
        maxPrice,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 100
    } = filters;

    const where: Prisma.TutorProfileWhereInput = {};

    if (categoryId) {
        where.categoryId = categoryId;
    }

    if (categorySlug) {
        where.category = {
            slug: categorySlug
        };
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

    where.user = {
        status: "ACTIVE"
    };

    where.hourlyRate = {
        gt: 0
    };

    if (minPrice !== undefined || maxPrice !== undefined) {
        where.hourlyRate = {
            ...where.hourlyRate,
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice })
        };
    }

    if (search) {
        where.user = {
            ...where.user,
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

const getMyTutorProfile = async (userId: string) => {
    const profile = await prisma.tutorProfile.findUnique({
        where: { userId },
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
                    name: true,
                    slug: true
                }
            },
            availability: true
        }
    });

    return profile;
}

const updateTutorProfile = async (userId: string, payload: UpdateTutorProfilePayload) => {
    try {
        const data: any = {};
        if (payload.bio !== undefined) data.bio = payload.bio;
        if (payload.headline !== undefined) data.headline = payload.headline;
        if (payload.education !== undefined) data.education = payload.education;
        if (payload.hourlyRate !== undefined) data.hourlyRate = payload.hourlyRate;
        if (payload.experience !== undefined) data.experience = payload.experience;
        if (payload.subjects !== undefined) data.subjects = payload.subjects;
        if (payload.languages !== undefined) data.languages = payload.languages;
        if (payload.categoryId !== undefined && payload.categoryId !== "") {
            data.categoryId = payload.categoryId;
        }

        return await prisma.tutorProfile.update({
            where: { userId },
            data
        })
    } catch (e: any) {
        console.error("Update tutor profile error:", e);
        throw new Error(e.message);
    }
}

const updateTutorAvailability = async (userId: string, availabilityData: { dayOfWeek: number; startTime: string; endTime: string; isAvailable: boolean }[]) => {
    try {
        const tutorProfile = await prisma.tutorProfile.findUnique({
            where: { userId }
        });

        if (!tutorProfile) {
            throw new Error("Tutor profile not found");
        }

        await prisma.tutorAvailability.deleteMany({
            where: { tutorId: tutorProfile.id }
        });

        if (availabilityData.length > 0) {
            await prisma.tutorAvailability.createMany({
                data: availabilityData.map(slot => ({
                    tutorId: tutorProfile.id,
                    dayOfWeek: slot.dayOfWeek,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    isAvailable: slot.isAvailable
                }))
            });
        }

        return await prisma.tutorAvailability.findMany({
            where: { tutorId: tutorProfile.id }
        });
    } catch (e: any) {
        throw new Error(e.message);
    }
}

const getTutorAvailability = async (userId: string) => {
    try {
        const tutorProfile = await prisma.tutorProfile.findUnique({
            where: { userId }
        });

        if (!tutorProfile) {
            return [];
        }

        return await prisma.tutorAvailability.findMany({
            where: { tutorId: tutorProfile.id }
        });
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
    getMyTutorProfile,
    updateTutorProfile,
    updateTutorAvailability,
    getTutorAvailability,
    applyAsTutor
}