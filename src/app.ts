import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();

app.use(cors());
app.use(express.json());

app.all('/api/auth/*splat', toNodeHandler(auth));

app.get("/", (req, res) => {
  res.send("Hello from Education Bridge Server");
});

export default app;