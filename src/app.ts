import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { NotFound } from "./middlewares/NotFound";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

const app = express();

// Load environment variables
dotenv.config({ path: ".env" });

// Make sure env variables exist

const REQUEST_RATE_LIMIT = parseInt(
  process.env.REQUEST_RATE_LIMIT || "100",
  10
);
const REQUEST_RATE_LIMIT_TIME = parseInt(
  process.env.REQUEST_RATE_LIMIT_TIME || "60",
  10
); // seconds
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: REQUEST_RATE_LIMIT * 1000 * 10,
  max: REQUEST_RATE_LIMIT_TIME,
  message: {
    success: false,
    statusCode: 400,
    message: "Too many requests, please try again later.",
  },
});

app.use(limiter);

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
