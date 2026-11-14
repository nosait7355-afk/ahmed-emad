import { redirect } from "next/navigation";

/**
 * Single-trainer mode: coach accounts are permanent and managed by the super
 * admin, so coaches have no subscription to view or renew.
 */
export default function CoachSubscriptionPage() {
  redirect("/coach");
}
