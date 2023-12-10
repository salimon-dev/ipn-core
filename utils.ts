import { createHash } from "crypto";
import jwt from "jsonwebtoken";
export function now() {
  return Math.ceil(Date.now() / 1000);
}

export function md5(value: string) {
  return createHash("md5").update(value).digest("hex");
}

export function generateJWT(data: string) {
  return jwt.sign({ data }, process.env["SECRET_TOKEN"] || "nosecretbecauseyouarestupid", {
    expiresIn: parseInt(process.env["TOKEN_AGE"] || "3600"),
  });
}
export function verifyJWT(data: string) {
  const result = jwt.verify(data, process.env["SECRET_TOKEN"] || "nosecretbecauseyouarestupid") as {
    data: string;
  };
  return result.data;
}

export function calcFee(amount: number) {
  return Math.floor(amount * 0.01);
}
