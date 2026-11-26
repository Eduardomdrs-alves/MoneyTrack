import { Schema, model, models, type Model, type Types } from "mongoose";
import type { TransactionType } from "@/types";

export interface ITransaction {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  category: Types.ObjectId;
  description: string;
  amount: number;
  type: TransactionType;
  date: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String, required: true, trim: true, maxlength: 100 },
    amount: { type: Number, required: true, min: 0.01 },
    type: { type: String, enum: ["income", "expense"], required: true },
    date: { type: Date, required: true },
    notes: { type: String, default: "", trim: true, maxlength: 500 },
  },
  { timestamps: true },
);

// Índice composto: as consultas sempre filtram por usuário e ordenam/filtram por data
TransactionSchema.index({ userId: 1, date: -1 });

export const Transaction: Model<ITransaction> =
  (models.Transaction as Model<ITransaction>) ||
  model<ITransaction>("Transaction", TransactionSchema);
