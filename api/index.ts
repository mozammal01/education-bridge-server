import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app.js";

const allowedOrigin = "https://education-bridge-client.vercel.app";

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers for ALL requests
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin, Cookie");
  res.setHeader("Access-Control-Expose-Headers", "Set-Cookie");
  res.setHeader("Access-Control-Max-Age", "86400");

  // Handle preflight OPTIONS request immediately
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Pass to Express app for other requests
  return app(req, res);
}
