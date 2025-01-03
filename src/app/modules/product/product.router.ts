import { Router } from "express";

import { auth } from "../../middleware/auth/auth";
import { ProductController } from "./product.controller";

const router = Router();
router.post("/add-product", auth("VENDOR"), ProductController.addProduct);
router.post("/clone-product", auth("VENDOR"), ProductController.cloneProduct);
router.get("/", ProductController.allProduct);
router.get("/search", ProductController.searchProduct);
router.post("/flash-sale", ProductController.flashProduct);
router.get("/:id", ProductController.singleProduct);

router.patch("/:id", auth("VENDOR"), ProductController.updateProduct);
router.delete("/:id", auth("VENDOR"), ProductController.deleteProduct);

// router.get("/", auth("VENDOR"), ShopController.getVendorShop);
export const ProductRouter = router;
