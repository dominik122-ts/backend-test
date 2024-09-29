import Joi from "joi";
import { NextFunction, Request, Response } from "express";

const createReservationSchema = Joi.object({
  dateTime: Joi.date().iso().required().messages({
    "date.base": "Invalid date format",
    "date.iso": "Date must be in ISO 8601 format",
    "date.empty": "Date is required"
  }),
  tableId: Joi.number().integer().min(1).required().messages({
    "number.base": "Table ID must be a number",
    "number.min": "Table ID must be at least 1",
    "number.empty": "Table ID is required"
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

const editReservationSchema = Joi.object({
  dateTime: Joi.date().iso().messages({
    "date.base": "Invalid date format",
    "date.iso": "Date must be in ISO 8601 format"
  }),
  tableId: Joi.number().integer().min(1).messages({
    "number.base": "Table ID must be a number",
    "number.min": "Table ID must be at least 1"
  }),
  username: Joi.string().messages({
    "string.base": "Name should be a string"
  }),
  userEmail: Joi.string().email().messages({
    "string.email": "Please provide a valid email address"
  })
});

export const validateCreateReservation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = createReservationSchema.validate(req.body);

  if (error) {
    res.status(400).json({ message: error.details[0].message });
  }

  next();
};

export const validateEditReservation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = editReservationSchema.validate(req.body);

  if (error) {
    res.status(400).json({ message: error.details[0].message });
  }

  next();
};
