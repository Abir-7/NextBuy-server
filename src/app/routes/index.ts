import { Router } from "express";
import { UserRouter } from "../modules/user/user.router";

const router = Router();
const routeCollection = [
  {
    path: "/user",
    route: UserRouter,
  },
];

routeCollection.map((route) => router.use(route.path, route.route));

export default router;
