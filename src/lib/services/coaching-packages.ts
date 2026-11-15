import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { CoachingPackage, type ICoachingPackage } from "@/models/CoachingPackage";
import { PACKAGES } from "@/config/site-content";

export interface PackageInput {
  nameAr: string;
  nameEn: string;
  taglineAr?: string;
  taglineEn?: string;
  months: number;
  price: number;
  originalPrice?: number | null;
  /** One feature per line. */
  featuresAr: string[];
  featuresEn: string[];
  popular: boolean;
  isActive: boolean;
}

/** Plain, serializable package for client components. */
export interface PackageDTO {
  id: string;
  name: { ar: string; en: string };
  tagline: { ar: string; en: string };
  months: number;
  price: number;
  originalPrice: number | null;
  features: { ar: string; en: string }[];
  popular: boolean;
  isActive: boolean;
  sortOrder: number;
}

export function toPackageDTO(p: ICoachingPackage): PackageDTO {
  return {
    id: String(p._id),
    name: { ar: p.name?.ar ?? "", en: p.name?.en ?? "" },
    tagline: { ar: p.tagline?.ar ?? "", en: p.tagline?.en ?? "" },
    months: p.months,
    price: p.price,
    originalPrice: p.originalPrice != null && p.originalPrice > p.price ? p.originalPrice : null,
    features: (p.features ?? []).map((f) => ({ ar: f.ar ?? "", en: f.en ?? "" })),
    popular: Boolean(p.popular),
    isActive: Boolean(p.isActive),
    sortOrder: p.sortOrder ?? 0,
  };
}

/**
 * Seeds the trainer's starting packages (from site-content) the first time a
 * coach has none. Safe to call on every request: it is a no-op afterwards.
 */
export async function ensureDefaultPackages(coachId: string): Promise<void> {
  await connectToDatabase();
  const coach = new Types.ObjectId(coachId);
  if (await CoachingPackage.exists({ coach })) return;
  await CoachingPackage.insertMany(
    PACKAGES.map((p, i) => ({
      coach,
      key: p.id,
      name: p.duration,
      tagline: p.tagline,
      // VIP has no fixed term on the old site; it is sold month by month.
      months: p.months ?? 1,
      price: p.price,
      originalPrice: p.originalPrice,
      features: p.features,
      popular: Boolean(p.popular),
      isActive: true,
      sortOrder: i,
    })),
  );
}

export async function listPackages(coachId: string, opts: { activeOnly?: boolean } = {}): Promise<PackageDTO[]> {
  await connectToDatabase();
  if (!Types.ObjectId.isValid(coachId)) return [];
  const filter: Record<string, unknown> = { coach: new Types.ObjectId(coachId) };
  if (opts.activeOnly) filter.isActive = true;
  const docs = await CoachingPackage.find(filter).sort({ sortOrder: 1, createdAt: 1 }).lean();
  return docs.map((d) => toPackageDTO(d as ICoachingPackage));
}

/** An active package that belongs to this coach, or null. */
export async function getActivePackage(coachId: string, packageId: string): Promise<PackageDTO | null> {
  await connectToDatabase();
  if (!Types.ObjectId.isValid(packageId)) return null;
  const doc = await CoachingPackage.findOne({
    _id: packageId,
    coach: new Types.ObjectId(coachId),
    isActive: true,
  }).lean();
  return doc ? toPackageDTO(doc as ICoachingPackage) : null;
}

function toDoc(input: PackageInput) {
  const len = Math.max(input.featuresAr.length, input.featuresEn.length);
  const features = Array.from({ length: len }, (_, i) => ({
    ar: input.featuresAr[i] ?? "",
    en: input.featuresEn[i] ?? "",
  })).filter((f) => f.ar || f.en);
  return {
    name: { ar: input.nameAr, en: input.nameEn || input.nameAr },
    tagline: { ar: input.taglineAr ?? "", en: input.taglineEn ?? "" },
    months: input.months,
    price: input.price,
    originalPrice: input.originalPrice && input.originalPrice > input.price ? input.originalPrice : null,
    features,
    popular: input.popular,
    isActive: input.isActive,
  };
}

/** Only one package is highlighted as "most chosen" at a time. */
async function clearOtherPopular(coachId: string, exceptId: string) {
  await CoachingPackage.updateMany(
    { coach: new Types.ObjectId(coachId), _id: { $ne: new Types.ObjectId(exceptId) } },
    { $set: { popular: false } },
  );
}

export async function createPackage(coachId: string, input: PackageInput): Promise<string> {
  await connectToDatabase();
  const coach = new Types.ObjectId(coachId);
  const last = await CoachingPackage.findOne({ coach }).sort({ sortOrder: -1 }).select("sortOrder").lean();
  const doc = await CoachingPackage.create({ coach, ...toDoc(input), sortOrder: (last?.sortOrder ?? -1) + 1 });
  if (input.popular) await clearOtherPopular(coachId, String(doc._id));
  return String(doc._id);
}

export async function updatePackage(coachId: string, packageId: string, input: PackageInput): Promise<boolean> {
  await connectToDatabase();
  if (!Types.ObjectId.isValid(packageId)) return false;
  const res = await CoachingPackage.updateOne(
    { _id: packageId, coach: new Types.ObjectId(coachId) },
    { $set: toDoc(input) },
  );
  if (res.matchedCount && input.popular) await clearOtherPopular(coachId, packageId);
  return res.matchedCount > 0;
}

export async function deletePackage(coachId: string, packageId: string): Promise<boolean> {
  await connectToDatabase();
  if (!Types.ObjectId.isValid(packageId)) return false;
  const res = await CoachingPackage.deleteOne({ _id: packageId, coach: new Types.ObjectId(coachId) });
  return res.deletedCount > 0;
}

/** Moves a package one step up or down in the display order. */
export async function movePackage(coachId: string, packageId: string, direction: -1 | 1): Promise<void> {
  await connectToDatabase();
  const coach = new Types.ObjectId(coachId);
  const all = await CoachingPackage.find({ coach }).sort({ sortOrder: 1, createdAt: 1 }).select("_id").lean();
  const ids = all.map((d) => String(d._id));
  const i = ids.indexOf(packageId);
  const j = i + direction;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  await CoachingPackage.bulkWrite(
    ids.map((id, sortOrder) => ({
      updateOne: { filter: { _id: new Types.ObjectId(id), coach }, update: { $set: { sortOrder } } },
    })),
  );
}
