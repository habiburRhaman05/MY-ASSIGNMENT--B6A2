import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { authServices } from "../modules/auth/auth.service";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token)
    return res.status(401).json({ error: " Unatohrize Token missing" });

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new ApiError("JWT secret missing", 500);

  try {
    const { err, decoded } = await authServices.verifyToken(token, JWT_SECRET);

    if (err || !decoded) throw new ApiError("Token Invalid or Expired", 401);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export const authorize = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    const user = req.user;
    console.log("user", user);

    if (!user) return res.status(401).json({ error: "Unauthorized" });
    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }

    next();
  };
};
