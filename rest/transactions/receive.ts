import { Request, Response } from "express";
import * as yup from "yup";
import { UserDoc, UsersModel } from "../../models/user";
import { calcFee, now } from "../../utils";
import { TransactionsModel } from "../../models/transaction";

function validate(req: Request, res: Response) {
  try {
    const validationSchema = yup.object({
      src: yup.string().required(),
      amount: yup.number().required(),
    });
    const result = validationSchema.validateSync(req.body, { abortEarly: false });
    return result;
  } catch (err) {
    const { inner } = err as yup.ValidationError;
    res.status(400).send(inner.map((item) => ({ path: item.path, message: item.message })));
  }
}

export default async function receive(req: Request, res: Response) {
  const { user: dst } = req as Request & { user: UserDoc };
  const body = validate(req, res);
  if (!body) {
    return;
  }
  const { src, amount } = body;
  const fee = calcFee(amount);
  const srcUser = await UsersModel.findById(src);
  if (!srcUser) {
    res.status(404).send({ message: "destination user not found" });
    return;
  }

  const transaction = await TransactionsModel.create({
    src: { _id: srcUser._id, name: srcUser.name },
    dst: { _id: dst._id, name: dst.name },
    amount,
    fee,
    status: "pending",
    createdAt: now(),
    updatedAt: now(),
    executedAt: now(),
  });

  res.send(transaction);
}
