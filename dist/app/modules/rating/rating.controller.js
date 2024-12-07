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
exports.RatingController = void 0;
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const tryCatch_1 = __importDefault(require("../../utils/tryCatch"));
const rating_service_1 = require("./rating.service");
const PickValidField_1 = require("../../utils/PickValidField");
const addRating = (0, tryCatch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield rating_service_1.RatingService.addRating(req.body.data, user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Rating added Successfully",
        data: result,
    });
}));
const getUserRatingByShop = (0, tryCatch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const paginationData = (0, PickValidField_1.pickField)(req.query, ["page", "limit", "sort"]);
    const result = yield rating_service_1.RatingService.getUserReviewByShop(user, paginationData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Rating is fetched by Shop",
        data: result.data,
        meta: result.meta,
    });
}));
const replyToReview = (0, tryCatch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rating_service_1.RatingService.replyToReview(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Replyed Given.",
        data: result,
    });
}));
exports.RatingController = {
    addRating,
    getUserRatingByShop,
    replyToReview,
};
