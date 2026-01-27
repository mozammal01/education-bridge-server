import { ApplyAsTutorPayload, UpdateTutorAvailabilityPayload, UpdateTutorProfilePayload } from "../../interfaces/interfaces";
import { prisma } from "../../lib/prisma";



const getTutors = async () => {
    return await prisma.tutorProfile.findMany({
        orderBy: { createdAt: "desc" },
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
    })
}

const getTutorById = async (id: string) => {
    // First try to find by tutorProfile.id, then by userId
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

    // If not found by tutorProfile.id, try finding by userId
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

    // Check if user already has a tutor profile
    const existingProfile = await prisma.tutorProfile.findUnique({
        where: { userId }
    });

    if (existingProfile) {
        throw new Error("You already have a tutor profile!");
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
        where: { id: categoryId }
    });

    if (!category) {
        throw new Error("Category not found!");
    }

    // Create tutor profile and update user role in a transaction
    const result = await prisma.$transaction(async (tx) => {
        // Create the tutor profile
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

        // Update user role to TUTOR
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