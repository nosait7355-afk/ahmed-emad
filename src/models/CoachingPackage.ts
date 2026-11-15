import { Schema, model, models, type Model, type Types } from "mongoose";

/**
 * A coaching package the trainer sells to clients (1 month, 3 months, VIP...).
 * Distinct from `Plan`, which is the legacy coach-side SaaS tier.
 *
 * Shown on the public site and the sign-up form; the coach edits them from
 * /coach/packages. Prices are in EGP.
 */
export interface ICoachingPackage {
  _id: Types.ObjectId;
  coach: Types.ObjectId;
  /** Stable slug used for seeding ("1m", "3m", "vip"...). */
  key?: string;
  name: { ar: string; en: string };
  tagline?: { ar: string; en: string };
  /** Whole months of access granted on activation. */
  months: number;
  price: number;
  /** Struck-through "before discount" price. Hidden when not above `price`. */
  originalPrice?: number | null;
  features: { ar: string; en: string }[];
  popular: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const LocalizedString = new Schema(
  { ar: { type: String, default: "", trim: true }, en: { type: String, default: "", trim: true } },
  { _id: false },
);

const CoachingPackageSchema = new Schema<ICoachingPackage>(
  {
    coach: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    key: { type: String, trim: true },
    name: { type: LocalizedString, required: true },
    tagline: { type: LocalizedString },
    months: { type: Number, required: true, min: 1, max: 36 },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0, default: null },
    features: { type: [LocalizedString], default: [] },
    popular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

CoachingPackageSchema.index({ coach: 1, isActive: 1, sortOrder: 1 });

export const CoachingPackage: Model<ICoachingPackage> =
  (models.CoachingPackage as Model<ICoachingPackage>) ||
  model<ICoachingPackage>("CoachingPackage", CoachingPackageSchema);

export default CoachingPackage;
