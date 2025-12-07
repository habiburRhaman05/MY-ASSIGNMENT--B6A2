import express from "express";
import {
  authenticateToken,
  authorize,
} from "../../middlewares/auth.middleware";
import { bookingControllers } from "./booking.controller";

export const bookingRoutes = express.Router();

bookingRoutes.post(
  "/",
  authenticateToken,
  authorize(["admin", "customer"]),
  bookingControllers.createBooking
);
bookingRoutes.get(
  "/",
  authenticateToken,
  authorize(["admin", "customer"]),
  bookingControllers.getAllBookings
);
bookingRoutes.put(
  "/:bookingId",
  authenticateToken,
  authorize(["admin", "customer"]),
  bookingControllers.updateBooking
);
