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
exports.UserController = void 0;
const PickValidField_1 = require("../../utils/PickValidField");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const tryCatch_1 = __importDefault(require("../../utils/tryCatch"));
const user_service_1 = require("./user.service");
const createUser = (0, tryCatch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.createUser(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User Created Successfully",
        data: result,
    });
}));
const getAllUser = (0, tryCatch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationData = (0, PickValidField_1.pickField)(req.query, ["page", "limit", "sort"]);
    const filter = (0, PickValidField_1.pickField)(req.query, ["searchTerm", "isBlocked"]);
    const result = yield user_service_1.UserService.getAllUser(paginationData, filter);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "All user are fetched successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const blockUser = (0, tryCatch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.userBlock(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User Status Changed",
        data: result,
    });
}));
const deleteUser = (0, tryCatch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.userDelete(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User delete status Changed",
        data: result,
    });
}));
const setNewPassword = (0, tryCatch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const result = yield user_service_1.UserService.setUserNewPassword(data === null || data === void 0 ? void 0 : data.token, data === null || data === void 0 ? void 0 : data.password);
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: "Password Updated Successfully",
    });
}));
exports.UserController = {
    createUser,
    getAllUser,
    blockUser,
    deleteUser,
    setNewPassword,
};
