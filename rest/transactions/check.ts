import { Request, Response } from "express";
import * as yup from "yup";
import { UserDoc, UsersModel } from "../../models/user";
import { calcFee } from "../../utils";
function validate(req: Request, res: Response) {
  try {
    const validationSchema = yup.object({
      nickName: yup.string().required(),
      amount: yup.number().required(),
    });
    const result = validationSchema.validateSync(req.body, { abortEarly: false });
    return result;
  } catch (err) {
    const { inner } = err as yup.ValidationError;
    res.status(400).send(inner.map((item) => ({ path: item.path, message: item.message })));
  }
}

export default async function send(req: Request, res: Response) {
  const { user: src } = req as Request & { user: UserDoc };
  const body = validate(req, res);
  if (!body) {
    return;
  }
  const { nickName, amount } = body;
  const fee = calcFee(amount);
  const total = fee + amount;
  if (src.balance < total) {
    res.status(402).send({
      message: "not enough credit.",
    });
    return;
  }
  const dstUser = await UsersModel.findOne({ nickName });
  if (!dstUser) {
    res.status(404).send({ message: "user not found" });
    return;
  }

  res.send({ dstId: dstUser._id, amount, fee, total });
}
