import express, { RequestHandler } from "express";
import { vehiclesController } from "./vehicles.controller";
import { authorize } from "../../middlewares/auth.middleware";

export const vehiclesRouter = express.Router();

vehiclesRouter.post(
  "/",

  authorize(["admin"]) as RequestHandler,
  vehiclesController.createVehicles
);
vehiclesRouter.get("/", vehiclesController.getAllVehicles);
vehiclesRouter.get("/:vehicleId", vehiclesController.getVehicleDetails);
vehiclesRouter.delete(
  "/:vehicleId",
  authorize(["admin"]) as RequestHandler,
  vehiclesController.deleteVehicle
);
vehiclesRouter.put(
  "/:vehicleId",
  authorize(["admin"]) as RequestHandler,
  vehiclesController.updateVehicle
);
