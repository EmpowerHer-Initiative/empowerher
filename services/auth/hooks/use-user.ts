import { queryClient, useTRPC } from "@/services/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";

const useCurrentUser = () => {
  const trpc = useTRPC();
  return useQuery(trpc.users.getCurrent.queryOptions());
};

const useUpdateUser = () => {
  const trpc = useTRPC();
  return useMutation(
    trpc.users.update.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.setQueryData(trpc.users.getCurrent.queryKey(), (old) => {
          if (!old) return old;
          return {
            ...old,
            user: {
              ...old.user,
              ...variables,
            },
          };
        });
      },
      onError: (error) => {
        console.error(error);
      },
    })
  );
};

const useRevokeSession = () => {
  const trpc = useTRPC();

  return useMutation(
    trpc.auth.revokeSession.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.auth.listSessions.pathKey(),
        });
      },
    })
  );
};

export { useCurrentUser, useUpdateUser, useRevokeSession };
