import { prisma } from "../../lib/prisma";


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

  const getBookings = async () => {
    return await prisma.booking.findMany()
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