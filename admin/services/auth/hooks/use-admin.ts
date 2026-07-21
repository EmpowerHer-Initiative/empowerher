import { useMutation } from "@tanstack/react-query";

import { queryClient, useTRPC } from "@/services/trpc/client";

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
      role: "user" | "staff" | "admin";
    }) => {
      // Better Auth's admin plugin only knows "user" | "admin" — "staff" is
      // applied afterwards via users.adminUpdate (writes role directly).
      const { data: newUser, error } = await authClient.admin.createUser({
        email, // required
        password, // required
        name, // required
        role: role === "staff" ? "user" : role,
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
