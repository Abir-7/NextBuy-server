"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuponRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../../middleware/auth/auth");
const cupon_controller_1 = require("./cupon.controller");
const router = (0, express_1.Router)();
router.post("/create-cupon", (0, auth_1.auth)("VENDOR"), cupon_controller_1.CuponController.createCupon);
router.get("/get-cupon/:id", (0, auth_1.auth)("CUSTOMER", "VENDOR"), cupon_controller_1.CuponController.getShopCupon);
exports.CuponRouter = router;