import { Request, Response } from "express";
import { ResponseError } from "../ResponseError";
import { prisma } from "..";
import { logger } from "../../lib/logger";
import type {
  CreateReservationRequestBody,
  ReservationRequestQuery
} from "../types";

export const getReservations = async (
  req: Request<ReservationRequestQuery>,
  res: Response
) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const { startDate, endDate } = req.query;

    let whereClause = {};

    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new ResponseError(
          "Invalid date format. Please use a valid ISO-8601 date format.",
          400
        );
      }

      whereClause = {
        dateTime: {
          gte: start,
          lte: end
        }
      };
    }

    const [reservations, totalReservations] = await Promise.all([
      prisma.reservation.findMany({
        where: whereClause,
        skip: page ? (page - 1) * limit : 0,
        take: limit,
        include: { User: true, Table: true }
      }),
      prisma.reservation.count()
    ]);

    const totalPages = Math.ceil(totalReservations / limit);

    res.json({
      reservations,
      meta: {
        totalReservations,
        totalPages,
        currentPage: page,
        pageSize: limit
      }
    });
  } catch (error) {
    logger.error(error);

    if (error instanceof ResponseError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
};

export const createReservation = async (
  req: Request<{}, any, CreateReservationRequestBody>,
  res: Response
) => {
  try {
    const { tableId, dateTime } = req.body;

    const reservationTime = new Date(dateTime);
    const hour = reservationTime.getUTCHours();

    if (hour < 19 || hour >= 24) {
      throw new ResponseError(
        "Invalid reservation time. The restaurant is only open from 19:00 to 24:00.",
        400
      );
    }

    const existingReservation = await prisma.reservation.findFirst({
      where: {
        tableId,
        dateTime: reservationTime
      }
    });

    if (existingReservation) {
      throw new ResponseError(
        "Table is already reserved for the selected time slot.",
        400
      );
    }

    const table = await prisma.table.findUnique({
      where: {
        id: tableId
      }
    });

    if (!table) {
      throw new ResponseError("There is no table with the given ID.", 404);
    }

    const user = await prisma.user.findUnique({
      where: {
        email: req.body.userEmail
      }
    });

    const reservation = await prisma.reservation.create({
      data: {
        dateTime: reservationTime,
        User: user?.id
          ? { connect: { id: user.id } }
          : { create: { name: req.body.username, email: req.body.userEmail } },
        Table: { connect: { id: tableId } }
      },
      include: {
        Table: true,
        User: true
      }
    });

    res.status(201).json(reservation);
  } catch (error) {
    logger.error(error);

    if (error instanceof ResponseError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};
