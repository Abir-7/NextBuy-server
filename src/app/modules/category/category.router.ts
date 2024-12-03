import { Router } from "express";
import { CategoryController } from "./category.controller";
import { auth } from "../../middleware/auth/auth";

const router = Router();
router.post(
  "/create-category",
  auth("CUSTOMER"),
  CategoryController.createCategory
);
export const CategoryRouter = router;
