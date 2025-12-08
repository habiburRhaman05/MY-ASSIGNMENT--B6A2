import { pool } from "../../config/db";
import { ApiError } from "../../utils/ApiError";
import { usersServices } from "../users/users.service";
import { BookingType } from "./booking.type";

const createBookingService = async (data: BookingType) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = data;

  // 1️⃣ Vehicle exist check
  const vehicleRes = await pool.query(
    `SELECT id, vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );

  if (vehicleRes.rowCount === 0) {
    throw new ApiError("Vehicle not found", 404);
  }

  const vehicle = vehicleRes.rows[0];

  // 2️⃣ Check if vehicle already rented
  if (vehicle.availability_status !== "available") {
    throw new ApiError("Vehicle is currently not available", 400);
  }

  // 3️⃣ Calculate total days
  const { totalDays } = calculateDate(rent_start_date, rent_end_date);
  console.log(totalDays);

  if ((totalDays as number) <= 0) {
    throw new ApiError("Invalid rent dates", 400);
  }

  // 4️⃣ Price calculation
  const totalPrice = (totalDays as number) * vehicle.daily_rent_price;

  // 5️⃣ INSERT booking
  const bookingRes = await pool.query(
    `
      INSERT INTO bookings 
      (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status
    `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
  );

  const booking = bookingRes.rows.map((item) => {
    return {
      ...item,
      rent_start_date: formatDate(item.rent_start_date),
      rent_end_date: formatDate(item.rent_end_date),
    };
  })[0];

  // 6️⃣ Update vehicle status → rented
  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  return {
    ...booking,
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

const getAllBookingsData = async (userId: number, role: string) => {
  const isUserExist = await usersServices.getUser(userId);
  if (isUserExist.rowCount === 0) {
    throw new ApiError("Invalid user", 404);
  }

  // update status when rend_end_date pass
  const now = new Date();

  const updated = await pool.query(
    `
  UPDATE bookings
  SET status = 'returned'
  WHERE status = 'active'
  AND rent_end_date < $1
  RETURNING vehicle_id
`,
    [now]
  );

  // 2️⃣ Update only the vehicles from updated bookings
  if (updated.rowCount !== 0) {
    await pool.query(
      `
  UPDATE vehicles
  SET availability_status = 'available'
  WHERE id = ANY($1)
`,
      [updated.rows.map((b) => b.vehicle_id)]
    );
  }

  //  Admin → See ALL bookings
  if (role === "admin") {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.customer_id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,
        
        u.name AS customer_name,
        u.email AS customer_email,
        
        v.vehicle_name AS vehicle_name,
        v.registration_number,
        v.type

      FROM bookings b
      INNER JOIN users u ON b.customer_id = u.id
      INNER JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id DESC
    `);

    //formatted result into required JSON shape
    const formatted = result.rows.map((b) => ({
      id: b.id,
      customer_id: b.customer_id,
      vehicle_id: b.vehicle_id,
      rent_start_date: formatDate(b.rent_start_date),
      rent_end_date: formatDate(b.rent_end_date),
      total_price: b.total_price,
      status: statusUpdateByEndDate(b.rent_end_date, b.status),
      customer: {
        name: b.customer_name,
        email: b.customer_email,
      },
      vehicle: {
        vehicle_name: b.vehicle_name,
        registration_number: b.registration_number,
      },
    }));

    return formatted;
  }

  //  Customer → Only his bookings
  const result = await pool.query(
    `
    SELECT 
      b.id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,

      v.vehicle_name AS vehicle_name,
      v.registration_number,
      v.type

    FROM bookings b
    INNER JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.id DESC
  `,
    [userId]
  );

  const formatted = result.rows.map((b) => ({
    id: b.id,
    vehicle_id: b.vehicle_id,
    rent_start_date: formatDate(b.rent_start_date),
    rent_end_date: formatDate(b.rent_end_date),
    total_price: b.total_price,
    status: statusUpdateByEndDate(b.rent_end_date, b.status),
    vehicle: {
      vehicle_name: b.vehicle_name,
      registration_number: b.registration_number,
      type: b.type,
    },
  }));

  return formatted;
};

const updateBookingService = async (
  bookingId: number,
  status: string,
  userId: number,
  role: string
) => {
  const existingBooking = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId]
  );

  if (existingBooking.rowCount === 0) {
    throw new ApiError("Booking not found", 404);
  }

  const booking = existingBooking.rows[0];

  // Customer can cancel only before the start date
  if (role === "customer" && status === "cancelled") {
    const now = new Date();
    const startDate = new Date(booking.rent_start_date);

    if (now >= startDate) {
      throw new ApiError(
        "You cannot cancel this booking because the rent period has already started",
        400
      );
    }
  }
  // 2️⃣ Permission Logic
  // Customer can cancel ONLY own booking
  if (role === "customer" && booking.customer_id !== userId) {
    throw new ApiError("You cannot modify this booking", 403);
  }

  // Customer can ONLY cancel
  if (role === "customer" && status !== "cancelled") {
    throw new ApiError("Customers can only cancel bookings", 403);
  }

  // Admin can mark returned
  if (role === "admin" && status !== "returned" && status !== "cancelled") {
    throw new ApiError("Invalid status", 400);
  }

  //  Update booking
  const updatedBooking = await pool.query(
    `UPDATE bookings 
     SET status = $1 
     WHERE id = $2 
     RETURNING *`,
    [status, bookingId]
  );

  const updated = updatedBooking.rows[0];

  // If admin marks returned → vehicle becomes available
  if (status === "returned") {
    await pool.query(
      `UPDATE vehicles SET availability_status = 'available'
       WHERE id = $1`,
      [updated.vehicle_id]
    );

    // return assignment required output
    return {
      ...updated,
      vehicle: { availability_status: "available" },
    };
  }
  if (status === "cancelled") {
    await pool.query(
      `UPDATE vehicles SET availability_status = 'available'
       WHERE id = $1`,
      [updated.vehicle_id]
    );

    // return assignment required output
    return {
      ...updated,
    };
  }

  //  Return basic updated data (customer cancellation)
  return updated;
};

const calculateDate = (start: Date, end: Date) => {
  const rent_start_date = new Date(start);
  const rent_end_date = new Date(end);
  if (end <= start) {
    return { totalDays: 0 };
  }
  const diffTime = rent_end_date.getTime() - rent_start_date.getTime();
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return { totalDays };
};

const statusUpdateByEndDate = (
  endDate: string | Date,
  currentStatus: string
) => {
  const today = new Date();
  const end = new Date(endDate);

  // Remove time from comparison (avoid timezone problems)
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // If end date is passed → must be returned
  if (end < today) {
    return "returned";
  }

  return currentStatus; // no change
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const bookingServices = {
  createBookingService,
  getAllBookingsData,
  updateBookingService,
};
