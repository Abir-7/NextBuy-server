import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { auth } from "../../middleware/auth/auth";

const router = Router();
router.get("/user", auth("CUSTOMER"), DashboardController.getUserDashboard);
router.get(
  "/admin",
  auth("ADMIN", "SUPERADMIN"),
  DashboardController.getAdminDashboard
);
router.get("/vendor", auth("VENDOR"), DashboardController.getVendorDashboard);
export const DashboardRouter = router;
