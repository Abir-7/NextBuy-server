import { Router } from "express";
import { CategoryController } from "./category.controller";
import { auth } from "../../middleware/auth/auth";

const router = Router();
router.post(
  "/create-category",
  auth("ADMIN"),
  CategoryController.createCategory
);
router.get("/", CategoryController.getAllCategory);
export const CategoryRouter = router;
