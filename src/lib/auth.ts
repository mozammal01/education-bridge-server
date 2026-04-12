import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL || process.env.SERVER_URL,
  trustedOrigins: [
    process.env.APP_URL || "http://localhost:3000",
    "https://education-bridge-client.vercel.app",
    "http://localhost:3000",
  ].filter(Boolean) as string[],
  account: {
    accountLinking: {
      enabled: true,
    }
  },
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
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      scope: ["email", "public_profile"],
    },
  },

});
