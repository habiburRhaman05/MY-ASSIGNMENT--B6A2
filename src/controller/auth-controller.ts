import { NextFunction, Request, Response } from "express";
import { signInService, signupService } from "../services/auth/auth-services";

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Call service layer to create the user
    const user = await signupService({ name, email, password, phone, role });

    if (user && user.name) {
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

export const signInController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Call service layer to create the user
    const result = await signInService({ email, password });
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
