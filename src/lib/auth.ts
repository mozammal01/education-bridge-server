import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.SERVER_URL || "http://localhost:5000",
  trustedOrigins: [process.env.APP_URL || "https://education-bridge-client.vercel.app"],
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "STUDENT",
        input: true
      }
    }
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (user.role === "TUTOR") {
            try {
              await prisma.tutorProfile.create({
                data: {
                  userId: user.id,
                  bio: "",
                  hourlyRate: 0,
                  experience: 0,
                }
              });
            } catch (error) {
              console.error("Failed to create tutor profile:", error);
            }
          }
        }
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5
    }
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
    crossSubDomainCookies: {
      enabled: false,
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: `${process.env.SERVER_URL || "http://localhost:5000"}/api/auth/callback/google`,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      redirectURI: `${process.env.SERVER_URL || "http://localhost:5000"}/api/auth/callback/github`,
    },
  },

});
