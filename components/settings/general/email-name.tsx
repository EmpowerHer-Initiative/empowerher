import { useResendEmailVerification } from "@/services/auth/hooks/use-functions";
import { useCurrentUser, useUpdateUser } from "@/services/auth/hooks/use-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useNugsVerifyEmail } from "@/hooks/use-nugs";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { VerifyEmailDialog } from "@/components/auth/verify-email-dialog";

const schema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.email({
    message: "Email address is required",
  }),
});

export const EmailName = () => {
  const { setIsOpen, setEmail } = useNugsVerifyEmail();

  const { data: user } = useCurrentUser();
  const updateUser = useUpdateUser();
  const verifyEmail = useResendEmailVerification();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.user.name || "",
      email: user?.user.email || "",
    },
  });

  const handleSubmit = (values: z.infer<typeof schema>) => {
    updateUser.mutate(
      {
        name: values.name,
      },
      {
        onSuccess: () => {
          form.reset({
            name: values.name,
          });
          toast.success("Name updated successfully");
        },
        onError: (error) => {
          form.setError("root", {
            message: error.message,
          });
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Name & Email</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex max-w-sm flex-col gap-4"
        >
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input {...field} aria-invalid={fieldState.invalid} />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  type="email"
                  disabled
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <FieldError errors={[form.formState.errors.root]} />
        </form>

        {!user?.user.emailVerified && (
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>Email not verified</AlertTitle>
            <AlertDescription>
              Your email is not verified. Please verify your email.
            </AlertDescription>
            <Button
              variant={"destructive"}
              className="mt-2 w-48"
              disabled={verifyEmail.isPending}
              onClick={() => {
                verifyEmail.mutate(undefined, {
                  onSuccess: () => {
                    setIsOpen(true);
                    setEmail(user?.user.email || "");
                  },
                  onError: (error) => {
                    toast.error(error.message);
                  },
                });
              }}
            >
              Verify Email
            </Button>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          onClick={form.handleSubmit(handleSubmit)}
          disabled={updateUser.isPending || !form.formState.isDirty}
        >
          Save
        </Button>
      </CardFooter>

      <VerifyEmailDialog
        email={user?.user.email || ""}
        onSuccess={() => setIsOpen(false)}
      />
    </Card>
  );
};
