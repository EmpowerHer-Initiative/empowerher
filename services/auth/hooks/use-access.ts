import {
  oneTimeProducts,
  plans,
  type PlanKey,
  type ProductKey,
} from "@/config/plans";

import { useGetCustomerState } from "./use-payments";

type PlanEntry = { name: string; productId: string };
const plansRecord = plans as Record<string, PlanEntry>;
const productsRecord = oneTimeProducts as Record<string, PlanEntry>;

export function useAccess() {
  const state = useGetCustomerState();
  const currentProductId = state.data?.currentProductId ?? null;
  const paidOrders = state.data?.paidOrders ?? [];
  const planKeys = Object.keys(plansRecord);

  return {
    ...state,

    /** Exact plan match by key */
    hasPlan: (key: PlanKey) =>
      currentProductId === plansRecord[key as string]?.productId,

    /** Exact plan match by productId (for dynamic product iteration) */
    hasPlanByProductId: (productId: string) => currentProductId === productId,

    /** Plan or higher (key order = price order from sync script) */
    hasPlanOrHigher: (key: PlanKey) => {
      if (!currentProductId) return false;
      const requiredIndex = planKeys.indexOf(key as string);
      const currentIndex = planKeys.findIndex(
        (k) => plansRecord[k]?.productId === currentProductId
      );
      return currentIndex >= 0 && currentIndex >= requiredIndex;
    },

    /** Has any active subscription */
    hasSubscription: !!state.data?.activeSubscription,

    /** Active subscription object */
    activeSubscription: state.data?.activeSubscription ?? null,

    /** Current subscription's productId */
    currentProductId,

    /** One-time purchase check by key */
    hasProduct: (key: ProductKey) =>
      paidOrders.some(
        (o) => o.productId === productsRecord[key as string]?.productId
      ),

    /** One-time purchase check by productId (for dynamic product iteration) */
    hasProductByProductId: (productId: string) =>
      paidOrders.some((o) => o.productId === productId),

    /** Get productId for a plan */
    getPlanProductId: (key: PlanKey) =>
      plansRecord[key as string]?.productId ?? "",

    /** Get productId for a one-time product */
    getProductProductId: (key: ProductKey) =>
      productsRecord[key as string]?.productId ?? "",

    /** Get display name for a plan */
    getPlanName: (key: PlanKey) => plansRecord[key as string]?.name ?? "",

    /** Get display name for a one-time product */
    getProductName: (key: ProductKey) =>
      productsRecord[key as string]?.name ?? "",
  };
}
