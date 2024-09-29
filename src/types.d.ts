export interface CreateUserRequestBody {
  name: string;
  email: string;
  reservationTime: string;
  reservationTable: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}
