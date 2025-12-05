import { NextFunction, Request, Response } from "express";
import { vehiclesServices } from "./vehicle.service";

const createVehicles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;

    // validate input

    // result
    const newVehicle = await vehiclesServices.createVehicleServices({
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    });

    return res.status(201).json({
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
    // result
    const allVehicles = await vehiclesServices.getAllVehiclesData();
    if (allVehicles.length === 0) {
      return res.json({
        success: true,
        message: "No vehicles found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: allVehicles,
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
    const vehicleId = req.params.vehicleId;
    // result
    const vehicleInfo = await vehiclesServices.getVehicleDetails(
      parseInt(vehicleId)
    );

    return res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: vehicleInfo.rows[0],
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
    const vehicleId = req.params.vehicleId;

    // result
    const updatedVehicleData = await vehiclesServices.updateVehicleDetails(
      parseInt(vehicleId),
      req.body
    );
    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: updatedVehicleData,
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
  const vehicleId = Number(req.params.vehicleId);

  if (isNaN(vehicleId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid vehicle ID",
    });
  }

  const success = await vehiclesServices.deleteVehicle(vehicleId);

  if (success) {
    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  }
};

export const vehiclesController = {
  createVehicles,
  getAllVehicles,
  getVehicleDetails,
  updateVehicle,
  deleteVehicle,
};
