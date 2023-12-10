import { Request, Response } from "express";
import * as yup from "yup";
import { UsersModel } from "../../models/user";
function validate(req: Request, res: Response) {
  try {
    const validationSchema = yup.object({ name: yup.string().required() });
    const result = validationSchema.validateSync(req.body, { abortEarly: true });
    return result;
  } catch (err) {
    const { inner } = err as yup.ValidationError;
    res.status(400).send(inner.map((item) => ({ path: item.path, message: item.message })));
  }
}
export default async function user(req: Request, res: Response) {
  const body = validate(req, res);
  if (!body) return;
  const { name } = body;
  const user = await UsersModel.findOne({ name });
  if (!user) {
    res.send({ ok: false });
    return;
  }
  // TODO: only send public fields
  res.send({ ok: true, user });
}
