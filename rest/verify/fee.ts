import { Request, Response } from "express";
import * as yup from "yup";
import { UsersModel } from "../../models/user";
import { calcFee } from "../../utils";
function validate(req: Request, res: Response) {
  try {
    const validationSchema = yup.object({ amount: yup.number().required() });
    const result = validationSchema.validateSync(req.body, { abortEarly: true });
    return result;
  } catch (err) {
    const { inner } = err as yup.ValidationError;
    res.status(400).send(inner.map((item) => ({ path: item.path, message: item.message })));
  }
}
export default async function fee(req: Request, res: Response) {
  const body = validate(req, res);
  if (!body) return;
  const { amount } = body;
  const fee = calcFee(amount);
  res.send({
    amount,
    fee,
    total: amount + fee,
  });
}
