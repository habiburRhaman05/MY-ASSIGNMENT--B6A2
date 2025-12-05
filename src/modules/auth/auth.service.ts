import { pool } from "../../config/db";
import { UserType } from "../../interfaces/user.type";
import bcrypt from "bcrypt";
import { ApiError } from "../../utils/ApiError";
import jwt, { SignOptions } from "jsonwebtoken";

const signupService = async (userData: UserType) => {
  try {
    const { name, email, password, phone, role } = userData;

    const existingUser = await pool.query(
      `SELECT * FROM users WHERE LOWER(email) = LOWER($1)`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new ApiError("Email already exists", 400);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO users (name, email, password, phone, role)
      VALUES ($1, LOWER($2), $3, $4, $5)
      RETURNING id, name, email, phone, role;
    `;
    const values = [name, email, hashedPassword, phone, role];

    const result = await pool.query(query, values);

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
const signInService = async (userData: { email: string; password: string }) => {
  try {
    const { email, password } = userData;

    const existingUser = await pool.query(
      `SELECT * FROM users WHERE LOWER(email) = LOWER($1) `,
      [email]
    );

    if (existingUser.rows.length == 0) {
      throw new ApiError("User Not Exist With This Email", 404);
    }

    const passwordValid = await bcrypt.compare(
      password,
      existingUser.rows[0].password
    );

    if (!passwordValid) {
      throw new ApiError("Password not match", 400);
    }

    const jwt_secret = process.env.JWT_SECRET as string;
    const jwt_expireIn = process.env.JWT_EXPIRE;

    const token = generateToken(existingUser.rows[0], jwt_expireIn, jwt_secret);

    const query = `
      SELECT id, name, email, phone, role FROM users WHERE LOWER(email) = LOWER($1)

    `;

    const result = await pool.query(query, [email]);

    return { token, user: result.rows[0] };
  } catch (error) {
    throw error;
  }
};

const generateToken = (
  userData: UserType,
  expiresIn: any,
  jwt_secret: string
): string => {
  const payload = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
  };

  const options: SignOptions = { expiresIn };

  // TypeScript now accepts JWT_SECRET as Secret
  const token = jwt.sign(payload, jwt_secret, options);

  return token;
};

const generateDecodedToken = async (
  token: string,
  secret: string
): Promise<{ err: null | string; decoded: any }> => {
  try {
    const decoded = jwt.verify(token, secret);
    console.log("decoded", decoded);

    return { err: null, decoded };
  } catch (error: any) {
    return { err: error.message, decoded: null };
  }
};

export const authServices = {
  signInService,
  signupService,
  generateToken,
  generateDecodedToken,
};
