"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignup } from "@/services/auth/hooks/use-functions";
import { useCurrentUser } from "@/services/auth/hooks/use-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useNugsVerifyEmail } from "@/hooks/use-nugs";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { VerifyEmailDialog } from "@/components/auth/verify-email-dialog";
import { Wrapper } from "@/components/auth/wrapper";

const formSchema = z
  .object({
    email: z.email(),
    name: z.string().min(1),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const SignupForm = () => {
  const router = useRouter();
  const { setIsOpen, setEmail } = useNugsVerifyEmail();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const productId = searchParams.get("productId");
  const destination = productId
    ? `/checkout?productId=${productId}`
    : callbackUrl;
  const { data: user } = useCurrentUser();

  useEffect(() => {
    if (user) router.replace(destination);
  }, [user, router, destination]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const signup = useSignup();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    signup.mutate(values, {
      onSuccess: () => {
        setIsOpen(true);
        setEmail(values.email);
      },
      onError: (error) => {
        form.setError("email", { message: error.message });
      },
    });
  };

  return (
    <div className="bg-muted flex min-h-dvh items-center-safe justify-center-safe p-8">
      <VerifyEmailDialog email={form.getValues("email")} />
      <Wrapper
        title="Sign up"
        description="Hey, Enter your details to get sign up to your account"
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="my-4 space-y-4">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field aria-invalid={fieldState.invalid}>
                <FieldLabel>Name</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="John Doe"
                    size="lg"
                  />
                </FieldContent>
                <FieldError
                  errors={fieldState.error ? [fieldState.error] : undefined}
                />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field aria-invalid={fieldState.invalid}>
                <FieldLabel>Email</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="example@example.com"
                    size="lg"
                  />
                </FieldContent>
                <FieldError
                  errors={fieldState.error ? [fieldState.error] : undefined}
                />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field aria-invalid={fieldState.invalid}>
                <FieldLabel>Password</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="********"
                    size="lg"
                    type="password"
                  />
                </FieldContent>
                <FieldError
                  errors={fieldState.error ? [fieldState.error] : undefined}
                />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <Field aria-invalid={fieldState.invalid}>
                <FieldLabel>Confirm Password</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="********"
                    size="lg"
                    type="password"
                  />
                </FieldContent>
                <FieldError
                  errors={fieldState.error ? [fieldState.error] : undefined}
                />
              </Field>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={signup.isPending}
          >
            Sign up
          </Button>
        </form>
        <div className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link
            href={
              productId
                ? `/login?callbackUrl=/checkout&productId=${productId}`
                : callbackUrl !== "/"
                  ? `/login?callbackUrl=${callbackUrl}`
                  : "/login"
            }
            className="text-primary underline"
          >
            Login
          </Link>
        </div>
      </Wrapper>
    </div>
  );
};
