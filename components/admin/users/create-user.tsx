import { useState } from "react";
import {
  useCreateUser,
  useUpdateAdminUser,
} from "@/services/auth/hooks/use-admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.email({
    message: "Email address is required",
  }),
  password: z.string().min(8, {
    message: "Passwords must be 8 characters or more.",
  }),
  role: z.enum(["user", "staff", "admin"]),
});

export const CreateUser = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: adminUpdate, isPending: isUpdating } = useUpdateAdminUser();
  const isPending = isCreating || isUpdating;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user" as const,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    createUser(values, {
      onSuccess: (data) => {
        adminUpdate(
          {
            id: data.user.id,
            role: values.role,
            metadata: { mustChangePassword: true },
          },
          {
            onSuccess: () => {
              setIsOpen(false);
              form.reset();
            },
          }
        );
      },
      onError: (error) => {
        if (error.message.toLowerCase().includes("already exists")) {
          form.setError("email", {
            message: "That email address is taken. Please try another.",
          });
        } else {
          form.setError("password", {
            message: "Something went wrong",
          });
        }
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={<Button className="ml-auto">Create User</Button>}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex w-full flex-col gap-4"
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

          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Email</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    type="email"
                    placeholder="name@example.com"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Password</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    type="password"
                    placeholder="********"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </FieldContent>
              </Field>
            )}
          />

          <Separator />

          <Controller
            control={form.control}
            name="role"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Role</FieldLabel>
                <FieldContent>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className="w-full"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError errors={[fieldState.error]} />
                </FieldContent>
              </Field>
            )}
          />

          <FieldError errors={[form.formState.errors.root]} />
        </form>
        <DialogFooter>
          <DialogClose
            render={
              <Button
                variant="outline"
                onClick={() => form.reset()}
                disabled={isPending}
              >
                Cancel
              </Button>
            }
          />
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isPending}
          >
            Create user
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
