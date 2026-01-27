import express, { Application, Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { notFound } from "./middlewares/notFound";
import errorHandler from "./middlewares/globalErrorHandler";
import { tutorRouter } from "./modules/tutor/tutor.routes";

const app: Application = express();

app.use(cors({
  origin: process.env.APP_URL || "http://localhost:4000", // client side url
  credentials: true
}))

app.use(express.json());

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use("/api", tutorRouter);

app.get("/", (req, res) => {
  res.send("Hello from Education Bridge Server");
});
app.use(notFound)
app.use(errorHandler)


export default app;