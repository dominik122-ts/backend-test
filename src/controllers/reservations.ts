import asyncHandler from "express-async-handler";
import type { PaginationQuery } from "../types";
import { prisma } from "..";

export const getReservations = asyncHandler<{}, {}, {}, PaginationQuery>(
  async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const [reservations, totalReservations] = await Promise.all([
      prisma.reservation.findMany({
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
  }
);
