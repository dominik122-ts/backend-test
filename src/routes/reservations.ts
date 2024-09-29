import { Router } from "express";
import {
  createReservation,
  deleteReservation,
  editReservation,
  getReservation,
  getReservations
} from "../controllers/reservations";
import {
  validateCreateReservation,
  validateEditReservation
} from "../validations/reservations";

const router = Router();

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Retrieve a list of reservations
 *     tags: [Reservation]
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

/**
 * @swagger
 * /reservations/{id}:
 *   patch:
 *     summary: Update a reservation by ID
 *     tags: [Reservation]
 *     description: Updates an existing reservation by its ID and returns the updated reservation.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the reservation to update.
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
 *       200:
 *         description: The updated reservation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reservation not found.
 *       500:
 *         description: Server error.
 *   delete:
 *     summary: Delete a reservation by ID
 *     tags: [Reservation]
 *     description: Deletes a reservation by its ID and returns the deleted reservation.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the reservation to delete.
 *     responses:
 *       200:
 *         description: The deleted reservation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reservation not found.
 *       500:
 *         description: Server error.
 *   get:
 *     summary: Get a reservation by ID
 *     tags: [Reservation]
 *     description: Fetches a reservation by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the reservation to fetch.
 *     responses:
 *       200:
 *         description: The fetched reservation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reservation not found.
 *       500:
 *         description: Server error.
 */

router
  .get("/", getReservations)
  .post("/", validateCreateReservation, createReservation)
  .get("/:id", getReservation)
  .patch("/:id", validateEditReservation, editReservation)
  .delete("/:id", deleteReservation);

export default router;
