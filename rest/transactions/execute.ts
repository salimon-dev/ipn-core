import { Request, Response } from "express";
import * as yup from "yup";
import { UserDoc, UsersModel } from "../../models/user";
import { TransactionsModel } from "../../models/transaction";

function validate(req: Request, res: Response) {
  try {
    const validationSchema = yup.object({
      transactionId: yup.string().required(),
      action: yup.string().required().oneOf(["accept", "cancel"]),
    });
    const result = validationSchema.validateSync(req.body, { abortEarly: false });
    return result;
  } catch (err) {
    const { inner } = err as yup.ValidationError;
    res.status(400).send(inner.map((item) => ({ path: item.path, message: item.message })));
  }
}

export default async function execute(req: Request, res: Response) {
  const { user: srcUser } = req as Request & { user: UserDoc };
  const body = validate(req, res);
  if (!body) {
    return;
  }
  const { transactionId, action } = body;
  const transaction = await TransactionsModel.findById(transactionId);
  if (!transaction || transaction.src._id !== srcUser._id.toString()) {
    res.status(404).send({ message: "transaction not found" });
    return;
  }
  const dstUser = await UsersModel.findById(transaction.dst._id);
  if (!dstUser) {
    res.status(402).send({ message: "transaction holder is invalid" });
    return;
  }
  switch (action) {
    case "accept": {
      const total = transaction.fee + transaction.amount;
      if (total > srcUser.balance) {
        res.status(402).send({ message: "transaction holder does not have enough credits" });
        return;
      } else {
        srcUser.balance -= total;
        await srcUser.save();

        dstUser.balance += transaction.amount;
        await dstUser.save();

        transaction.status = "done";
        await transaction.save();

        res.send(transaction);
        return;
      }
    }
    case "cancel": {
      transaction.status = "canceled";
      await transaction.save();
      res.send(transaction);
      return;
    }
  }
}
