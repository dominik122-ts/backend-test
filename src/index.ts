import express from "express";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import reservations from "./routes/reservations";
import { logger } from "../lib/logger";

config({ path: [".env", ".env.local"] });

const app = express();
export const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/reservations", reservations);

app.listen(process.env.PORT, () =>
  logger.info("Server started on port 3000", { port: 3000 })
);
