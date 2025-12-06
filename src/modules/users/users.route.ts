import express, { RequestHandler } from "express";
import {
  authenticateToken,
  authorize,
} from "../../middlewares/auth.middleware";
import { usersController } from "./user.controller";

export const userRoutes = express.Router();

userRoutes.get(
  "/",
  authenticateToken,
  authorize(["admin"]),
  usersController.getAllUsers
);
userRoutes.delete(
  "/",
  authenticateToken,
  authorize(["admin"]),
  usersController.getAllUsers
);

userRoutes.put(
  "/:userId",
  authenticateToken,
  authorize(["admin", "customer"]),
  usersController.updateUser
);
