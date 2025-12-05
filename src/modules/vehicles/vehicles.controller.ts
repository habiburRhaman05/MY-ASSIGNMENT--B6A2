import { NextFunction, Request, Response } from "express";

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

    // Call service layer to create the user
    // const result = await userServices.signupService({
    //   name,
    //   email,
    //   password,
    //   phone,
    //   role,
    // });

    // if (user && user.name) {
    //   res.status(201).json({
    //     success: true,
    //     message: "User registered successfully",
    //     data: {
    //       id: user.id,
    //       name: user.name,
    //       email: user.email,
    //       phone: user.phone,
    //       role: user.role,
    //     },
    //   });
    // }
  } catch (error) {
    next(error);
  }
};
