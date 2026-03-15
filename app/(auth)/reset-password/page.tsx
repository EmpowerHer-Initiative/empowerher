"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

import ResetPasswordPage from "./reset";

const formSchema = z.object({
  email: z.email(),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (token) {
    return <ResetPasswordPage />;
  }

  return (
    <div className="bg-muted flex min-h-dvh items-center-safe justify-center-safe p-8">
      <Wrapper
        title="Reset Password"
        description="Hey, Enter your email to reset your password"
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
          <Button type="submit" className="w-full" size="lg">
            Reset Password
          </Button>
        </form>
        <div className="text-muted-foreground text-sm">
          Remember your password?{" "}
          <Link href="/login" className="text-primary underline">
            Login
          </Link>
        </div>
      </Wrapper>
    </div>
  );
}
