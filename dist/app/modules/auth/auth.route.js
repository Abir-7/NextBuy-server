"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
router.post("/user-login", auth_controller_1.AuthController.userLogin);
exports.AuthRouter = router;
