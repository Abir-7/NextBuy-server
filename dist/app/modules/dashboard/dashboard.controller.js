"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const tryCatch_1 = __importDefault(require("../../utils/tryCatch"));
const dashboard_service_1 = require("./dashboard.service");
const getUserDashboard = (0, tryCatch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.user;
    const result = yield dashboard_service_1.DashboardService.getUserDashboard(userData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Dashboard data fetch successfully",
        data: result,
    });
}));
const getAdminDashboard = (0, tryCatch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("ggg");
    const result = yield dashboard_service_1.DashboardService.getAdminDashboard();
    console.log(result);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Dashboard data fetch successfully",
        data: result,
    });
}));
const getVendorDashboard = (0, tryCatch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.user;
    const result = yield dashboard_service_1.DashboardService.getVendorDashboard(userData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Dashboard data fetch successfully",
        data: result,
    });
}));
exports.DashboardController = {
    getUserDashboard,
    getAdminDashboard,
    getVendorDashboard,
};
