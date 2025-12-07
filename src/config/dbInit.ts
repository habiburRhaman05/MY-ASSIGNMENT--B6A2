import { pool } from "./db";

export const initializeTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        role VARCHAR(10) CHECK (role IN ('admin','customer')) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type VARCHAR(10) CHECK (type IN ('car','bike','van','SUV')) NOT NULL,
        registration_number VARCHAR(50) UNIQUE NOT NULL,
        daily_rent_price NUMERIC CHECK (daily_rent_price > 0) NOT NULL,
        availability_status VARCHAR(10) CHECK (availability_status IN ('available','booked')) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS Bookings (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES users(id),
        vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_price NUMERIC CHECK (total_price > 0) NOT NULL,
        status VARCHAR(10) CHECK (status IN ('active','cancelled','returned')) NOT NULL
      );
    `);

    console.log("✅ Tables initialized successfully");
  } catch (err) {
    console.error("❌ Failed to initialize tables:", err);
  }
};
