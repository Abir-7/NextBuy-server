import { Router } from "express";
import { UserController } from "./user.controller";
import { auth } from "../../middleware/auth/auth";

const router = Router();
router.post("/create-user", UserController.createUser);
router.get("/", auth("SUPERADMIN"), UserController.getAllUser);
router.patch(
  "/block/:id",
  auth("SUPERADMIN", "ADMIN"),
  UserController.blockUser
);
router.patch(
  "/delete/:id",
  auth("SUPERADMIN", "ADMIN"),
  UserController.deleteUser
);
export const UserRouter = router;
