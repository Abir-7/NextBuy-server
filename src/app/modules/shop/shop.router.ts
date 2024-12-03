import { Router } from "express";
import { ShopController } from "./shop.controller";

const router = Router();
router.post("/create-shop", ShopController.createShop);
export const ShopRouter = router;
