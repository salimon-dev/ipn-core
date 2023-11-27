import { Request, Response } from "express";
import * as yup from "yup";
import { UserDoc } from "../../models/user";
import { TokensModel } from "../../models/token";

function validate(req: Request, res: Response) {
  try {
    const validationSchema = yup.object({
      page: yup.number().optional().default(1),
      pageSize: yup.number().optional().default(15),
    });
    const result = validationSchema.validateSync(req.query, { abortEarly: false });
    return result;
  } catch (err) {
    const { inner } = err as yup.ValidationError;
    res.status(400).send(inner.map((item) => ({ path: item.path, message: item.message })));
  }
}
export default async function search(req: Request, res: Response) {
  const { user } = req as Request & { user: UserDoc };
  const query = validate(req, res);
  if (!query) {
    return;
  }
  const { page, pageSize } = query;

  const skip = (page - 1) * pageSize;
  const limit = pageSize;

  const tokens = await TokensModel.find({
    "user._id": user._id.toString(),
  })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);

  const count = await TokensModel.find({
    "user._id": user._id.toString(),
  }).countDocuments();

  res.send({ data: tokens, count });
}
