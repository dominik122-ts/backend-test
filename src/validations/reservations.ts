import Joi from "joi";
import { NextFunction, Request, Response } from "express";

const reservationSchema = Joi.object({
  dateTime: Joi.date().iso().required().messages({
    "date.base": "Invalid date format",
    "date.iso": "Date must be in ISO 8601 format"
  }),
  tableId: Joi.number().integer().min(1).required().messages({
    "number.base": "Table ID must be a number",
    "number.min": "Table ID must be at least 1"
  }),
  username: Joi.string().required().messages({
    "string.base": "Name should be a string",
    "string.empty": "Name is required"
  }),
  userEmail: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required"
  })
});

export const validateReservation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = reservationSchema.validate(req.body);

  if (error) {
    res.status(400).json({ message: error.details[0].message });
  }

  next();
};
