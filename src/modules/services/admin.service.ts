import { prisma } from "../../lib/prisma.js";

const getStats = async () => {
    const [totalUsers, totalStudents, totalTutors, totalBookings, totalReviews] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: "STUDENT" } }),
        prisma.user.count({ where: { role: "TUTOR" } }),
        prisma.booking.count(),
        prisma.review.count()
    ]);

    // Calculate revenue from completed bookings
    const completedBookings = await prisma.booking.findMany({
        where: { status: "COMPLETED" },
        include: {
            tutor: {
                include: {
                    tutorProfile: {
                        select: { hourlyRate: true }
                    }
                }
            }
        }
    });

    const totalRevenue = completedBookings.reduce((acc, booking) => {
        const rate = booking.tutor?.tutorProfile?.hourlyRate || 0;
        // Simple 1 hour calculation if duration logic is missing, 
        // but let's try to parse time if possible.
        // For now, let's assume 1 hour per session or fixed rate for simplicity in this MVP
        return acc + rate;
    }, 0);

    return {
        totalUsers,
        totalStudents,
        totalTutors,
        totalBookings,
        totalRevenue,
        totalReviews
    };
}

const getRecentPayments = async () => {
    const completedBookings = await prisma.booking.findMany({
        where: { status: "COMPLETED" },
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
            student: {
                select: { id: true, name: true, image: true }
            },
            tutor: {
                select: {
                    id: true,
                    name: true,
                    tutorProfile: { select: { hourlyRate: true } }
                }
            }
        }
    });

    return completedBookings.map(booking => ({
        id: `TX-${booking.id.slice(-4).toUpperCase()}`,
        bookingId: booking.id,
        user: booking.student.name,
        amount: booking.tutor.tutorProfile?.hourlyRate || 0,
        status: "SUCCESS",
        date: booking.date,
        method: "Online Payment"
    }));
}

export const AdminService = {
    getStats,
    getRecentPayments
}
