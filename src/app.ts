import express, { Application } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { notFound } from "./middlewares/notFound";
import errorHandler from "./middlewares/globalErrorHandler";
import { tutorRouter } from "./modules/routes/tutor.routes";
import { prisma } from "./lib/prisma";
import { categoriesRouter } from "./modules/routes/categories.routes";
import { bookingsRouter } from "./modules/routes/bookings.routes";
import { usersRouter } from "./modules/routes/users.routes";
import { othersRouter } from "./modules/routes/others.routes";

const app: Application = express();

app.use(cors({
  origin: process.env.APP_URL || "http://localhost:4000", // client side url
  credentials: true
}))

app.use(express.json());

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

    // Get user with role from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
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

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use("/api", usersRouter);
app.use("/api", tutorRouter);
app.use("/api", categoriesRouter);
app.use("/api", bookingsRouter);
app.use("/api", othersRouter);

app.get("/", (req, res) => {
  res.send("Hello from Education Bridge Server");
});
app.use(notFound)
app.use(errorHandler)


export default app;