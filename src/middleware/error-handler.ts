import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

interface CustomError extends Error {
  statusCode: number;
  errors:
    | mongoose.Error.ValidationError
    | mongoose.Error.ValidationError["errors"];
  code: number;
  keyValue: string;
  value: string;
}

const errorHandleMiddleware = (
  error: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const customError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: error.message || "Something went wrong try again",
  };
  if (error.name === "ValidationError") {
    customError.message = Object.values(error.errors)
      .map((item) => item.message)
      .join(",");
  }
  if (error.code && error.code === 1100) {
    customError.message = `Duplicate values entered for ${Object.keys(
      error.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }
  if (error.name === "CastError") {
    customError.message = `No item found with id : ${error.value}`;
    customError.statusCode = 404;
  }
  return res
    .status(customError.statusCode)
    .json({ message: customError.message });
};

export default errorHandleMiddleware;
