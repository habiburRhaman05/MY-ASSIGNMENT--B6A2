// import { z } from "zod";

// export const vehicleSchema = z.object({
//   vehicle_name: z
//     .string(
//        "Vehicle name is required",
//     )
//     .min(2, "Vehicle name must be at least 2 characters"),

//   type: z.enum(["car", "bike", "van", "SUV"], {
//     required_error: "Vehicle type is required",
//   }),

//   registration_number: z
//     .string({
//       required_error: "Registration number is required",
//     })
//     .min(3, "Registration number must be valid"),

//   daily_rent_price: z
//     .number({
//       required_error: "Daily rent price is required",
//     })
//     .positive("Daily rent must be greater than 0"),

//   availability_status: z.enum(["available", "booked"], {
//     required_error: "Availability status is required",
//   }),
// });

// export type VehicleSchemaType = z.infer<typeof vehicleSchema>;
