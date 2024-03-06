import { Request } from "express";
export interface PayloadType {
  userId: string;
  name: string;
}

export interface UserRequest extends Request {
  user?: PayloadType;
}
