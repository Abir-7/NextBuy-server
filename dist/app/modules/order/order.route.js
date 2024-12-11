"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../../middleware/auth/auth");
const order_controller_1 = require("./order.controller");
const router = (0, express_1.Router)();
// Customer Routes
router.get("/single-order/:id", (0, auth_1.auth)("CUSTOMER", "ADMIN", "SUPERADMIN", "VENDOR"), order_controller_1.OrderController.getSingleOrder);
router.get("/my-order", (0, auth_1.auth)("CUSTOMER"), order_controller_1.OrderController.getSingleCustomerAllOrder);
router.get("/pending-order", (0, auth_1.auth)("ADMIN", "SUPERADMIN"), order_controller_1.OrderController.getPendingOrder);
router.get("/shop-order", (0, auth_1.auth)("VENDOR"), order_controller_1.OrderController.getSpeceficShopOrder);
router.post("/make-payment", (0, auth_1.auth)("CUSTOMER"), order_controller_1.OrderController.orderProduct);
// Admin and Superadmin Routes
router.get("/all-orders", (0, auth_1.auth)("ADMIN", "SUPERADMIN"), order_controller_1.OrderController.getAllOrder);
router.patch("/update/:id", // Fixed the missing slash in the path
(0, auth_1.auth)("ADMIN", "SUPERADMIN"), order_controller_1.OrderController.updateOrder);
exports.OrderRouter = router;
