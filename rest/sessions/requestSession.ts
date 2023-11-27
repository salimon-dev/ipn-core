import { Request, Response } from "express";
import * as yup from "yup";
import { UserDoc } from "../../models/user";
import { SessionsModel } from "../../models/session";
import { now } from "../../utils";

function validate(req: Request, res: Response) {
  try {
    const validationSchema = yup.object({
      spnName: yup.string().required(),
      spnAddress: yup.string().required(),
      description: yup.string().required(),
      token: yup.string().required(),
      age: yup
        .number()
        .optional()
        .default(3600 * 24 * 90),
    });
    const result = validationSchema.validateSync(req.body, { abortEarly: false });
    return result;
  } catch (err) {
    const { inner } = err as yup.ValidationError;
    res.status(400).send(inner.map((item) => ({ path: item.path, message: item.message })));
  }
}

export default async function requestSession(req: Request, res: Response) {
  const { user } = req as Request & { user: UserDoc };
  const body = validate(req, res);
  if (!body) {
    return;
  }
  const { spnAddress, spnName, description, token, age } = body;
  const result = await SessionsModel.create({
    spnAddress,
    spnName,
    description,
    token,
    expiresAt: now() + age,
    status: "inactive",
    user: { _id: user._id.toString(), name: user.name },
    createdAt: now(),
    updatedAt: now(),
  });
  res.send(result);
}
