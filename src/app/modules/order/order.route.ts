import { Router } from "express";
import { auth } from "../../middleware/auth/auth";
import { OrderController } from "./order.controller";

const router = Router();
router.get(
  "/single-order/:id",
  auth("CUSTOMER", "ADMIN", "VENDOR"),
  OrderController.getSingleOrder
);
router.get(
  "/my-order",
  auth("CUSTOMER"),
  OrderController.getSingleCustomerAllOrder
);

router.post("/make-payment", auth("CUSTOMER"), OrderController.orderProduct);
export const OrderRouter = router;
