import { Router } from "express";
import { UserRouter } from "../modules/user/user.router";
import { AuthRouter } from "../modules/auth/auth.route";

const router = Router();
const routeCollection = [
  {
    path: "/user",
    route: UserRouter,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
];

routeCollection.map((route) => router.use(route.path, route.route));

export default router;
