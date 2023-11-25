import { Schema } from "mongoose";

export interface IEntity {
  _id: string;
  createdAt: number;
  updatedAt: number;
}

export interface IReference {
  name: string;
  _id: string;
}

export const Reference = new Schema<IReference>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
});
