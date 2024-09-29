import asyncHandler from "express-async-handler";
import { prisma } from "..";

export const getReservations = asyncHandler(async (req, res) => {
  const reservations = await prisma.reservation.findMany();
  res.json(reservations);
});
