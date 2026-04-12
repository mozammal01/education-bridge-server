import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";

const CATEGORIES = [
  { name: "Mathematics", slug: "mathematics" },
  { name: "Science", slug: "science" },
  { name: "Languages", slug: "languages" },
  { name: "Programming", slug: "programming" },
  { name: "Music", slug: "music" },
  { name: "Business", slug: "business" },
  { name: "Arts & Design", slug: "arts-design" },
  { name: "Test Prep", slug: "test-prep" },
];

const TUTOR_USERS = [
  { name: "Dr. Ayesha Rahman", email: "ayesha@skillbridge.com", password: "password123" },
  { name: "Mohammad Karim", email: "karim@skillbridge.com", password: "password123" },
  { name: "Fatima Ahmed", email: "fatima@skillbridge.com", password: "password123" },
  { name: "Rafiq Hasan", email: "rafiq@skillbridge.com", password: "password123" },
  { name: "Nadia Islam", email: "nadia@skillbridge.com", password: "password123" },
  { name: "Tanvir Alam", email: "tanvir@skillbridge.com", password: "password123" },
  { name: "Dr. Sharmin Sultana", email: "sharmin@skillbridge.com", password: "password123" },
  { name: "Arif Mahmud", email: "arif@skillbridge.com", password: "password123" },
  { name: "Rumana Akter", email: "rumana@skillbridge.com", password: "password123" },
  { name: "Saiful Islam", email: "saiful@skillbridge.com", password: "password123" },
  { name: "Tahmina Rahman", email: "tahmina@skillbridge.com", password: "password123" },
  { name: "Jubayer Ahmed", email: "jubayer@skillbridge.com", password: "password123" },
];

const STUDENT_USERS = [
  { name: "Sadia Khan", email: "sadia@example.com", password: "password123" },
  { name: "Imran Hossain", email: "imran@example.com", password: "password123" },
];

const TUTOR_PROFILES = [
  { bio: "Ph.D. in Mathematics with 12+ years of teaching experience. University lecturer specializing in making complex mathematical concepts simple.", hourlyRate: 800, experience: 12, categorySlug: "mathematics" },
  { bio: "Senior software engineer with 9 years of industry experience. Full-stack & mobile development expert.", hourlyRate: 1200, experience: 9, categorySlug: "programming" },
  { bio: "IELTS Expert with British Council certification. Band 8.5 achiever helping students achieve target scores.", hourlyRate: 700, experience: 7, categorySlug: "languages" },
  { bio: "Physics & Chemistry specialist with 8 years experience in medical & engineering exam preparation.", hourlyRate: 900, experience: 8, categorySlug: "science" },
  { bio: "UI/UX Designer and Adobe Certified instructor with 6 years of industry experience.", hourlyRate: 850, experience: 6, categorySlug: "arts-design" },
  { bio: "MBA graduate with 10 years experience in business consulting and finance. Startup mentor.", hourlyRate: 1000, experience: 10, categorySlug: "business" },
  { bio: "MBBS doctor and experienced biology teacher with over 15 years of teaching experience.", hourlyRate: 950, experience: 15, categorySlug: "science" },
  { bio: "Senior data scientist with 7 years experience. Google certified in Data Engineering and TensorFlow.", hourlyRate: 1500, experience: 7, categorySlug: "programming" },
  { bio: "Al-Azhar University graduate. Hafiza teaching Arabic language and Quran for 10 years.", hourlyRate: 500, experience: 10, categorySlug: "languages" },
  { bio: "Professional guitarist with Berklee Online Certificate. 8 years teaching experience.", hourlyRate: 600, experience: 8, categorySlug: "music" },
  { bio: "GRE & SAT Expert with personal score of 332. 6 years experience in test prep.", hourlyRate: 1100, experience: 6, categorySlug: "test-prep" },
  { bio: "Digital Marketing expert. Google & Meta Certified with 5 years agency experience.", hourlyRate: 900, experience: 5, categorySlug: "business" },
];

