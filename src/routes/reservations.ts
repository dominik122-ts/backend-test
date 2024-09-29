import { Router } from "express";
import {
  createReservation,
  getReservations
} from "../controllers/reservations";
import { validateReservation } from "../validations/reservations";

const router = Router();

router
  .get("/", getReservations)
  .post("/", validateReservation, createReservation);

export default router;
