import { queryClient, useTRPC } from "@/services/trpc/client";
import { useMutation } from "@tanstack/react-query";

import { authClient } from "../auth-client";

const useCreateUser = () => {
  const trpc = useTRPC();
  return useMutation({
    mutationFn: async ({
      email,
      password,
      name,
      role,
    }: {
      email: string;
      password: string;
      name: string;
      role: "user" | "admin";
    }) => {
      const { data: newUser, error } = await authClient.admin.createUser({
        email, // required
        password, // required
        name, // required
        role,
      });

      if (error) {
        throw new Error(error.message);
      }

      return newUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.users.list.pathKey(),
      });
    },
  });
};

const useUpdateAdminUser = () => {
  const trpc = useTRPC();
  return useMutation(
    trpc.users.adminUpdate.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.users.list.pathKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.users.get.pathKey(),
        });
      },
    })
  );
};

const useUpdateMetadata = () => {
  const trpc = useTRPC();
  return useMutation(
    trpc.users.updateMetadata.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.users.get.pathKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.users.list.pathKey(),
        });
      },
    })
  );
};

const useRemoveMetadataKey = () => {
  const trpc = useTRPC();
  return useMutation(
    trpc.users.removeMetadataKey.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.users.get.pathKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.users.list.pathKey(),
        });
      },
    })
  );
};

export {
  useCreateUser,
  useUpdateAdminUser,
  useUpdateMetadata,
  useRemoveMetadataKey,
};
