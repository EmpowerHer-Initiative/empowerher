import type { inferRouterOutputs } from "@trpc/server";

import {
  oneTimeProducts,
  plans,
  type PlanKey,
  type ProductKey,
} from "@/config/plans";
import type { paymentsRouter } from "@/services/trpc/routers/payments";

import { useGetCustomerState } from "./use-payments";

type CustomerState = inferRouterOutputs<
  typeof paymentsRouter
>["getCustomerState"];
type PaidOrder = CustomerState["paidOrders"][number];
type ActiveSubscription = CustomerState["activeSubscriptions"][number];

type PlanEntry = {
  name: string;
  monthlyProductId: string;
  yearlyProductId: string;
};
type ProductEntry = { name: string; productId: string };

const plansRecord = plans as Record<string, PlanEntry>;
const productsRecord = oneTimeProducts as Record<string, ProductEntry>;

function matchesPlan(plan: PlanEntry | undefined, productId: string | null) {
  if (!plan || !productId) return false;
  return (
    plan.monthlyProductId === productId || plan.yearlyProductId === productId
  );
}

export function useAccess() {
  const { data, isPending, isError, error } = useGetCustomerState();

  const activeSub: ActiveSubscription | null =
    data?.activeSubscriptions?.[0] ?? null;
  const currentProductId = data?.currentProductId ?? null;
  const paidOrders: PaidOrder[] = data?.paidOrders ?? [];
  const planKeys = Object.keys(plansRecord);

  return {
    data,
    isPending,
    isError,
    error,

    /** Exact plan match by key (matches both monthly and yearly) */
    hasPlan: (key: PlanKey) =>
      matchesPlan(plansRecord[key as string], currentProductId),

    /** Exact plan match by productId */
    hasPlanByProductId: (productId: string) => currentProductId === productId,

    /** Plan or higher (key order = price order from sync script) */
    hasPlanOrHigher: (key: PlanKey) => {
      if (!currentProductId) return false;
      const requiredIndex = planKeys.indexOf(key as string);
      const currentIndex = planKeys.findIndex((k) =>
        matchesPlan(plansRecord[k], currentProductId)
      );
      return currentIndex >= 0 && currentIndex >= requiredIndex;
    },

    /** Has any active subscription */
    hasSubscription: !!activeSub,

    /** Active subscription object */
    activeSubscription: activeSub,

    /** Current subscription's productId */
    currentProductId,

    /** One-time purchase check by key */
    hasProduct: (key: ProductKey) =>
      paidOrders.some(
        (o) => o.productId === productsRecord[key as string]?.productId
      ),

    /** One-time purchase check by productId */
    hasProductByProductId: (productId: string) =>
      paidOrders.some((o) => o.productId === productId),

    /** Get productIds for a plan */
    getPlanProductIds: (key: PlanKey) => {
      const plan = plansRecord[key as string];
      return plan
        ? { monthly: plan.monthlyProductId, yearly: plan.yearlyProductId }
        : { monthly: "", yearly: "" };
    },

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
