import type { ParsedQs } from "express";

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface CreateUserRequestBody {
  name: string;
  email: string;
  reservationTime: string;
  reservationTable: number;
}

export interface ReservationRequestBody {
  tableId: number;
  dateTime: string;
}

export interface ReservationRequestQuery extends PaginationQuery {
  startDate?: string;
  endDate?: string;
}

export interface CreateReservationRequestBody {
  tableId: number;
  duration: number;
  dateTime: string;
  username: string;
  userEmail: string;
}

export interface EditReservationRequestQuery extends ParsedQs {
  tableId: number;
  dateTime: string;
}

export type PatchReservationRequestBody = Partial<CreateReservationRequestBody>;
