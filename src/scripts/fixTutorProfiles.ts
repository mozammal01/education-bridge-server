import { prisma } from "../lib/prisma";

async function fixTutorProfiles() {
  console.log("Fixing Tutor Profiles...\n");

  try {
    const tutorsWithoutProfile = await prisma.user.findMany({
      where: {
        role: "TUTOR",
        tutorProfile: null
      }
    });

    console.log(`Found ${tutorsWithoutProfile.length} tutors without profiles\n`);

    if (tutorsWithoutProfile.length === 0) {
      console.log("All tutors already have profiles!");
      return;
    }

    for (const tutor of tutorsWithoutProfile) {
      try {
        await prisma.tutorProfile.create({
          data: {
            userId: tutor.id,
            bio: "",
            hourlyRate: 0,
            experience: 0,
          }
        });
        console.log(`Created profile for: ${tutor.name} (${tutor.email})`);
      } catch (error: any) {
        console.error(`Failed to create profile for ${tutor.email}:`, error.message);
      }
    }

    console.log("\nDone! Tutors should now appear in the listing.");

  } catch (error) {
    console.error("Script failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixTutorProfiles();
