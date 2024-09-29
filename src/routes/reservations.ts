import { Router } from "express";
import {
  createReservation,
  getReservations
} from "../controllers/reservations";

const router = Router();

router.get("/", getReservations).post("/", createReservation);

export default router;
