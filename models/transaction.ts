import { Document, Schema, model } from "mongoose";
import { IEntity, IReference, Reference } from "./common";

export interface ITransaction extends IEntity {
  src: IReference;
  dst: IReference;
  status: "done" | "pending" | "canceled";
  amount: number;
  fee: number;
  executedAt: number;
}

const TransactionSchema = new Schema<ITransaction>({
  src: { type: Reference, required: true },
  dst: { type: Reference, required: true },
  status: { type: String, required: true },
  amount: { type: Number, required: true },
  fee: { type: Number, required: true },
  executedAt: { type: Number, required: true },
  createdAt: { type: Number, required: true },
  updatedAt: { type: Number, required: true },
});

export const TransactionsModel = model<ITransaction>("transaction", TransactionSchema);
export type TransactionDoc = ITransaction & Document;
