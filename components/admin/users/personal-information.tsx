import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { queryClient, useTRPC } from "@/services/trpc/client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters",
  }),
});

export const PersonalInformation = () => {
  const { id } = useParams<{ id: string }>();
  const trpc = useTRPC();
  const { data: user } = useQuery(
    trpc.users.get.queryOptions(id, {
      enabled: !!id,
    })
  );

  const updateUser = useMutation(
    trpc.users.adminUpdate.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.users.get.pathKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.users.list.pathKey(),
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update user");
      },
    })
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    updateUser.mutate(
      {
        id,
        name: values.name,
      },
      {
        onSuccess: () => {
          form.reset({
            name: values.name,
          });
          toast.success("Name updated");
        },
      }
    );
  };

  return (
    <div>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Name</FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  placeholder="John Doe"
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          )}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={updateUser.isPending || !form.formState.isDirty}
          >
            Save
          </Button>
        </div>
        <Field>
          <FieldLabel>Role</FieldLabel>
          <FieldContent>
            <Select
              value={user?.role ?? "user"}
              onValueChange={(role) => {
                updateUser.mutate({
                  id,
                  role: role as "user" | "staff" | "admin",
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>
      </form>
    </div>
  );
};
