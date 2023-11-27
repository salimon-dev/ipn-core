import { Request, Response } from "express";
import * as yup from "yup";
import { UserDoc } from "../../models/user";
import { SessionsModel } from "../../models/session";

function validate(req: Request, res: Response) {
  try {
    const validationSchema = yup.object({
      status: yup.string().required().oneOf(["active", "inactive"]),
    });
    const result = validationSchema.validateSync(req.body, { abortEarly: false });
    return result;
  } catch (err) {
    const { inner } = err as yup.ValidationError;
    res.status(400).send(inner.map((item) => ({ path: item.path, message: item.message })));
  }
}

export default async function updateStatus(req: Request, res: Response) {
  const { user } = req as Request & { user: UserDoc };
  const { id } = req.params as { id: string };
  const body = validate(req, res);
  if (!body) {
    return;
  }
  const session = await SessionsModel.findById(id);
  const { status } = body;
  if (!session) {
    res.status(404).send({ message: "session not found." });
    return;
  }
  session.status = status as "active" | "inactive";
  await session.save();
  res.send(session);
}
