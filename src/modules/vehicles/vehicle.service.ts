// import { ApiError } from "../../utils/ApiError";
// import * as vehicleModel from "../../models/vehicleModel";
// import * as userModel from "../../models/userModel";
// import { Vehicle } from "../../interfaces/vehicles.type";

// export const createVehicle = async (data: Vehicle, userId: number) => {
//   const user = await userModel.findUserById(userId);
//   if (!user) throw new ApiError(404, "User not found");

//   if (user.role !== "admin")
//     throw new ApiError(403, "Only admins can add vehicles");

//   const exists = await vehicleModel.findByRegistration(
//     data.registration_number
//   );
//   if (exists)
//     throw new ApiError(
//       400,
//       "Vehicle already exists with this registration number"
//     );

//   const created = await vehicleModel.createVehicle(data);

//   return {
//     success: true,
//     message: "Vehicle created successfully",
//     data: created,
//   };
// };

// export const getAllVehicles = async () => {
//   const vehicles = await vehicleModel.getAllVehicles();
//   return {
//     success: true,
//     data: vehicles,
//   };
// };

// export const getVehicleById = async (id: number) => {
//   const vehicle = await vehicleModel.getVehicleById(id);
//   if (!vehicle) throw new ApiError(404, "Vehicle not found");

//   return {
//     success: true,
//     data: vehicle,
//   };
// };

// export const updateVehicle = async (
//   id: number,
//   data: Partial<Vehicle>,
//   userId: number
// ) => {
//   const user = await userModel.findUserById(userId);
//   if (!user) throw new ApiError(404, "User not found");

//   if (user.role !== "admin")
//     throw new ApiError(403, "Only admins can update vehicles");

//   const vehicle = await vehicleModel.getVehicleById(id);
//   if (!vehicle) throw new ApiError(404, "Vehicle not found");

//   const updated = await vehicleModel.updateVehicle(id, data);

//   return {
//     success: true,
//     message: "Vehicle updated successfully",
//     data: updated,
//   };
// };

// export const deleteVehicle = async (id: number, userId: number) => {
//   const user = await userModel.findUserById(userId);
//   if (!user) throw new ApiError(404, "User not found");

//   if (user.role !== "admin")
//     throw new ApiError(403, "Only admins can delete vehicles");

//   const vehicle = await vehicleModel.getVehicleById(id);
//   if (!vehicle) throw new ApiError(404, "Vehicle not found");

//   // Check active bookings here if needed (future: bookingModel)

//   await vehicleModel.deleteVehicle(id);

//   return {
//     success: true,
//     message: "Vehicle deleted successfully",
//   };
// };
