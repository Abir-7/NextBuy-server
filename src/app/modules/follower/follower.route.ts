import { Router } from "express";

import { auth } from "../../middleware/auth/auth";
import { FollowerController } from "./follower.controller";

const router = Router();
router.post("/new-follow/:id", auth("CUSTOMER"), FollowerController.followShop);
router.delete(
  "/remove-follow/:id",
  auth("CUSTOMER"),
  FollowerController.unfollowShop
);
export const FollowRouter = router;
