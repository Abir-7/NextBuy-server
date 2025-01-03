import { Router } from "express";
import { UserController } from "./user.controller";
import { auth } from "../../middleware/auth/auth";

const router = Router();
router.post("/create-user", UserController.createUser);
router.get("/", auth("SUPERADMIN"), UserController.getAllUser);
router.get(
  "/user-image",
  auth("CUSTOMER", "ADMIN", "SUPERADMIN", "VENDOR"),
  UserController.userInfo
);
router.patch(
  "/block/:id",
  auth("SUPERADMIN", "ADMIN"),
  UserController.blockUser
);
router.patch("/set-pass", UserController.setNewPassword);
router.patch(
  "/update-pass",
  auth("CUSTOMER", "VENDOR"),
  UserController.changePassword
);
router.patch(
  "/delete/:id",
  auth("SUPERADMIN", "ADMIN"),
  UserController.deleteUser
);

export const UserRouter = router;
