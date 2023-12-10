import { Request, Response } from "express";
import * as yup from "yup";
import { UserDoc } from "../../models/user";
import { md5 } from "../../utils";
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

export default async function editProfile(req: Request, res: Response) {
  const { user } = req as Request & { user: UserDoc };
  const body = validate(req, res);
  if (!body) return;
  const { name, password, nickName, avatar } = body;

  if (name) {
    user.name = name;
  }
  if (nickName) {
    user.nickName = nickName;
  }
  if (avatar) {
    user.avatar = avatar;
  }
  if (password) {
    user.password = md5(password);
  }
  await user.save();
  res.send(user.toJSON());
}