const TUTOR_AVAILABILITY: { [key: number]: { dayOfWeek: number; startTime: string; endTime: string }[] } = {
  0: [
    { dayOfWeek: 0, startTime: "10:00", endTime: "12:00" },
    { dayOfWeek: 1, startTime: "09:00", endTime: "12:00" },
    { dayOfWeek: 1, startTime: "16:00", endTime: "20:00" },
    { dayOfWeek: 2, startTime: "09:00", endTime: "12:00" },
    { dayOfWeek: 3, startTime: "16:00", endTime: "20:00" },
    { dayOfWeek: 4, startTime: "09:00", endTime: "12:00" },
    { dayOfWeek: 5, startTime: "10:00", endTime: "14:00" },
    { dayOfWeek: 6, startTime: "10:00", endTime: "18:00" },
  ],
  1: [
    { dayOfWeek: 1, startTime: "18:00", endTime: "22:00" },
    { dayOfWeek: 2, startTime: "18:00", endTime: "22:00" },
    { dayOfWeek: 3, startTime: "18:00", endTime: "22:00" },
    { dayOfWeek: 4, startTime: "18:00", endTime: "22:00" },
    { dayOfWeek: 5, startTime: "15:00", endTime: "22:00" },
    { dayOfWeek: 6, startTime: "10:00", endTime: "20:00" },
  ],
  2: [
    { dayOfWeek: 0, startTime: "09:00", endTime: "13:00" },
    { dayOfWeek: 1, startTime: "08:00", endTime: "12:00" },
    { dayOfWeek: 2, startTime: "08:00", endTime: "12:00" },
    { dayOfWeek: 2, startTime: "17:00", endTime: "21:00" },
    { dayOfWeek: 3, startTime: "08:00", endTime: "12:00" },
    { dayOfWeek: 4, startTime: "17:00", endTime: "21:00" },
    { dayOfWeek: 5, startTime: "08:00", endTime: "14:00" },
  ],
  3: [
    { dayOfWeek: 0, startTime: "16:00", endTime: "20:00" },
    { dayOfWeek: 1, startTime: "16:00", endTime: "21:00" },
    { dayOfWeek: 2, startTime: "16:00", endTime: "21:00" },
    { dayOfWeek: 3, startTime: "16:00", endTime: "21:00" },
    { dayOfWeek: 4, startTime: "16:00", endTime: "21:00" },
    { dayOfWeek: 5, startTime: "10:00", endTime: "20:00" },
    { dayOfWeek: 6, startTime: "10:00", endTime: "20:00" },
  ],
  4: [
    { dayOfWeek: 0, startTime: "11:00", endTime: "17:00" },
    { dayOfWeek: 1, startTime: "19:00", endTime: "22:00" },
    { dayOfWeek: 2, startTime: "19:00", endTime: "22:00" },
    { dayOfWeek: 4, startTime: "19:00", endTime: "22:00" },
    { dayOfWeek: 5, startTime: "14:00", endTime: "20:00" },
    { dayOfWeek: 6, startTime: "11:00", endTime: "19:00" },
  ],
  5: [
    { dayOfWeek: 1, startTime: "20:00", endTime: "23:00" },
    { dayOfWeek: 2, startTime: "20:00", endTime: "23:00" },
    { dayOfWeek: 3, startTime: "20:00", endTime: "23:00" },
    { dayOfWeek: 5, startTime: "16:00", endTime: "22:00" },
    { dayOfWeek: 6, startTime: "10:00", endTime: "18:00" },
  ],
  6: [
    { dayOfWeek: 0, startTime: "10:00", endTime: "14:00" },
    { dayOfWeek: 1, startTime: "17:00", endTime: "21:00" },
    { dayOfWeek: 3, startTime: "17:00", endTime: "21:00" },
    { dayOfWeek: 5, startTime: "10:00", endTime: "18:00" },
    { dayOfWeek: 6, startTime: "10:00", endTime: "18:00" },
  ],
  7: [
    { dayOfWeek: 0, startTime: "14:00", endTime: "20:00" },
    { dayOfWeek: 2, startTime: "19:00", endTime: "23:00" },
    { dayOfWeek: 4, startTime: "19:00", endTime: "23:00" },
    { dayOfWeek: 5, startTime: "18:00", endTime: "23:00" },
    { dayOfWeek: 6, startTime: "10:00", endTime: "20:00" },
  ],
  8: [
    { dayOfWeek: 0, startTime: "06:00", endTime: "09:00" },
    { dayOfWeek: 0, startTime: "17:00", endTime: "21:00" },
    { dayOfWeek: 1, startTime: "06:00", endTime: "08:00" },
    { dayOfWeek: 2, startTime: "06:00", endTime: "08:00" },
    { dayOfWeek: 3, startTime: "06:00", endTime: "08:00" },
    { dayOfWeek: 4, startTime: "06:00", endTime: "08:00" },
    { dayOfWeek: 5, startTime: "06:00", endTime: "12:00" },
    { dayOfWeek: 6, startTime: "06:00", endTime: "12:00" },
  ],
  9: [
    { dayOfWeek: 0, startTime: "15:00", endTime: "21:00" },
    { dayOfWeek: 1, startTime: "17:00", endTime: "21:00" },
    { dayOfWeek: 2, startTime: "17:00", endTime: "21:00" },
    { dayOfWeek: 3, startTime: "17:00", endTime: "21:00" },
    { dayOfWeek: 5, startTime: "14:00", endTime: "22:00" },
    { dayOfWeek: 6, startTime: "14:00", endTime: "22:00" },
  ],
  10: [
    { dayOfWeek: 0, startTime: "20:00", endTime: "23:00" },
    { dayOfWeek: 1, startTime: "20:00", endTime: "23:00" },
    { dayOfWeek: 2, startTime: "20:00", endTime: "23:00" },
    { dayOfWeek: 3, startTime: "20:00", endTime: "23:00" },
    { dayOfWeek: 5, startTime: "18:00", endTime: "23:00" },
    { dayOfWeek: 6, startTime: "10:00", endTime: "18:00" },
  ],
  11: [
    { dayOfWeek: 0, startTime: "11:00", endTime: "17:00" },
    { dayOfWeek: 2, startTime: "19:00", endTime: "22:00" },
    { dayOfWeek: 4, startTime: "19:00", endTime: "22:00" },
    { dayOfWeek: 5, startTime: "15:00", endTime: "21:00" },
    { dayOfWeek: 6, startTime: "11:00", endTime: "19:00" },
  ],
};

