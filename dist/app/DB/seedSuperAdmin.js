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
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../client/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../config");
const superUser = {
    email: "superadmin@gmail.com",
    password: "super123", // Ideally, use a hashed password
    role: client_1.USER_ROLE.SUPERADMIN, // Ensure this matches the `USER_ROLE` enum
};
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPass = yield bcrypt_1.default.hash(superUser.password, Number(config_1.config.saltRounds));
    try {
        // Check if a super admin already exists
        const isSuperAdminExists = yield prisma_1.default.user.findFirst({
            where: { role: client_1.USER_ROLE.SUPERADMIN, email: superUser.email },
        });
        // Create super admin if not exists
        if (!isSuperAdminExists) {
            yield prisma_1.default.user.create({
                data: Object.assign(Object.assign({}, superUser), { password: hashedPass }),
            });
        }
        else {
            console.log("Super admin already exists.");
        }
    }
    catch (error) {
        console.error("Error seeding super admin:", error);
    }
});
exports.default = seedSuperAdmin;
