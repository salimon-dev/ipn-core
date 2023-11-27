import { Request, Response } from "express";
import { SessionsModel } from "../../models/session";

export default async function destroy(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const session = await SessionsModel.findById(id);
  if (!session) {
    res.status(404).send({ message: "session not found." });
    return;
  }
  await session.deleteOne();
  res.send(session);
}
