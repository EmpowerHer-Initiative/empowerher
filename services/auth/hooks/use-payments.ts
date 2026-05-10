import { useRouter } from "next/navigation";
import { queryClient, useTRPC } from "@/services/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "../auth-client";

export const useGetCustomerState = () => {
  const trpc = useTRPC();
  return useQuery(trpc.payments.getCustomerState.queryOptions());
};

/**
 * Custom hook for initiating checkout process
 * @returns UseMutationResult for checkout operation
 */
export const useCheckout = () => {
  const router = useRouter();
  const trpc = useTRPC();

  return useMutation(
    trpc.payments.createCheckout.mutationOptions({
      onSuccess: (data) => {
        if (!data) {
          throw new Error("Failed to create checkout");
        }

        /* eslint-disable-next-line react-hooks/immutability */
        window.location.href = data.url;
      },
      onError: (error, variables) => {
        if (error.data?.code === "UNAUTHORIZED") {
          router.push(
            `/signup?callbackUrl=/checkout&productId=${variables.productId}`
          );
          return;
        }
        toast.error(
          error.message || "Failed to create checkout. Please try again."
        );
      },
    })
  );
};

/**
 * Custom hook for switching subscription plan
 * @returns UseMutationResult for switching plan operation
 */
export const useSwitchPlan = () => {
  const trpc = useTRPC();

  return useMutation(
    trpc.payments.switchPlan.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["customer-state"] });
      },
    })
  );
};

/**
 * Custom hook for generating customer portal link
 * @returns UseMutationResult for generating portal link operation
 */
export const useGeneratePortalLink = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await authClient.customer.portal();

      if (error) {
        throw new Error(error.message || error.statusText);
      }

      return data;
    },
  });
};
