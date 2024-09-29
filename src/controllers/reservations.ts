import { Request, Response } from "express";
import { ResponseError } from "../ResponseError";
import { prisma } from "..";
import { logger } from "../../lib/logger";
import type {
  CreateReservationRequestBody,
  EditReservationRequestQuery,
  PatchReservationRequestBody,
  ReservationRequestQuery
} from "../types";

export const getReservations = async (
  req: Request<{}, any, {}, ReservationRequestQuery>,
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

export const getReservation = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { User: true, Table: true }
    });

    if (!reservation) {
      throw new ResponseError("Reservation not found", 404);
    }

    res.json(reservation);
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
    const startingHour = reservationTime.getUTCHours();
    const endingHour = reservationTime.getUTCHours() + req.body.duration / 60;

    if (startingHour < 19 || startingHour >= 24 || endingHour >= 24) {
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
        duration: req.body.duration,
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

export const editReservation = async (
  req: Request<{ id?: number }, any, PatchReservationRequestBody>,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const newTableId = req.body.tableId;
    const newDuration = req.body.duration;
    const newUserEmail = req.body.userEmail;
    const newUsername = req.body.username;
    const newDateTime = req.body.dateTime;
    const newReservationTime = newDateTime ? new Date(newDateTime) : null;

    const oldReservation = await prisma.reservation.findUnique({
      where: { id }
    });

    if (!oldReservation) {
      throw new ResponseError("Reservation not found.", 404);
    }

    const oldReservationTime = oldReservation.dateTime;
    const reservationTime = newReservationTime || oldReservationTime;
    const reservationDuration = newDuration || oldReservation?.duration;

    if (newReservationTime) {
      const startingHour = newReservationTime.getUTCHours();
      const endingHour = reservationDuration
        ? newReservationTime.getUTCHours() + reservationDuration / 60
        : 0;

      if (startingHour < 19 || startingHour >= 24) {
        throw new ResponseError(
          "Invalid reservation time. The restaurant is only open from 19:00 to 24:00.",
          400
        );
      }

      if (endingHour >= 24) {
        throw new ResponseError(
          "Invalid reservation duration. The restaurant is only open from 19:00 to 24:00.",
          400
        );
      }
    }

    if (
      (newReservationTime || newTableId) &&
      (newReservationTime !== oldReservationTime ||
        newTableId !== oldReservation?.tableId)
    ) {
      const newReservation = await prisma.reservation.findFirst({
        where: {
          tableId: newTableId || oldReservation?.tableId,
          dateTime: reservationTime
        }
      });

      if (newReservation) {
        throw new ResponseError(
          "Table is already reserved for the selected time slot.",
          400
        );
      }
    }

    if (newTableId && newTableId !== oldReservation?.tableId) {
      const newTable = await prisma.table.findUnique({
        where: {
          id: newTableId
        }
      });

      if (!newTable) {
        throw new ResponseError("There is no table with the given ID.", 404);
      }
    }

    const newUserData = Boolean(newUserEmail || newUsername);

    const reservation = await prisma.reservation.update({
      where: { id },
      data: {
        dateTime: reservationTime,
        duration: newDuration || oldReservation?.duration,
        User: newUserData
          ? {
              update: {
                name: newUsername,
                email: newUserEmail
              }
            }
          : undefined,
        Table: newTableId
          ? {
              connect: {
                id: newTableId
              }
            }
          : undefined
      },
      include: {
        User: true,
        Table: true
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

export const deleteReservation = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const reservation = await prisma.reservation.delete({
      where: { id }
    });

    res.status(204).json(reservation);
  } catch (error) {
    logger.error(error);

    if (error instanceof ResponseError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};
