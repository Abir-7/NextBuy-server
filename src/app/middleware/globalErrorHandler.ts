import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = 400;
  const message = err?.message || "Something Went Wrong";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    err,
  });
};

export default errorHandler;
