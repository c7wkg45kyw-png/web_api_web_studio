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

// --- Swagger (robust path) ---
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import YAML from "yaml";
import swaggerUi from "swagger-ui-express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Swagger: safe path for Netlify & local ---
import fs from "fs";
import path from "path";
import YAML from "yaml";
import swaggerUi from "swagger-ui-express";

function resolveOpenapiPath() {
  // 1) บน Netlify Functions: process.cwd() จะเป็นโฟลเดอร์ฟังก์ชัน (/var/task)
  const p1 = path.resolve(process.cwd(), "openapi.yaml");
  if (fs.existsSync(p1)) return p1;

  // 2) เผื่อกรณีรัน local: โฟลเดอร์ root โปรเจกต์
  const p2 = path.resolve(process.cwd(), "./openapi.yaml");
  if (fs.existsSync(p2)) return p2;

  // 3) เผื่อโครงสร้างที่มี src/: ลองไล่ขึ้นไปอีกชั้น
  const p3 = path.resolve(process.cwd(), "../openapi.yaml");
  if (fs.existsSync(p3)) return p3;

  return null;
}

let swaggerDoc = { openapi: "3.0.3", info: { title: "API Docs", version: "1.0.0" }, paths: {} };
const openapiPath = resolveOpenapiPath();
if (openapiPath) {
  try {
    const yamlText = fs.readFileSync(openapiPath, "utf8");
    swaggerDoc = YAML.parse(yamlText);
    console.log("[Swagger] Loaded:", openapiPath);
  } catch (e) {
    console.error("[Swagger] Failed to read YAML:", openapiPath, e);
  }
} else {
  console.warn("[Swagger] openapi.yaml not found. Serving minimal doc.");
}

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDoc, { explorer: true }));
// --- /Swagger ---



app.use(notFound);
app.use(errorHandler);

export default app;
