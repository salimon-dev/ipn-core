import { Document, Schema, model } from "mongoose";
import { IEntity, IReference, Reference } from "./common";

export interface IToken extends IEntity {
  entity: string;
  user: IReference;
  value: string;
  type: string;
  description: string;
}

const TokenSchema = new Schema<IToken>({
  entity: { type: String, required: true },
  user: { type: Reference, required: true },
  value: { type: String, required: true },
  type: { type: String, required: true },
  createdAt: { type: Number, required: true },
  updatedAt: { type: Number, required: true },
});

export const TokensModel = model<IToken>("token", TokenSchema);
export type TokenDoc = IToken & Document;
