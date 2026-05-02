import {
  oneTimeProducts,
  plans,
  type PlanKey,
  type ProductKey,
} from "@/config/plans";

import { useGetCustomerState } from "./use-payments";

type PlanEntry = { name: string; priceId: string };
const plansRecord = plans as Record<string, PlanEntry>;
const productsRecord = oneTimeProducts as Record<string, PlanEntry>;

export function useAccess() {
  const state = useGetCustomerState();
  const currentPlan = state.data?.currentPlan ?? null;
  const paidOrders = state.data?.paidOrders ?? [];
  const planKeys = Object.keys(plansRecord);

  return {
    ...state,

    /** Exact plan match by key */
    hasPlan: (key: PlanKey) =>
      currentPlan === plansRecord[key as string]?.priceId,

    /** Exact plan match by priceId (for dynamic product iteration) */
    hasPlanByPriceId: (priceId: string) => currentPlan === priceId,

    /** Plan or higher (key order = price order from sync script) */
    hasPlanOrHigher: (key: PlanKey) => {
      if (!currentPlan) return false;
      const requiredIndex = planKeys.indexOf(key as string);
      const currentIndex = planKeys.findIndex(
        (k) => plansRecord[k]?.priceId === currentPlan
      );
      return currentIndex >= 0 && currentIndex >= requiredIndex;
    },

    /** Has any active subscription */
    hasSubscription: !!state.data?.activeSubscription,

    /** Active subscription object */
    activeSubscription: state.data?.activeSubscription ?? null,

    /** Current plan's priceId */
    currentPlanPriceId: currentPlan,

    /** One-time purchase check by key */
    hasProduct: (key: ProductKey) =>
      paidOrders.some(
        (o) => o.priceId === productsRecord[key as string]?.priceId
      ),

    /** One-time purchase check by priceId (for dynamic product iteration) */
    hasProductByPriceId: (priceId: string) =>
      paidOrders.some((o) => o.priceId === priceId),

    /** Get price ID for a plan */
    getPlanPriceId: (key: PlanKey) => plansRecord[key as string]?.priceId ?? "",

    /** Get price ID for a one-time product */
    getProductPriceId: (key: ProductKey) =>
      productsRecord[key as string]?.priceId ?? "",

    /** Get display name for a plan */
    getPlanName: (key: PlanKey) => plansRecord[key as string]?.name ?? "",

    /** Get display name for a one-time product */
    getProductName: (key: ProductKey) =>
      productsRecord[key as string]?.name ?? "",
  };
}
