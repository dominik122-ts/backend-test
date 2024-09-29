import asyncHandler from "express-async-handler";
import { prisma } from "..";
import { CreateUserRequestBody } from "../types";

export const createUser = asyncHandler<{}, {}, CreateUserRequestBody>(
  async (req, res) => {
    const createdUser = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email
      }
    });

    res.json(createdUser);
  }
);
