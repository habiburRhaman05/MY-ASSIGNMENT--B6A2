import express, { Request, Response } from "express";
import {
  signInController,
  signupController,
} from "../controller/auth-controller";

const router = express.Router();

router.post("/signup", signupController);
router.post("/signin", signInController);

export const authRoutes = router;
