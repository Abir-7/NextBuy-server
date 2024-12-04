"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
const cors_1 = __importDefault(require("cors"));
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const noRoute_1 = __importDefault(require("./app/utils/noRoute"));
const routes_1 = __importDefault(require("./app/routes"));
// CORS options
const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use(globalErrorHandler_1.default);
app.use(noRoute_1.default);
exports.default = app;
