import { Role, UserStatus } from "@prisma/client";

export interface ApplyAsTutorPayload {
  userId: string;
  bio: string;
  hourlyRate: number;
  experience: number;
  categoryId: string;
}
export interface UpdateTutorProfilePayload {
  bio?: string;
  headline?: string;
  education?: string;
  hourlyRate?: number;
  experience?: number;
  subjects?: string[];
  languages?: string[];
  categoryId?: string;
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
  phone?: string;
  role?: Role;
  status?: UserStatus;
}

export interface TutorFilterParams {
  categoryId?: string;
  minRating?: number;
  maxRating?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'rating' | 'price' | 'experience';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UpdateStudentProfilePayload {
  name?: string;
  email?: string;
  image?: string;
}