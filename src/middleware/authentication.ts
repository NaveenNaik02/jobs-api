import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRequest, PayloadType } from "../types";
import { UnauthenticatedError } from "../errors";

const auth = async (req: UserRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const secret = process.env.JWT_SECRET as string;
    const payload = jwt.verify(token, secret) as PayloadType;
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
};

export default auth;
