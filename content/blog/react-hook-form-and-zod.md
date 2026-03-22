---
title: Forms with React Hook Form and Zod
description: Build fully validated, type-safe forms in React using React Hook Form for state management and Zod for schema validation.
image: https://cdn.dribbble.com/userupload/12625976/file/original-477795e34939330965e12002052dcb49.jpg?resize=1024x768&vertical=center
date: 2025-03-08
---

## The combination

React Hook Form handles form state without re-renders. Zod defines the validation schema. The `zodResolver` bridges the two so validation runs automatically on submit and field blur.

Together they give you:
- Full type inference from schema to form values
- Server-side and client-side validation parity (same Zod schema)
- Clean, uncluttered JSX with no manual `onChange` handlers

## Basic form

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    console.log(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <Input {...register("email")} placeholder="Email" />
        {errors.email && (
          <p className="text-destructive mt-1 text-sm">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Input type="password" {...register("password")} placeholder="Password" />
        {errors.password && (
          <p className="text-destructive mt-1 text-sm">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit">Sign in</Button>
    </form>
  );
};
```

## With tRPC mutation

Wire the form directly to a tRPC mutation for end-to-end type safety:

```tsx
const trpc = useTRPC();
const createPost = useMutation(trpc.posts.create.mutationOptions({
  onSuccess: () => toast.success("Post created"),
  onError: () => toast.error("Something went wrong"),
}));

const onSubmit = (values: FormValues) => createPost.mutate(values);

// In JSX:
<Button type="submit" disabled={createPost.isPending}>
  {createPost.isPending ? <Spinner /> : "Create"}
</Button>
```

## Reusable field component

Avoid repeating error message markup by wrapping label, input, and error into a `Field`:

```tsx
import { Field } from "@/components/ui/field";

<Field label="Email" error={errors.email?.message}>
  <Input {...register("email")} />
</Field>
```

## Tips

- Always co-locate the Zod schema with the form component — they change together
- Use `z.coerce.number()` for numeric inputs since HTML inputs always return strings
- Share schemas between client forms and tRPC input validators to avoid drift
