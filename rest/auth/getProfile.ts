import { Request, Response } from "express";
import { UserDoc } from "../../models/user";

export default async function getProfile(req: Request, res: Response) {
  const { user } = req as Request & { user: UserDoc };
  res.send(user);
}
