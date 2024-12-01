import { Response } from "express";

interface IResponseData<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

const sendResponse = <T>(res: Response, data: IResponseData<T>) => {
  res.status(data.statusCode).send({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
  });
};

export default sendResponse;
