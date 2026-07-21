import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient, useTRPC } from "@/services/trpc/client";

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

const useChangeOwnPassword = () => {
  const trpc = useTRPC();
  return useMutation(
    trpc.users.changeOwnPassword.mutationOptions({
      onSuccess: () => {
        queryClient.setQueryData(trpc.users.getCurrent.queryKey(), (old) => {
          if (!old) return old;
          return {
            ...old,
            user: {
              ...old.user,
              metadata: { ...old.user.metadata, mustChangePassword: false },
            },
          };
        });
      },
    })
  );
};

const useDismissPasswordChange = () => {
  const trpc = useTRPC();
  return useMutation(
    trpc.users.dismissPasswordChange.mutationOptions({
      onSuccess: () => {
        queryClient.setQueryData(trpc.users.getCurrent.queryKey(), (old) => {
          if (!old) return old;
          const { mustChangePassword, ...rest } = (old.user.metadata ??
            {}) as Record<string, unknown>;
          return {
            ...old,
            user: {
              ...old.user,
              metadata: rest,
            },
          };
        });
      },
    })
  );
};

export {
  useCurrentUser,
  useUpdateUser,
  useRevokeSession,
  useChangeOwnPassword,
  useDismissPasswordChange,
};
