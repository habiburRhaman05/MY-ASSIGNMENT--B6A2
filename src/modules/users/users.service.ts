import { pool } from "../../config/db";
import { ApiError } from "../../utils/ApiError";
import { UserType } from "./users.type";

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );
  return result.rows;
};

const deleteUser = async (userId: number) => {
  const user = await pool.query(`SELECT id FROM users WHERE id = $1`, [userId]);

  if (user.rowCount === 0) {
    throw new ApiError("User not found", 404);
  }
  const activeBookings = await pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [userId]
  );
  if (activeBookings.rowCount !== 0) {
    throw new ApiError("User has active booking", 400);
  }

  await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
  return true;
};

export const updateUserService = async (
  targetUserId: number,
  requester: any,
  updateData: {
    name?: string;
    email?: string;
    phone?: string;
    role?: "admin" | "customer"; // admin only
  }
) => {
  const existing = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    targetUserId,
  ]);

  if (existing.rowCount === 0) return null; // controller will respond 404

  // Customer can update only own profile
  if (requester.role !== "admin" && requester.id !== targetUserId) {
    throw new ApiError("Forbidden: You can only update your own profile", 403);
  }

  // Customer cannot update role
  if (requester.role !== "admin" && updateData.role) {
    throw new ApiError("Forbidden: You cannot update your role", 403);
  }

  if (requester.role !== "admin") {
    delete updateData.role;
  }

  // 4️⃣ Build dynamic update query
  const keys = Object.keys(updateData);

  // No fields → return original user
  if (keys.length === 0) {
    return existing.rows[0];
  }

  const setQuery = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
  const values = Object.values(updateData);

  const updated = await pool.query(
    `
      UPDATE users 
      SET ${setQuery} 
      WHERE id = $${keys.length + 1}
      RETURNING id, name, email, phone, role
    `,
    [...values, targetUserId]
  );

  return updated.rows[0];
};

export const usersServices = {
  getAllUsers,
  deleteUser,
  updateUserService,
};
