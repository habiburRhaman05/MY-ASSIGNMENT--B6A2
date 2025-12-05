import { pool } from "../../config/db";
import { ApiError } from "../../utils/ApiError";
import { Vehicle } from "./vehicles.type";

const createVehicleServices = async (data: Vehicle) => {
  try {
    const {
      vehicle_name,
      registration_number,
      availability_status,
      type,
      daily_rent_price,
    } = data;
    const existingVehicle = await pool.query(
      `

        SELECT * FROM vehicles WHERE registration_number = $1
        `,
      [registration_number]
    );

    if (existingVehicle.rows.length > 0) {
      throw new ApiError(
        `Another vehicle is already exist with this  registration_number - ${registration_number}`,
        400
      );
    }
    const result = await pool.query(
      `
        INSERT INTO vehicles( vehicle_name, registration_number,availability_status,type,daily_rent_price)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
      [
        vehicle_name,
        registration_number,
        availability_status,
        type,
        daily_rent_price,
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const getAllVehiclesData = async () => {
  try {
    const result = await pool.query(`
            SELECT * FROM vehicles
            `);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const getVehicleDetails = async (vehicleId: number) => {
  const vehicle = await pool.query(
    `
    SELECT * FROM vehicles WHERE id = $1
    
    `,
    [vehicleId]
  );
  if (vehicle.rowCount === 0) throw new ApiError("Vehicle not found", 404);

  return vehicle;
};

export const updateVehicleDetails = async (
  vehicleId: number,
  updateData: Partial<Vehicle>
) => {
  try {
    // 1. Check vehicle exists
    const existingVehicle = await pool.query(
      `SELECT * FROM vehicles WHERE id = $1`,
      [vehicleId]
    );

    if (existingVehicle.rowCount === 0) {
      throw new ApiError("Vehicle not found", 404);
    }

    // 2. Do not allow empty update
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new ApiError("No update fields provided", 400);
    }

    // 3. Valid fields that can be updated
    const allowedFields = [
      "vehicle_name",
      "registration_number",
      "availability_status",
      "type",
      "daily_rent_price",
    ];

    // 4. Filter fields coming from user
    const updateKeys = Object.keys(updateData).filter((key) =>
      allowedFields.includes(key)
    );

    if (updateKeys.length === 0) {
      throw new ApiError("Invalid field(s) provided", 400);
    }

    // 5. Dynamically build SET query
    const setQuery = updateKeys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");

    const values = updateKeys.map((key) => (updateData as any)[key]);

    // 6. Execute dynamic update
    const updated = await pool.query(
      `
        UPDATE vehicles
        SET ${setQuery}
        WHERE id = $${updateKeys.length + 1}
        RETURNING *
      `,
      [...values, vehicleId]
    );

    return updated.rows[0];
  } catch (error) {
    throw error;
  }
};

const deleteVehicle = async (vehicleId: number) => {
  try {
    const existing = await pool.query(`SELECT id FROM vehicles WHERE id = $1`, [
      vehicleId,
    ]);

    if (existing.rowCount === 0) {
      throw new ApiError("Vehicle not found", 404);
    }

    await pool.query(`DELETE FROM vehicles WHERE id = $1`, [vehicleId]);

    return true; // Service returns TRUE if deletion succeeded
  } catch (error) {
    throw error; // MUST throw so controller can handle
  }
};

export const vehiclesServices = {
  createVehicleServices,
  getAllVehiclesData,
  getVehicleDetails,
  updateVehicleDetails,
  deleteVehicle,
};
