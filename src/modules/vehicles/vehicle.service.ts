import { pool } from "../../config/db";
import { ApiError } from "../../utils/ApiError";
import { Vehicle } from "./vehicles.type";

const createVehicleServices = async (data: Vehicle) => {
  const {
    vehicle_name,
    registration_number,
    availability_status,
    type,
    daily_rent_price,
  } = data;

  const exist = await pool.query(
    `SELECT id FROM vehicles WHERE registration_number=$1`,
    [registration_number]
  );

  if (exist.rowCount !== 0) {
    throw new ApiError(
      "Vehicle with this registration number already exists",
      400
    );
  }

  const result = await pool.query(
    `
      INSERT INTO vehicles (vehicle_name, registration_number, availability_status, type, daily_rent_price)
      VALUES ($1,$2,$3,$4,$5)
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
};

const getAllVehiclesData = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result.rows;
};

const getVehicleDetails = async (vehicleId: number) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicleId,
  ]);

  if (result.rowCount === 0) throw new ApiError("Vehicle not found", 404);

  return result.rows[0];
};

const updateVehicleDetails = async (
  vehicleId: number,
  updateData: Partial<Vehicle>
) => {
  const exists = await pool.query(`SELECT id FROM vehicles WHERE id=$1`, [
    vehicleId,
  ]);

  if (exists.rowCount === 0) throw new ApiError("Vehicle not found", 404);

  const allowedFields = [
    "vehicle_name",
    "registration_number",
    "availability_status",
    "type",
    "daily_rent_price",
  ];

  const keys = Object.keys(updateData).filter((key) =>
    allowedFields.includes(key)
  );
  if (keys.length === 0) throw new ApiError("Invalid update fields", 400);

  const setQuery = keys.map((key, i) => `${key}=$${i + 1}`).join(", ");
  const values = keys.map((key) => (updateData as any)[key]);

  const updated = await pool.query(
    `UPDATE vehicles SET ${setQuery} WHERE id=$${keys.length + 1} RETURNING *`,
    [...values, vehicleId]
  );

  return updated.rows[0];
};

const deleteVehicle = async (vehicleId: number) => {
  const exists = await pool.query(`SELECT id FROM vehicles WHERE id=$1`, [
    vehicleId,
  ]);
  if (exists.rowCount === 0) throw new ApiError("Vehicle not found", 404);

  await pool.query(`DELETE FROM vehicles WHERE id=$1`, [vehicleId]);
  return true;
};

export const vehiclesServices = {
  createVehicleServices,
  getAllVehiclesData,
  getVehicleDetails,
  updateVehicleDetails,
  deleteVehicle,
};
