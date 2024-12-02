import { Router } from "express";
import { UserRouter } from "../modules/user/user.router";
import { AuthRouter } from "../modules/auth/auth.route";
import { CategoryRouter } from "../modules/category/category.router";
import { ShopRouter } from "../modules/shop/shop.router";
import { ProductRouter } from "../modules/product/product.router";

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
  {
    path: "/category",
    route: CategoryRouter,
  },
  {
    path: "/shop",
    route: ShopRouter,
  },
  {
    path: "/product",
    route: ProductRouter,
  },
];

routeCollection.map((route) => router.use(route.path, route.route));

export default router;
