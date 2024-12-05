"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_router_1 = require("../modules/user/user.router");
const auth_route_1 = require("../modules/auth/auth.route");
const category_router_1 = require("../modules/category/category.router");
const shop_router_1 = require("../modules/shop/shop.router");
const product_router_1 = require("../modules/product/product.router");
const follower_route_1 = require("../modules/follower/follower.route");
const order_route_1 = require("../modules/order/order.route");
const payment_route_1 = require("../modules/order/payment/payment.route");
const router = (0, express_1.Router)();
const routeCollection = [
    {
        path: "/user",
        route: user_router_1.UserRouter,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRouter,
    },
    {
        path: "/category",
        route: category_router_1.CategoryRouter,
    },
    {
        path: "/shop",
        route: shop_router_1.ShopRouter,
    },
    {
        path: "/product",
        route: product_router_1.ProductRouter,
    },
    {
        path: "/follower",
        route: follower_route_1.FollowRouter,
    },
    {
        path: "/order",
        route: order_route_1.OrderRouter,
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentRouter,
    },
];
routeCollection.map((route) => router.use(route.path, route.route));
exports.default = router;
