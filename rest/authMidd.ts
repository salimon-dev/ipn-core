import { NextFunction, Request, Response } from "express";
import { UserDoc, UsersModel } from "../models/user";
import { verifyJWT } from "../utils";

export default async function AuthMidd(req: Request, res: Response, next: NextFunction) {
  const authorization = req.header("Authorization");
  if (!authorization) {
    res.status(401).send({ message: "unauthorized" });
    return;
  }
  const token = authorization.replace("Bearer ", "");
  if (!token) {
    res.status(401).send({ message: "unauthorized" });
    return;
  }
  try {
    const userId = verifyJWT(token);
    const user = await UsersModel.findById(userId);
    if (!user) {
      res.status(401).send({ message: "unauthorized" });
      return;
    }
    (req as Request & { user: UserDoc }).user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "unauthorized" });
  }
}
