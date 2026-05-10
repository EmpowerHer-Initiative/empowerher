import { authClient } from "@/services/auth/auth-client";
import { queryClient, useTRPC } from "@/services/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetCustomerState = () => {
  const trpc = useTRPC();
  return useQuery(trpc.billing.getCustomerState.queryOptions());
};

/**
 * Initiates checkout via Polar hosted page
 */
export const useCheckout = () => {
  return useMutation({
    mutationFn: async (input: { productId: string; successUrl?: string }) => {
      const result = await authClient.checkout({
        products: [input.productId],
        successUrl: input.successUrl,
      });
      if (result.error) throw new Error(result.error.message);
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to create checkout. Please try again."
      );
    },
  });
};

/**
 * Opens Polar customer portal
 */
export const useGeneratePortalLink = () => {
  return useMutation({
    mutationFn: async () => {
      const result = await authClient.customer.portal();
      if (result.error) throw new Error(result.error.message);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to open billing portal");
    },
  });
};

/**
 * Cancel a subscription
 */
export const useCancelSubscription = () => {
  const trpc = useTRPC();

  return useMutation(
    trpc.billing.cancelSubscription.mutationOptions({
      onSuccess: () => {
        toast.success("Subscription canceled");
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: trpc.billing.getCustomerState.queryKey(),
          });
        }, 2000);
      },
      onError: () => {
        toast.error("Failed to cancel subscription");
      },
    })
  );
};

/**
 * Fetches subscription details from Polar
 */
export const useSubscriptionDetails = (subscriptionId: string | null) => {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.billing.getSubscriptionDetails.queryOptions({
      subscriptionId: subscriptionId ?? "",
    }),
    enabled: !!subscriptionId,
  });
};
