import { Router } from "express";

import _default from "./../../node_modules/pg-cloudflare/dist/empty.d";
import { authRoutes } from "../modules/auth/auth.route";
import { vehiclesRouter } from "../modules/vehicles/vehicles.route";
import { userRoutes } from "../modules/users/users.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/vehicles",
    route: vehiclesRouter,
  },
];

moduleRoutes.forEach((r) => {
  router.use(r.path, r.route);
});
