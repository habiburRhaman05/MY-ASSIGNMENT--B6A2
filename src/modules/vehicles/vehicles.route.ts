import express, { RequestHandler } from "express";
import { vehiclesController } from "./vehicles.controller";
import {
  authenticateToken,
  authorize,
} from "../../middlewares/auth.middleware";

export const vehiclesRouter = express.Router();

vehiclesRouter.post(
  "/",
  authenticateToken,
  authorize(["admin"]),
  vehiclesController.createVehicles
);
vehiclesRouter.get("/", vehiclesController.getAllVehicles);
vehiclesRouter.get("/:vehicleId", vehiclesController.getVehicleDetails);
vehiclesRouter.delete(
  "/:vehicleId",
  authorize(["admin"]),
  vehiclesController.deleteVehicle
);
vehiclesRouter.put(
  "/:vehicleId",
  authorize(["admin"]),
  vehiclesController.updateVehicle
);
