import jwt from "jsonwebtoken";

export const tokenGenerator = (data: { userEmail: string; role: string }) => {
  const token = jwt.sign(data, "secret", { expiresIn: "30d" });
  return token;
};
