import { pool } from "../../config/db";
import bcrypt from "bcrypt";
import { ApiError } from "../../utils/ApiError";
import jwt, { SignOptions } from "jsonwebtoken";
import { UserType } from "../users/users.type";

export interface JwtPayload {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer";
}

// --------------------- SIGNUP ---------------------
const signupService = async (userData: UserType) => {
  const { name, email, password, phone, role } = userData;

  // Check email exists
  const existingUser = await pool.query(
    "SELECT id FROM users WHERE LOWER(email) = LOWER($1)",
    [email]
  );

  if (existingUser.rowCount !== 0) {
    throw new ApiError("Email already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
      INSERT INTO users (name, email, password, phone, role)
      VALUES ($1, LOWER($2), $3, $4, $5)
      RETURNING id, name, email, phone, role;
    `;

  const values = [name, email, hashedPassword, phone, role];

  const result = await pool.query(query, values);

  return result.rows[0];
};

// --------------------- SIGN-IN ---------------------
const signInService = async (credentials: {
  email: string;
  password: string;
}) => {
  const { email, password } = credentials;

  const userResult = await pool.query(
    `SELECT * FROM users WHERE LOWER(email) = LOWER($1)`,
    [email]
  );

  if (userResult.rowCount === 0) {
    throw new ApiError("User Not Exist With This Email", 404);
  }

  const user = userResult.rows[0];

  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    throw new ApiError("Password not match", 400);
  }

  const jwt_secret = process.env.JWT_SECRET as string;
  const jwt_expireIn = process.env.JWT_EXPIRE as string;

  const token = generateToken(user, jwt_expireIn, jwt_secret);

  const sanitizedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };

  return { token, user: sanitizedUser };
};

// --------------------- TOKEN GENERATE ---------------------
const generateToken = (
  user: UserType,
  expiresIn: any | string,
  jwt_secret: string
): string => {
  const payload: JwtPayload = {
    id: user.id!,
    name: user.name,
    email: user.email,
    role: user.role as "admin" | "customer",
  };

  const options: SignOptions = { expiresIn };

  return jwt.sign(payload, jwt_secret, options);
};

// --------------------- TOKEN VERIFY ---------------------
const verifyToken = async (
  token: string,
  secret: string
): Promise<{ err: null | string; decoded: any }> => {
  try {
    const decoded = jwt.verify(token, secret);
    return { err: null, decoded };
  } catch (error: any) {
    return { err: error.message, decoded: null };
  }
};
export const authServices = {
  signupService,
  signInService,
  generateToken,
  verifyToken,
};
