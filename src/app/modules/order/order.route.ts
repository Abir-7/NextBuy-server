import { Router } from "express";
import { auth } from "../../middleware/auth/auth";
import { OrderController } from "./order.controller";

const router = Router();

// Customer Routes
router.get(
  "/single-order/:id",
  auth("CUSTOMER", "ADMIN", "SUPERADMIN", "VENDOR"),
  OrderController.getSingleOrder
);

router.get(
  "/my-order",
  auth("CUSTOMER"),
  OrderController.getSingleCustomerAllOrder
);

router.get(
  "/pending-order",
  auth("ADMIN", "SUPERADMIN"),
  OrderController.getPendingOrder
);
router.get(
  "/shop-order/:id",
  auth("VENDOR"),
  OrderController.getSpeceficShopOrder
);

router.post("/make-payment", auth("CUSTOMER"), OrderController.orderProduct);

// Admin and Superadmin Routes
router.get(
  "/all-orders",
  auth("ADMIN", "SUPERADMIN"),
  OrderController.getAllOrder
);

router.patch(
  "/update/:id", // Fixed the missing slash in the path
  auth("ADMIN", "SUPERADMIN"),
  OrderController.updateOrder
);

export const OrderRouter = router;
