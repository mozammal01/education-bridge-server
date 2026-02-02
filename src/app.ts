import express, { Application } from "express";
import cors from "cors";
import path from "path";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { notFound } from "./middlewares/notFound.js";
import errorHandler from "./middlewares/globalErrorHandler.js";
import { tutorRouter } from "./modules/routes/tutor.routes.js";
import { prisma } from "./lib/prisma.js";
import { categoriesRouter } from "./modules/routes/categories.routes.js";
import { bookingsRouter } from "./modules/routes/bookings.routes.js";
import { usersRouter } from "./modules/routes/users.routes.js";
import { othersRouter } from "./modules/routes/others.routes.js";
import { reviewsRouter } from "./modules/routes/reviews.routes.js";

const app: Application = express();

const allowedOrigins = [
  "https://education-bridge-client.vercel.app",
  "http://localhost:3000"
];

// CORS middleware - must run FIRST before anything else
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Check if origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    // Default to production frontend
    res.header("Access-Control-Allow-Origin", "https://education-bridge-client.vercel.app");
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin, Cookie");
  res.header("Access-Control-Expose-Headers", "set-cookie, Set-Cookie");
  res.header("Access-Control-Max-Age", "86400");

  // Handle preflight immediately - return 204 No Content
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

// Also use cors middleware as backup
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now to debug
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin", "Cookie"],
  exposedHeaders: ["set-cookie", "Set-Cookie"],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());

// Serve uploaded files as static assets
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/auth/me", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as any
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }


    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        image: true,
        emailVerified: true,
        createdAt: true
      }
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get user"
    });
  }
});

app.post("/api/auth/signout", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as any
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }

    // Revoke the session
    await auth.api.signOut({
      headers: req.headers as any
    });

    res.status(200).json({
      success: true,
      message: "Signed out successfully"
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to sign out"
    });
  }
});

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use("/api", usersRouter);
app.use("/api", tutorRouter);
app.use("/api", categoriesRouter);
app.use("/api", bookingsRouter);
app.use("/api", reviewsRouter);
app.use("/api", othersRouter);

app.get("/", (req, res) => {
  res.send("Hello from Education Bridge Server");
});
app.use(notFound)
app.use(errorHandler)


export default app;