import jwt from "jsonwebtoken";
import { config } from "../config";

export const tokenGenerator = (data: { userEmail: string; role: string }) => {
  const token = jwt.sign(data, config.jwt_secrete_key as string, {
    expiresIn: config.jwt_secrete_date,
  });
  return token;
};
