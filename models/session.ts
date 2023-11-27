import { Document, Schema, model } from "mongoose";
import { IEntity, IReference, Reference } from "./common";

export interface ISession extends IEntity {
  spnName: string;
  spnAddress: string;
  description: string;
  user: IReference;
  token: string;
  expiresAt: number;
  status: "active" | "inactive";
}

const SessionSchema = new Schema<ISession>({
  spnName: { type: String, required: true },
  spnAddress: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: Reference, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Number, required: true },
  status: { type: String, required: true },
  createdAt: { type: Number, required: true },
  updatedAt: { type: Number, required: true },
});

export const SessionsModel = model<ISession>("session", SessionSchema);
export type SessionDoc = ISession & Document;
