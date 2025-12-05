import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { authServices } from "../modules/auth/auth.service";

export interface AuthRequest extends Request {
  user?: { id: number; email: string; role: string };
}

export const authorize =
  (roles: string[]) =>
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) throw new ApiError("JWT secret missing", 500);

      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) throw new ApiError("Unauthorized User", 401);

      const { err, decoded } = await authServices.generateDecodedToken(
        token,
        JWT_SECRET
      );

      if (err || !decoded) throw new ApiError("Token Invalid or Expired", 401);

      // attach user
      // req.user = decoded

      // check roles
      if (!roles.includes(decoded.role)) {
        return next(new ApiError("Forbidden: You don't have access", 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
