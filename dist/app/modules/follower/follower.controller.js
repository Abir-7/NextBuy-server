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
exports.FollowerController = void 0;
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const tryCatch_1 = __importDefault(require("../../utils/tryCatch"));
const follower_service_1 = require("./follower.service");
const followShop = (0, tryCatch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    const result = yield follower_service_1.FollowerService.followShop(id, user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Shop followed successfull",
        data: result,
    });
}));
const unfollowShop = (0, tryCatch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    const result = yield follower_service_1.FollowerService.unfollowShop(id, user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Shop unfollow successfull",
        data: result,
    });
}));
exports.FollowerController = {
    followShop,
    unfollowShop,
};