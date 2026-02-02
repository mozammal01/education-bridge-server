import { prisma } from "../../lib/prisma.js";
import { UserRole } from "../../middlewares/auth.js";

const createBooking = async (studentId: string, tutorId: string, date: string, startTime: string, endTime: string) => {
  const bookingDate = new Date(date);

  if (isNaN(bookingDate.getTime())) {
    throw new Error("Invalid date format");
  }

  const tutor = await prisma.user.findUnique({
    where: { id: tutorId, role: "TUTOR" }
  });

  if (!tutor) {
    throw new Error("Tutor not found");
  }

  return await prisma.booking.create({
    data: {
      studentId,
      tutorId,
      date: bookingDate,
      startTime,
      endTime
    }
  });
}

const getBookings = async (userId: string, userRole: UserRole) => {
  const includeData = {
    student: {
      select: { id: true, name: true, email: true, image: true }
    },
    tutor: {
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        tutorProfile: {
          select: { id: true, hourlyRate: true }
        }
      }
    }
  };

  if (userRole === UserRole.ADMIN) {
    return await prisma.booking.findMany({
      include: includeData,
      orderBy: { createdAt: 'desc' }
    });
  } else {
    return await prisma.booking.findMany({
      where: {
        OR: [
          { studentId: userId },
          { tutorId: userId }
        ]
      },
      include: includeData,
      orderBy: { createdAt: 'desc' }
    });
  }
}

const getBookingById = async (id: string) => {
  return await prisma.booking.findUnique({
    where: { id },
    include: {
      student: {
        select: { id: true, name: true, email: true, image: true }
      },
      tutor: {
        select: { id: true, name: true, email: true, image: true }
      }
    }
  })
}

const updateBookingStatus = async (
  bookingId: string,
  userId: string,
  userRole: UserRole,
  status: 'COMPLETED' | 'CANCELLED'
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (userRole === UserRole.ADMIN) {
  } else if (userRole === UserRole.TUTOR && status === 'COMPLETED') {
    if (booking.tutorId !== userId) {
      throw new Error("You can only complete your own sessions");
    }
  } else if (userRole === UserRole.STUDENT && status === 'CANCELLED') {
    if (booking.studentId !== userId) {
      throw new Error("You can only cancel your own bookings");
    }
  } else {
    throw new Error("You don't have permission to perform this action");
  }

  if (booking.status !== 'CONFIRMED') {
    throw new Error(`Booking is already ${booking.status.toLowerCase()}`);
  }

  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status }
  });
}

export const BookingsService = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus
}
