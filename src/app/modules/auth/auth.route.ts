import { Router } from "express";

import { AuthController } from "./auth.controller";

const router = Router();
router.post("/user-login", AuthController.userLogin);
export const AuthRouter = router;
