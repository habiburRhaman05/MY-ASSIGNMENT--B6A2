import { NextFunction, Request, Response } from "express";
import { usersServices } from "./users.service";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await usersServices.getAllUsers();

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetUserId = Number(req.params.userId);

    const updated = await usersServices.updateUserService(
      targetUserId,
      req.user, // requester from JWT middleware
      req.body // update fields
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    await usersServices.deleteUser(userId);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const usersController = {
  getAllUsers,
  updateUser,
  deleteUser,
};
