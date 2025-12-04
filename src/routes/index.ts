import { Router } from "express";

import _default from "./../../node_modules/pg-cloudflare/dist/empty.d";
import { userRoutes } from "./userRoute";
import { authRoutes } from "./authRoute";

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
];

moduleRoutes.forEach((r) => {
  router.use(r.path, r.route);
});
