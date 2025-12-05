import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { NotFound } from "./middlewares/NotFound";
import dotenv from "dotenv";
import { router } from "./routes";

dotenv.config({ path: ".env" });

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the show");
});

// GLOBAL ROUTES
app.use("/api/v1", router);

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

// NO ROUTE MATCH
app.use(NotFound);

export default app;
