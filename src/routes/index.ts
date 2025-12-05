import { Router } from "express";

import _default from "./../../node_modules/pg-cloudflare/dist/empty.d";
import { authRoutes } from "../modules/auth/auth.route";

export const router = Router();

const moduleRoutes = [
  //   {
  //     path: "/users",
  //     route: userRoutes,
  //   },
  {
    path: "/auth",
    route: authRoutes,
  },
];

moduleRoutes.forEach((r) => {
  router.use(r.path, r.route);
});
