import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";


const createBooking = async (studentId: string, tutorId: string, date: Date, startTime: string, endTime: string) => {
  return await prisma.booking.create({
    data: {
      studentId,
      tutorId,
      date,
      startTime,
      endTime
    }
  })
}

const getBookings = async (userId: string, userRole: UserRole) => {
  if (userRole === UserRole.ADMIN) {
    return await prisma.booking.findMany()
  } else {
    return await prisma.booking.findMany({
      where: {
        OR: [
          { studentId: userId },
          { tutorId: userId }
        ]
      }
    })
  }
}

const getBookingById = async (id: string) => {
  return await prisma.booking.findUnique({
    where: { id },
    include: {
    }
  })
}
export const BookingsService = {
  createBooking,
  getBookings,
  getBookingById
}