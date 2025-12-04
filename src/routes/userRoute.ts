import express, { Request, Response } from "express";
// import { userControllers } from './user.controller';
// import { validateRequest } from '../../middlewares/validateRequest';
// import { userZodSchema } from './user.validate';

const router = express.Router();

// router.post('/create', validateRequest(userZodSchema), userControllers.createUser);
// router.get('/verify/:otp', validateRequest(userZodSchema), userControllers.verifyUser);
router.get("/:id", (req: Request, res: Response) => {
  res.json({ msg: "hello" });
});

export const userRoutes = router;
