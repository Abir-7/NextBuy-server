import { Router } from "express";
import { UserRouter } from "../modules/user/user.router";
import { AuthRouter } from "../modules/auth/auth.route";
import { CategoryRouter } from "../modules/category/category.router";
import { ShopRouter } from "../modules/shop/shop.router";
import { ProductRouter } from "../modules/product/product.router";
import { FollowRouter } from "../modules/follower/follower.route";
import { OrderRouter } from "../modules/order/order.route";
import { PaymentRouter } from "../modules/order/payment/payment.route";
import { RatingRouter } from "../modules/rating/rating.router";
import { CuponRouter } from "../modules/cupon/cupon.route";
import { DashboardRouter } from "../modules/dashboard/dashboard.route";

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
  {
    path: "/follower",
    route: FollowRouter,
  },
  {
    path: "/order",
    route: OrderRouter,
  },
  {
    path: "/payment",
    route: PaymentRouter,
  },
  {
    path: "/rating",
    route: RatingRouter,
  },
  {
    path: "/cupon",
    route: CuponRouter,
  },
  {
    path: "/dashboard",
    route: DashboardRouter,
  },
];

routeCollection.map((route) => router.use(route.path, route.route));

export default router;
