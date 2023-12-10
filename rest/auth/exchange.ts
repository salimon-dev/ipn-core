import { Request, Response } from "express";
import * as yup from "yup";
import { UserDoc } from "../../models/user";
import { generateJWT, md5, now } from "../../utils";
function validate(req: Request, res: Response) {
  try {
    const validationSchema = yup.object({
      avatar: yup.string().optional(),
      nickName: yup.string().optional(),
      name: yup.string().optional(),
      password: yup.string().optional(),
    });
    const result = validationSchema.validateSync(req.body, { abortEarly: false });
    return result;
  } catch (err) {
    const { inner } = err as yup.ValidationError;
    res.status(400).send(inner.map((item) => ({ path: item.path, message: item.message })));
  }
}

export default async function exchange(req: Request, res: Response) {
  const { user } = req as Request & { user: UserDoc };
  const token = generateJWT(`${user._id}`);
  const expiresAt = parseInt(process.env["TOKEN_AGE"] || "3600") + now();
  res.send({
    user,
    token,
    expiresAt,
  });
}
