import { Schema, model, models, type Model } from "mongoose";

interface IRateLimit {
  _id: string;
  attempts: number;
  expiresAt: Date;
}

const RateLimitSchema = new Schema<IRateLimit>(
  {
    _id: { type: String, required: true },
    attempts: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
  },
  { versionKey: false, collection: "rate_limits" },
);

RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RateLimit: Model<IRateLimit> =
  (models.RateLimit as Model<IRateLimit>) || model<IRateLimit>("RateLimit", RateLimitSchema);
