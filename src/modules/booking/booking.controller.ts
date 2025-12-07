import { NextFunction, Request, Response } from "express";
import { bookingServices } from "./booking.service";
import { ApiError } from "../../utils/ApiError";

const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUser = req.user as { id: number; role: "admin" | "customer" };

    // date validate
    const rent_start_date = new Date(req.body.rent_start_date);
    const currentDate = new Date();

    // Remove time part for fair comparison
    currentDate.setHours(0, 0, 0, 0);
    rent_start_date.setHours(0, 0, 0, 0);

    if (rent_start_date <= currentDate) {
      return res.status(400).json({
        success: false,
        message: "Rent start date must be after today",
      });
    }

    // Only admin or same customer can book
    if (
      currentUser.role !== "admin" &&
      currentUser.id !== req.body.customer_id
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You cannot create booking for others",
      });
    }

    const result = await bookingServices.createBookingService(req.body);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUser = req.user as { id: number; role: "admin" | "customer" };

    // Only admin or same customer can book
    if (currentUser.role !== "admin") {
      const result = await bookingServices.getAllBookingsData(
        currentUser.id,
        "customer"
      );

      return res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data: result,
      });
    }

    const result = await bookingServices.getAllBookingsData(
      currentUser.id,
      "admin"
    );

    return res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const { status } = req.body;
  const user = req.user as { id: number; role: "admin" | "customer" }; // coming from auth middleware

  if (!status) throw new ApiError("Status is required", 400);

  const result = await bookingServices.updateBookingService(
    Number(bookingId),
    status,
    user.id,
    user.role
  );

  // Admin return
  if (status === "returned") {
    return res.status(200).json({
      success: true,
      message: "Booking marked as returned. Vehicle is now available",
      data: result,
    });
  }

  // Customer cancel
  if (status === "cancelled") {
    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: result,
    });
  }
};

export const bookingControllers = {
  createBooking,
  getAllBookings,
  updateBooking,
};
