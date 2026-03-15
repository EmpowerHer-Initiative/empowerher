"use client";

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

const formSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function ResetPasswordPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div className="bg-muted flex min-h-dvh items-center-safe justify-center-safe p-8">
      <Wrapper
        title="Reset Password"
        description="Hey, Enter your email to reset your password"
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="my-4 space-y-4">
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
                    type="password"
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
      </Wrapper>
    </div>
  );
}
