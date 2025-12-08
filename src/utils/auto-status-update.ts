import cron from "node-cron";
import { pool } from "../config/db";
import { ApiError } from "./ApiError";

// Runs every hour
cron.schedule("0 * * * *", async () => {
  const now = new Date();
  try {
    const res = await pool.query(
      `
      UPDATE bookings
      SET status='returned'
      WHERE status='active' AND rent_end_date < $1
      RETURNING id, vehicle_id
    `,
      [now]
    );

    for (let booking of res.rows) {
      await pool.query(
        `
        UPDATE vehicles SET availability_status='available'
        WHERE id=$1
      `,
        [booking.vehicle_id]
      );
    }

    if (res.rowCount && res.rowCount > 0)
      console.log(`${res.rowCount} bookings auto-returned`);
  } catch (err: any) {
    throw new ApiError(err.message);
  }
});
