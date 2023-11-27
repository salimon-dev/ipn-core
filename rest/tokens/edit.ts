import { Request, Response } from "express";
import * as yup from "yup";
import { UserDoc } from "../../models/user";
import { TokensModel } from "../../models/token";
import { now } from "../../utils";

function validate(req: Request, res: Response) {
  try {
    const validationSchema = yup.object({
      entity: yup.string().optional(),
      value: yup.string().optional(),
      type: yup.string().optional(),
      description: yup.string().optional(),
    });
    const result = validationSchema.validateSync(req.body, { abortEarly: false });
    return result;
  } catch (err) {
    const { inner } = err as yup.ValidationError;
    res.status(400).send(inner.map((item) => ({ path: item.path, message: item.message })));
  }
}

export default async function edit(req: Request, res: Response) {
  const { user } = req as Request & { user: UserDoc };
  const { id } = req.params as { id: string };
  const body = validate(req, res);
  if (!body) {
    return;
  }
  const { entity, value, description, type } = body;
  const token = await TokensModel.findById(id);
  if (!token) {
    res.status(404).send({ message: "token not found" });
    return;
  }
  token.set({ ...body, updatedAt: now() });
  res.send(token);
}
