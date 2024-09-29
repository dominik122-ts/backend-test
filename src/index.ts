import express, { ErrorRequestHandler } from "express";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import users from "./routes/users";
import reservations from "./routes/reservations";

config({ path: [".env", ".env.local"] });

const app = express();
export const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", users);
app.use("/reservations", reservations);

app.listen(process.env.PORT, () => console.log("Server started on port 3000"));
