import { Router } from "express";
import { getReservations } from "../controllers/reservations";

const router = Router();

router.get("/", getReservations);

export default router;
