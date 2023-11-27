import { Request, Response } from "express";
import * as yup from "yup";
import { UserDoc } from "../../models/user";
import { TokensModel } from "../../models/token";
import { now } from "../../utils";

function validate(req: Request, res: Response) {
  try {
    const validationSchema = yup.object({
      entity: yup.string().required(),
      value: yup.string().required(),
      type: yup.string().required(),
      description: yup.string().required(),
    });
    const result = validationSchema.validateSync(req.body, { abortEarly: false });
    return result;
  } catch (err) {
    const { inner } = err as yup.ValidationError;
    res.status(400).send(inner.map((item) => ({ path: item.path, message: item.message })));
  }
}

export default async function create(req: Request, res: Response) {
  const { user } = req as Request & { user: UserDoc };
  const body = validate(req, res);
  if (!body) {
    return;
  }
  const { entity, value, description, type } = body;
  const token = await TokensModel.findOne({ entity });
  if (token) {
    res.status(400).send([{ path: "entity", message: "token with current entity exists" }]);
    return;
  }
  const result = await TokensModel.create({
    entity,
    value,
    description,
    type,
    user: { _id: user._id.toString(), name: user.name },
    createdAt: now(),
    updatedAt: now(),
  });
  res.send(result);
}
