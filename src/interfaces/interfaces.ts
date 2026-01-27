import { Role, UserStatus } from "../../generated/prisma/client";

export interface ApplyAsTutorPayload {
  userId: string;
  bio: string;
  hourlyRate: number;
  experience: number;
  categoryId: string;
}
export interface UpdateTutorProfilePayload {
  bio: string;
  hourlyRate: number;
  experience: number;
  categoryId: string;
}

export interface UpdateTutorAvailabilityPayload {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}


export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: Role;
  status?: UserStatus;
}