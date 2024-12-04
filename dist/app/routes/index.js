"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_router_1 = require("../modules/user/user.router");
const auth_route_1 = require("../modules/auth/auth.route");
const category_router_1 = require("../modules/category/category.router");
const shop_router_1 = require("../modules/shop/shop.router");
const product_router_1 = require("../modules/product/product.router");
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
];
routeCollection.map((route) => router.use(route.path, route.route));
exports.default = router;
