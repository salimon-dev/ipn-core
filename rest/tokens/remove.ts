import { Request, Response } from "express";
import * as yup from "yup";
import { UserDoc } from "../../models/user";
import { TokensModel } from "../../models/token";
import { now } from "../../utils";

export default async function remove(req: Request, res: Response) {
  const { user } = req as Request & { user: UserDoc };
  const { id } = req.params as { id: string };
  const token = await TokensModel.findById(id);
  if (!token) {
    res.status(404).send({ message: "token not found" });
    return;
  }
  await token.deleteOne();
  res.send(token);
}
