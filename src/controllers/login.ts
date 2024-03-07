import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("please provide email and password");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError("Invalid Credentials");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid Credentials");
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
  } catch (error) {
    next(error);
  }
};

export default login;
