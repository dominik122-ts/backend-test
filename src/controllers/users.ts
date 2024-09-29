import asyncHandler from "express-async-handler";
import { prisma } from "..";
import { CreateUserRequestBody } from "../types";

export const createUser = asyncHandler<{}, {}, CreateUserRequestBody>(
  async (req, res) => {
    const createdUser = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        reservations: {
          create: {
            dateTime: new Date(req.body.reservationTime).toISOString(),
            Table: {
              connect: {
                id: req.body.reservationTable
              }
            }
          }
        }
      },
      include: { reservations: true }
    });

    res.json(createdUser);
  }
);
