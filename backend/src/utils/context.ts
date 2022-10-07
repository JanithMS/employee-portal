import { Request, Response } from "express";
import User from "../entities/User";

interface MyContext {
  req: Request;
  res: Response;
  user: User;
}

export default MyContext;
