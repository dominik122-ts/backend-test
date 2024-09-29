import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import reservations from "./routes/reservations";
import { logger } from "../lib/logger";

config({ path: [".env", ".env.local"] });

const app = express();
export const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Restaurant Reservation API",
      version: "1.0.0",
      description:
        "API for creating users and making reservations at a restaurant."
    },
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Unique identifier for the user"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date and time when the user was created"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Date and time when the user was last updated"
            },
            name: {
              type: "string",
              description: "The name of the user"
            },
            email: {
              type: "string",
              format: "email",
              description: "The email address of the user"
            }
          }
        },
        Table: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Unique identifier for the table"
            },
            seats: {
              type: "integer",
              description: "Number of seats at the table"
            }
          }
        },
        Reservation: {
          type: "object",
          properties: {
            dateTime: {
              type: "string",
              format: "date-time",
              description: "The date and time of the reservation"
            },
            id: {
              type: "integer",
              description: "Unique identifier for the reservation"
            },
            userId: {
              type: "integer",
              description: "ID of the user making the reservation"
            },
            tableId: {
              type: "integer",
              description: "ID of the reserved table"
            },
            duration: {
              type: "integer",
              description: "Duration of the reservation in minutes"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date and time when the reservation was created"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Date and time when the reservation was last updated"
            }
          }
        },
        ReservationResponse: {
          type: "object",
          properties: {
            User: {
              $ref: "#/components/schemas/User"
            },
            Table: {
              $ref: "#/components/schemas/Table"
            },
            dateTime: {
              type: "string",
              format: "date-time"
            },
            id: {
              type: "integer"
            },
            userId: {
              type: "integer"
            },
            tableId: {
              type: "integer"
            },
            duration: {
              type: "integer"
            },
            createdAt: {
              type: "string",
              format: "date-time"
            },
            updatedAt: {
              type: "string",
              format: "date-time"
            }
          }
        },
        ReservationsResponse: {
          type: "object",
          properties: {
            reservations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  User: {
                    $ref: "#/components/schemas/User"
                  },
                  Table: {
                    $ref: "#/components/schemas/Table"
                  },
                  dateTime: {
                    type: "string",
                    format: "date-time"
                  },
                  id: {
                    type: "integer"
                  },
                  userId: {
                    type: "integer"
                  },
                  tableId: {
                    type: "integer"
                  },
                  duration: {
                    type: "integer"
                  },
                  createdAt: {
                    type: "string",
                    format: "date-time"
                  },
                  updatedAt: {
                    type: "string",
                    format: "date-time"
                  }
                }
              }
            },
            meta: {
              type: "object",
              properties: {
                totalReservations: {
                  type: "integer",
                  description: "Total number of reservations"
                },
                totalPages: {
                  type: "integer",
                  description: "Total number of pages for pagination"
                },
                currentPage: {
                  type: "integer",
                  description: "Current page number"
                },
                pageSize: {
                  type: "integer",
                  description: "Number of items per page"
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.ts"] // Path to your API files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI on a specific route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/reservations", reservations);

app.listen(process.env.PORT, () => {
  logger.info("Server started on port 3000", { port: 3000 });
  logger.info("API docs available on /api-docs");
});
