import { Router } from "express";
import { auth } from "../../middleware/auth/auth";
import { CuponController } from "./cupon.controller";

const router = Router();

router.post("/create-cupon", auth("VENDOR"), CuponController.createCupon);

router.get(
  "/get-cupon/:id",
  auth("CUSTOMER", "VENDOR"),
  CuponController.getShopCupon
);

export const CuponRouter = router;
