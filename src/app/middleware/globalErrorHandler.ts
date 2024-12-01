import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = 500;
  const message = "Something Went Wrong";
  res.status(statusCode).send({
    success: false,
    statusCode,
    message,
    err,
  });
};

export default errorHandler;
