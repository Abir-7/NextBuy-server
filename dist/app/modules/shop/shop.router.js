"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopRouter = void 0;
const express_1 = require("express");
const shop_controller_1 = require("./shop.controller");
const auth_1 = require("../../middleware/auth/auth");
const router = (0, express_1.Router)();
router.post("/create-shop", (0, auth_1.auth)("VENDOR"), shop_controller_1.ShopController.createShop);
router.get("/", (0, auth_1.auth)("VENDOR"), shop_controller_1.ShopController.getVendorShop);
router.get("/get-all-shop", shop_controller_1.ShopController.getAllVendorShop);
router.get("/get-single-shop/:id", shop_controller_1.ShopController.getSingleVendorShop);
router.get("/:id", (0, auth_1.auth)("VENDOR"), shop_controller_1.ShopController.getVendorSingleShop);
router.patch("/block-shop/:id", (0, auth_1.auth)("ADMIN", "SUPERADMIN"), shop_controller_1.ShopController.blockShop);
exports.ShopRouter = router;
