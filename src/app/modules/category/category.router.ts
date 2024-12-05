import { Router } from "express";
import { CategoryController } from "./category.controller";
import { auth } from "../../middleware/auth/auth";

const router = Router();
router.post(
  "/create-category",
  auth("ADMIN", "SUPERADMIN"),
  CategoryController.createCategory
);
router.patch(
  "/:id",
  auth("ADMIN", "SUPERADMIN"),
  CategoryController.updateCategory
);
router.delete(
  "/:id",
  auth("ADMIN", "SUPERADMIN"),
  CategoryController.deleteCategory
);

router.get("/", CategoryController.getAllCategory);
export const CategoryRouter = router;
