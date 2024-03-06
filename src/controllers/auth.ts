import { Request, Response } from "express";
import { Error } from "mongoose";
import { MongoError } from "mongodb";
import { StatusCodes } from "http-status-codes";
import User from "../models/User";

const register = async (req: Request, res: Response) => {
  try {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (error: any) => error.message
      );
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: validationErrors });
    } else if (error instanceof MongoError && error.code === 11000) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "Email already exists" });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "something went wrong please ty again" });
  }
};

export default register;