async function createUser(userData: { name: string; email: string; password: string }, role: "TUTOR" | "STUDENT") {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      console.log(`User ${userData.email} already exists, skipping...`);
      return existingUser;
    }

    const createdUser = await auth.api.signUpEmail({
      body: {
        name: userData.name,
        email: userData.email,
        password: userData.password
      }
    });

    if (createdUser) {
      const updatedUser = await prisma.user.update({
        where: { email: userData.email },
        data: {
          role: role,
          emailVerified: true
        }
      });
      console.log(`Created ${role}: ${userData.name}`);
      return updatedUser;
    }
  } catch (error: any) {
    console.error(`Error creating user ${userData.email}:`, error.message);
  }
  return null;
}

async function seed() {
  console.log("Starting seed...\n");

  try {
    console.log("Seeding Categories...");
    for (const category of CATEGORIES) {
      const existing = await prisma.category.findUnique({
        where: { slug: category.slug }
      });

      if (!existing) {
        await prisma.category.create({ data: category });
        console.log(`  Created category: ${category.name}`);
      } else {
        console.log(`  Category ${category.name} already exists, skipping...`);
      }
    }
    console.log("Categories seeded!\n");

    console.log("Seeding Tutor Users...");
    const createdTutors: any[] = [];
    for (const tutorData of TUTOR_USERS) {
      const user = await createUser(tutorData, "TUTOR");
      createdTutors.push(user);
    }
    console.log("Tutor Users seeded!\n");

    console.log("Seeding Student Users...");
    const createdStudents: any[] = [];
    for (const studentData of STUDENT_USERS) {
      const user = await createUser(studentData, "STUDENT");
      createdStudents.push(user);
    }
    console.log("Student Users seeded!\n");

    console.log("Seeding Tutor Profiles...");
    const createdProfiles: any[] = [];
    for (let i = 0; i < TUTOR_PROFILES.length; i++) {
      const tutor = createdTutors[i];
      const profileData = TUTOR_PROFILES[i];

      if (!tutor || !profileData) continue;

      const category = await prisma.category.findUnique({
        where: { slug: profileData.categorySlug }
      });

      if (!category) {
        console.log(`  Category ${profileData.categorySlug} not found, skipping profile...`);
        continue;
      }

      const existingProfile = await prisma.tutorProfile.findUnique({
        where: { userId: tutor.id }
      });

      if (existingProfile) {
        console.log(`  Profile for ${tutor.name} already exists, skipping...`);
        createdProfiles.push(existingProfile);
        continue;
      }

      const profile = await prisma.tutorProfile.create({
        data: {
          userId: tutor.id,
          bio: profileData.bio,
          hourlyRate: profileData.hourlyRate,
          experience: profileData.experience,
          categoryId: category.id
        }
      });
      createdProfiles.push(profile);
      console.log(`  Created profile for: ${tutor.name}`);
    }
    console.log("Tutor Profiles seeded!\n");

    console.log("Seeding Tutor Availability...");
    for (let i = 0; i < createdProfiles.length; i++) {
      const profile = createdProfiles[i];
      if (!profile) continue;

      const availabilitySlots = TUTOR_AVAILABILITY[i];
      if (!availabilitySlots) continue;

      const existingAvailability = await prisma.tutorAvailability.findFirst({
        where: { tutorId: profile.id }
      });

      if (existingAvailability) {
        console.log(`  Availability for tutor ${i + 1} already exists, skipping...`);
        continue;
      }

      for (const slot of availabilitySlots) {
        await prisma.tutorAvailability.create({
          data: {
            tutorId: profile.id,
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isAvailable: true
          }
        });
      }
      console.log(`  Created availability for tutor ${i + 1}`);
    }
    console.log("Tutor Availability seeded!\n");

    console.log("Seeding Realistic Bookings...");
    const statuses = ["COMPLETED", "CONFIRMED", "CANCELLED"] as const;
    const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
    
    // Generate 50 bookings
    for (let i = 0; i < 50; i++) {
      const student = createdStudents[Math.floor(Math.random() * createdStudents.length)];
      const tutor = createdTutors[Math.floor(Math.random() * createdTutors.length)];
      
      if (!student || !tutor) continue;

      // Random date in the last 90 days
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 90));
      
      const startTime = timeSlots[Math.floor(Math.random() * timeSlots.length)] as string;
      const endTime = `${(parseInt(startTime.split(':')[0]!) + 1).toString().padStart(2, '0')}:00`;

      await prisma.booking.create({
        data: {
          studentId: student.id,
          tutorId: tutor.id,
          date,
          startTime,
          endTime,
          status: statuses[Math.floor(Math.random() * statuses.length)] as "COMPLETED" | "CONFIRMED" | "CANCELLED",
        }
      });
    }
    console.log("Realistic Bookings seeded!\n");

    console.log("Seeding Realistic Reviews...");
    const tutorComments = [
      "Excellent teacher!", "Highly recommend.", "Great experience.", 
      "Very patient and helpful.", "Best tutor I've had.", "Truly expert knowledge.",
      "Helped me score higher.", "Amazing teaching style.", "Very professional."
    ];

    const platformComments = [
      "EduBridge is the best platform I've used for finding tutors. Very easy to use!",
      "I love how I can find experts for almost any subject here. Highly recommended.",
      "The virtual classroom feature is a game-changer. Learning is so much smoother now.",
      "Great experience finding a math tutor for my son. The process was seamless.",
      "Finally a platform that actually verifies their tutors. Feels very safe and professional.",
      "The customer support team helped me find the perfect match when I was stuck. 5 stars!"
    ];

    for (const profile of createdProfiles) {
      if (!profile) continue;
      
      const numReviews = Math.floor(Math.random() * 3) + 2; // 2 to 4 reviews per tutor
      for (let j = 0; j < numReviews; j++) {
        const student = createdStudents[Math.floor(Math.random() * createdStudents.length)];
        if (!student) continue;

        const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars

        await prisma.review.create({
          data: {
            studentId: student.id,
            tutorId: profile.id,
            rating,
            comment: (tutorComments[Math.floor(Math.random() * tutorComments.length)]) as string
          }
        });
      }

      // Update aggregate ratings
      const tutorReviews = await prisma.review.findMany({
        where: { tutorId: profile.id }
      });
      const avgRating = tutorReviews.reduce((sum, r) => sum + r.rating, 0) / tutorReviews.length;

      await prisma.tutorProfile.update({
        where: { id: profile.id },
        data: {
          averageRating: avgRating,
          totalReviews: tutorReviews.length
        }
      });
    }

    console.log("Seeding Platform Reviews...");
    for (let i = 0; i < platformComments.length; i++) {
        const student = createdStudents[Math.floor(Math.random() * createdStudents.length)];
        if (!student) continue;

        await prisma.review.create({
            data: {
                studentId: student.id,
                tutorId: null,
                rating: 5,
                comment: platformComments[i] as string
            }
        });
    }
    console.log("Platform Reviews seeded!\n");


    console.log("Seed completed successfully!");

  } catch (error) {
    console.error("Seed failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
