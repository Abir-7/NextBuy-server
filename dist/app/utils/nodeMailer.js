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
exports.sendMail = void 0;
// utils/mailer.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("../config");
// Load environment variables
dotenv_1.default.config();
// Create a transporter using environment variables
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: config_1.config.user_email, // Type assertion
        pass: config_1.config.email_pass, // Type assertion
    },
});
// Verify transporter configuration (optional)
transporter.verify(function (error, success) {
    if (error) {
        console.error("Email transporter error:", error);
    }
    else {
        console.log("Email transporter is ready");
    }
});
// Send email utility function
const sendMail = (emailOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { to, subject, text, html } = emailOptions;
    try {
        const info = yield transporter.sendMail({
            from: `"Recipe-World" <${process.env.EMAIL_USER}>`, //
            to,
            subject,
            text,
            html,
        });
        console.log("Email sent: %s", info.messageId);
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
});
exports.sendMail = sendMail;
