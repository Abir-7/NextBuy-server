import { Router } from "express";
import { ShopController } from "./shop.controller";
import { auth } from "../../middleware/auth/auth";

const router = Router();
router.post("/create-shop", auth("VENDOR"), ShopController.createShop);

router.get("/", auth("VENDOR"), ShopController.getVendorShop);
export const ShopRouter = router;
