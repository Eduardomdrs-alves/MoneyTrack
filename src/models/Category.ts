import { Schema, model, models, type Model, type Types } from "mongoose";
import type { TransactionType } from "@/types";

export interface ICategory {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  type: TransactionType;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 40 },
    type: { type: String, enum: ["income", "expense"], required: true },
    color: { type: String, required: true, match: /^#[0-9a-fA-F]{6}$/ },
  },
  { timestamps: true },
);

// Um usuário não pode ter duas categorias com o mesmo nome e tipo
CategorySchema.index({ userId: 1, type: 1, name: 1 }, { unique: true });

export const Category: Model<ICategory> =
  (models.Category as Model<ICategory>) || model<ICategory>("Category", CategorySchema);
