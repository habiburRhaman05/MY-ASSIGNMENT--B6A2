import express, { Request, Response } from "express";
import { authControllers } from "./auth.controller";

const router = express.Router();

router.post("/signup", authControllers.signupController);
router.post("/signin", authControllers.signInController);

export const authRoutes = router;
