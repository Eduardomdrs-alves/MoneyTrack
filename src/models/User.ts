import { Schema, model, models, type Model, type Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  /** Hash bcrypt da senha (nunca a senha em texto puro) */
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // select: false -> a senha não é retornada nas consultas por padrão
    password: { type: String, required: true, select: false },
  },
  { timestamps: true },
);

// `models.User ||` evita recompilar o model durante o Hot Reload
export const User: Model<IUser> = (models.User as Model<IUser>) || model<IUser>("User", UserSchema);
