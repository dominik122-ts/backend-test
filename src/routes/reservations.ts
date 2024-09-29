import { Router } from "express";
import {
  createReservation,
  getReservations
} from "../controllers/reservations";
import { validateReservation } from "../validations/reservations";

const router = Router();

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Retrieve a list of reservations
 *     description: Fetch reservations based on the provided date range or all reservations if no date range is specified.
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start of the date range
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End of the date range
 *     responses:
 *       200:
 *         description: A list of reservations with metadata
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationsResponse'
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The name of the user making the reservation
 *               userEmail:
 *                 type: string
 *                 format: email
 *                 description: The email of the user making the reservation
 *               tableId:
 *                 type: integer
 *                 description: ID of the reserved table
 *               dateTime:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time of the reservation
 *               duration:
 *                 type: integer
 *                 description: Duration of the reservation in minutes
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationResponse'
 */

router
  .get("/", getReservations)
  .post("/", validateReservation, createReservation);

export default router;
