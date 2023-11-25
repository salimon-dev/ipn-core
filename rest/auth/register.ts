import { Request, Response } from "express";
import * as yup from "yup";
import { UsersModel } from "../../models/user";
import { generateJWT, md5, now } from "../../utils";
function validate(req: Request, res: Response) {
  try {
    const validationSchema = yup.object({
      name: yup.string().required(),
      nickName: yup.string().required(),
      avatar: yup.string().optional().default("default"),
      password: yup.string().required(),
    });
    const result = validationSchema.validateSync(req.body, { abortEarly: false });
    return result;
  } catch (err) {
    const { inner } = err as yup.ValidationError;
    res.status(400).send(inner.map((item) => ({ path: item.path, message: item.message })));
  }
}

export default async function register(req: Request, res: Response) {
  const body = validate(req, res);
  if (!body) return;
  const { name, nickName, password, avatar } = body;

  const user = await UsersModel.create({
    name,
    nickName,
    password: md5(password),
    avatar,
    createdAt: now(),
    updatedAt: now(),
  });

  const token = generateJWT(`${user._id}`);
  const expiresAt = parseInt(process.env["TOKEN_AGE"] || "3600") + now();
  res.send({
    user,
    token,
    expiresAt,
  });
}
