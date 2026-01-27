import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";
import { auth } from "../lib/auth";

async function seedAdmin() {
    try {
        console.log("***** Admin Seeding Started....")
        const adminData = {
            name: "Admin",
            email: "admin@gmail.com",
            role: UserRole.ADMIN,
            password: "admin123"
        }
        console.log("***** Checking Admin Exist or not")

        // User exist check
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        });

        if (existingUser) {
            throw new Error("User already exists!!");
        }

        // Use better-auth's server-side API to create user
        const createdUser = await auth.api.signUpEmail({
            body: {
                name: adminData.name,
                email: adminData.email,
                password: adminData.password
            }
        });

        console.log("Admin created:", createdUser);

        if (createdUser) {
            console.log("Admin created successfully")
            // Update role and email verification status
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    role: adminData.role,
                    emailVerified: true
                }
            })

            console.log("Role and email verification status updated!")
        }
        console.log("SUCCESS")

    } catch (error) {
        console.error(error);
    }
}

seedAdmin()