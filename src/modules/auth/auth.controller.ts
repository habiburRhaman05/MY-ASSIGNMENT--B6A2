import { Request, Response, NextFunction } from "express";
import { authServices } from "./auth.service";

const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const user = await authServices.signupService({
      name,
      email,
      password,
      phone,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const signInController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const result = await authServices.signInService({ email, password });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const authControllers = {
  signupController,
  signInController,
};
