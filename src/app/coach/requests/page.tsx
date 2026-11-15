import { requireCoachArea } from "@/lib/auth/session";
import { canManageClients } from "@/lib/permissions/team";
import { coachCanWrite } from "@/lib/permissions";
import { listSignupRequests } from "@/lib/services/client-signup";
import { listPackages } from "@/lib/services/coaching-packages";
import { RequestsView, type SignupRequestRow } from "./requests-view";
import type { ClientGoal, Gender } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function CoachSignupRequestsPage() {
  const ctx = await requireCoachArea(canManageClients);
  const [raw, packages] = await Promise.all([
    listSignupRequests(ctx.coachId),
    listPackages(ctx.coachId, { activeOnly: true }),
  ]);

  const requests: SignupRequestRow[] = raw.map((c) => {
    const cp = (c.clientProfile ?? {}) as {
      gender?: Gender;
      age?: number;
      height?: number;
      startWeight?: number;
      goal?: ClientGoal;
      signupAt?: string;
      requestedPackage?: { packageId?: string; name?: { ar?: string; en?: string }; price?: number; months?: number };
    };
    const rp = cp.requestedPackage;
    return {
      id: String(c._id),
      name: c.name,
      username: c.username,
      phone: c.phone ?? "",
      email: c.email ?? "",
      gender: cp.gender,
      age: cp.age,
      height: cp.height,
      weight: cp.startWeight,
      goal: cp.goal,
      requestedAt: String(cp.signupAt ?? c.createdAt),
      package: rp
        ? {
            id: rp.packageId ? String(rp.packageId) : "",
            name: { ar: rp.name?.ar ?? "", en: rp.name?.en ?? "" },
            price: rp.price ?? 0,
            months: rp.months ?? 1,
          }
        : null,
    };
  });

  return <RequestsView requests={requests} packages={packages} canWrite={coachCanWrite(ctx.status)} />;
}
