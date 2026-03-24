"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignin } from "@/services/auth/hooks/use-functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Wrapper } from "@/components/auth/wrapper";

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const productId = searchParams.get("productId");
  const destination = productId
    ? `/checkout?productId=${productId}`
    : callbackUrl;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signin = useSignin();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    signin.mutate(values, {
      onSuccess: () => {
        router.push(destination);
      },
      onError: (error) => {
        form.setError("email", { message: error.message });
      },
    });
  };

  return (
    <div className="bg-muted flex min-h-dvh items-center-safe justify-center-safe p-8">
      <Wrapper
        title="Login"
        description="Hey, Enter your details to get sign in to your account"
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="my-4 space-y-4">
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
                  <Link
                    href="/reset-password"
                    className="text-muted-foreground hover:text-primary mt-1 text-right text-xs transition-colors"
                  >
                    Forgot password?
                  </Link>
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
            disabled={signin.isPending}
          >
            Login
          </Button>
        </form>
        <div className="text-muted-foreground text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href={
              productId
                ? `/signup?callbackUrl=/checkout&productId=${productId}`
                : callbackUrl !== "/"
                  ? `/signup?callbackUrl=${callbackUrl}`
                  : "/signup"
            }
            className="text-primary underline"
          >
            Sign up
          </Link>
        </div>
      </Wrapper>
    </div>
  );
};
