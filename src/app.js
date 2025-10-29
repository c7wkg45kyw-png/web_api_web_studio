// src/app.js
import "dotenv/config.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRouter from "./routes/auth/index.js";
import customersRouter from "./routes/customers/index.js";
import usersRouter from "./routes/users/index.js";

import { notFound } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "node-api", env: process.env.NODE_ENV, time: new Date().toISOString() });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/customers", customersRouter);
app.use("/api/v1/users", usersRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
