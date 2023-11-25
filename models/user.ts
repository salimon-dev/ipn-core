import { Document, Schema, model } from "mongoose";
import { IEntity } from "./common";

export interface IUser extends IEntity {
  avatar: string;
  name: string;
  nickName: string;
  password: string;
  status: "active" | "inactive";
  balance: number;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  nickName: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: String, required: true },
  balance: { type: Number, required: true },
  createdAt: { type: Number, required: true },
  updatedAt: { type: Number, required: true },
});

export const UsersModel = model<IUser>("user", UserSchema);
export type UserDoc = IUser & Document;
