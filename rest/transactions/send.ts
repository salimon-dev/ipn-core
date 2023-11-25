import { Request, Response } from "express";
import * as yup from "yup";
import { UserDoc, UsersModel } from "../../models/user";
import { calcFee, now } from "../../utils";
import { TransactionsModel } from "../../models/transaction";
function validate(req: Request, res: Response) {
  try {
    const validationSchema = yup.object({
      dst: yup.string().required(),
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
  const { dst, amount } = body;
  const fee = calcFee(amount);
  const total = fee + amount;
  if (src.balance < total) {
    res.status(402).send({
      message: "not enough credit.",
    });
    return;
  }
  const dstUser = await UsersModel.findById(dst);
  if (!dstUser) {
    res.status(404).send({ message: "destination user not found" });
    return;
  }
  dstUser.balance += amount;
  await dstUser.save();

  src.balance -= total;
  await src.save();

  const transaction = await TransactionsModel.create({
    src: { _id: src._id, name: src.name },
    dst: { _id: src._id, name: src.name },
    amount,
    fee,
    status: "done",
    createdAt: now(),
    updatedAt: now(),
    executedAt: now(),
  });

  res.send(transaction);
}
