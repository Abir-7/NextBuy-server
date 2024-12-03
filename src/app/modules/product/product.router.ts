import { Router } from "express";

import { auth } from "../../middleware/auth/auth";
import { ProductController } from "./product.controller";

const router = Router();
router.post("/add-product", auth("VENDOR"), ProductController.addProduct);
router.patch("/:id", auth("VENDOR"), ProductController.updateProduct);
router.delete("/:id", auth("VENDOR"), ProductController.deleteProduct);

// router.get("/", auth("VENDOR"), ShopController.getVendorShop);
export const ProductRouter = router;
