import { Request, Response, NextFunction } from "express";
import { vehiclesServices } from "./vehicle.service";

const createVehicles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newVehicle = await vehiclesServices.createVehicleServices(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: newVehicle,
    });
  } catch (error) {
    next(error);
  }
};

const getAllVehicles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vehicles = await vehiclesServices.getAllVehiclesData();

    res.json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: vehicles,
    });
  } catch (error) {
    next(error);
  }
};

const getVehicleDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vehicle = await vehiclesServices.getVehicleDetails(
      Number(req.params.vehicleId)
    );

    res.json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

const updateVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updated = await vehiclesServices.updateVehicleDetails(
      Number(req.params.vehicleId),
      req.body
    );

    res.json({
      success: true,
      message: "Vehicle updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await vehiclesServices.deleteVehicle(Number(req.params.vehicleId));

    res.json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const vehiclesController = {
  createVehicles,
  getAllVehicles,
  getVehicleDetails,
  updateVehicle,
  deleteVehicle,
};
