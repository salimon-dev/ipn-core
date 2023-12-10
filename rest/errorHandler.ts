import { Request, Response } from "express";

export default async function errorHandler(
  req: Request,
  res: Response,
  method: (req: Request, res: Response) => void
) {
  try {
    return await method(req, res);
  } catch (err) {
    const error = err as Error;
    console.error(`[Error] {${req.method}} ${req.path}: (${error.message})`);
    res.status(500).send({ message: "internal error" });
    return;
  }
}
