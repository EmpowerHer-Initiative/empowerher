import { useRouter } from "next/navigation";
import { queryClient, useTRPC } from "@/services/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "../auth-client";

export const useGetCustomerState = () => {
  const trpc = useTRPC();
  return useQuery(trpc.billing.getCustomerState.queryOptions());
};

/**
 * Custom hook for initiating checkout via Stripe
 */
export const useCheckout = () => {
  const router = useRouter();
  const trpc = useTRPC();

  const mutation = useMutation(
    trpc.billing.createCheckout.mutationOptions({
      onSuccess: (data) => {
        if (!data?.url) {
          throw new Error("Failed to create checkout");
        }
        /* eslint-disable-next-line react-hooks/immutability */
        window.location.href = data.url;
      },
      onError: (error, variables) => {
        if (error.data?.code === "UNAUTHORIZED") {
          router.push(
            `/signup?callbackUrl=/checkout&priceIds=${variables.priceIds.join(",")}`
          );
          return;
        }
        toast.error(
          error.message || "Failed to create checkout. Please try again."
        );
      },
    })
  );

  return {
    ...mutation,
    mutate: (
      input: { priceIds: string[]; successUrl?: string; cancelUrl?: string },
      options?: Parameters<typeof mutation.mutate>[1]
    ) => {
      mutation.mutate(
        {
          ...input,
          cancelUrl: input.cancelUrl ?? window.location.href,
        },
        options
      );
    },
  };
};

/**
 * Custom hook for switching subscription plan
 */
export const useSwitchPlan = () => {
  return useMutation({
    mutationFn: async ({
      plan,
      subscriptionId,
    }: {
      plan: string;
      subscriptionId?: string;
    }) => {
      const { data, error } = await authClient.subscription.upgrade({
        plan,
        subscriptionId,
        successUrl: "/settings",
        cancelUrl: "/settings",
      });

      if (error) {
        throw new Error(error.message || error.statusText);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["payments", "getCustomerState"],
      });
      if (data && "url" in data && data.url) {
        /* eslint-disable-next-line react-hooks/immutability */
        window.location.href = data.url;
      }
    },
  });
};

/**
 * Custom hook for generating Stripe billing portal link
 */
export const useGeneratePortalLink = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await authClient.subscription.billingPortal({
        returnUrl: "/settings",
      });

      if (error) {
        throw new Error(error.message || error.statusText);
      }

      return data;
    },
    onSuccess: (data) => {
      if (data?.url) {
        /* eslint-disable-next-line react-hooks/immutability */
        window.location.href = data.url;
      }
    },
  });
};
