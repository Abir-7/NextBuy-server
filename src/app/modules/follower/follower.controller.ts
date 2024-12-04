import { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/tryCatch";
import { FollowerService } from "./follower.service";

const followShop = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user as JwtPayload & { userEmail: string; role: string };
  const result = await FollowerService.followShop(id, user);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Shop followed successfull",
    data: result,
  });
});

const unfollowShop = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user as JwtPayload & { userEmail: string; role: string };
  const result = await FollowerService.unfollowShop(id, user);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Shop unfollow successfull",
    data: result,
  });
});

export const FollowerController = {
  followShop,
  unfollowShop,
};
