import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/services/auth/auth-client";
import { useCurrentUser } from "@/services/auth/hooks/use-user";
import { queryClient, useTRPC } from "@/services/trpc/client";

const useSignup = () => {
  const trpc = useTRPC();

  return useMutation({
    mutationFn: async (values: {
      email: string;
      password: string;
      name: string;
    }) => {
      const response = await authClient.signUp.email({
        email: values.email,
        name: values.name,
        password: values.password,
        metadata: {},
      });

      if (response.error) {
        throw new Error(response.error.message || response.error.statusText);
      }

      const emailOtpResponse = await authClient.emailOtp.sendVerificationOtp({
        email: values.email,
        type: "email-verification",
      });

      if (emailOtpResponse.error) {
        throw new Error(
          emailOtpResponse.error.message || emailOtpResponse.error.statusText
        );
      }

      return response;
    },
    onSuccess: () => {
      queryClient.setQueryData(trpc.users.getCurrent.queryKey(), (old) => {
        return old;
      });
    },
  });
};

/**
 * Custom hook for user sign-in functionality
 * Handles email/password authentication and session management
 * @returns UseMutationResult for sign-in operation
 */
const useSignin = () => {
  const trpc = useTRPC();

  return useMutation({
    mutationFn: async (values: { email: string; password: string }) => {
      const response = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (response.error) {
        throw new Error(response.error.message || response.error.statusText);
      }

      // signIn.email already sets the session cookie and returns the user.
      // Skip a second getSession() round-trip here — it only added latency
      // before the redirect. The dashboard's own server-side session check
      // (and the getCurrent query below) will read the fresh cookie.
      return response.data;
    },
    onSuccess: () => {
      // Refetch the current user in the background so navbar/UserControl
      // pick up the new session without blocking the redirect.
      queryClient.invalidateQueries({
        queryKey: trpc.users.getCurrent.queryKey(),
      });
    },
    onError: (error) => {
      toast.error(error.message || "Sign in failed");
    },
  });
};

/**
 * Custom hook for social provider sign-in (GitHub or Google)
 * @param provider - The social provider to use for authentication
 * @returns UseMutationResult for social sign-in operation
 */
export const useSignInWithProvider = (provider: "github" | "google") => {
  return useMutation({
    mutationFn: async ({ redirectUrl }: { redirectUrl: string }) => {
      const { data, error } = await authClient.signIn.social({
        provider,
        callbackURL: redirectUrl,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};

/**
 * Custom hook for sending password reset email
 * @returns UseMutationResult for password reset email operation
 */
const useSendResetEmail = () => {
  return useMutation({
    mutationFn: async ({
      email,
      redirectTo,
    }: {
      email: string;
      redirectTo: string;
    }) => {
      const { data, error } = await authClient.requestPasswordReset({
        email,
        redirectTo,
      });

      if (error) {
        throw new Error(error.message || error.statusText);
      }

      return data;
    },
  });
};

/**
 * Custom hook for resetting user password
 * @returns UseMutationResult for password reset operation
 */
const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      newPassword,
      token,
    }: {
      newPassword: string;
      token: string;
    }) => {
      const { data, error } = await authClient.resetPassword({
        newPassword, // required
        token, // required
      });

      if (error) {
        throw new Error(error.message || error.statusText);
      }

      return data;
    },
    onSuccess: () => {
      router.push("/login");
    },
  });
};

/**
 * Custom hook for email verification using OTP
 * @returns UseMutationResult for email verification operation
 */
const useVerifyEmail = (options?: { onSuccess?: () => void }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: user } = useCurrentUser();

  const trpc = useTRPC();

  return useMutation({
    mutationFn: async (otp: string) => {
      const { data, error } = await authClient.emailOtp.verifyEmail({
        email: user?.user?.email || "",
        otp: otp,
      });

      if (error) {
        throw new Error(error.message || error.statusText);
      }

      return data;
    },
    onSuccess: async () => {
      queryClient.setQueryData(trpc.users.getCurrent.queryKey(), (old) => {
        if (!old) return old;
        return {
          ...old,
          user: { ...old.user, emailVerified: true },
        };
      });

      if (options?.onSuccess) {
        options.onSuccess();
      } else {
        const callbackUrl = searchParams.get("callbackUrl") ?? "/";
        setTimeout(() => {
          router.push(callbackUrl);
        }, 2000);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Email verification failed");
    },
  });
};

/**
 * Custom hook for resending email verification OTP
 * @returns UseMutationResult for resending email verification operation
 */
const useResendEmailVerification = () => {
  const { data: currentUser } = useCurrentUser();
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email: currentUser?.user?.email || "",
        type: "email-verification",
      });

      if (error) {
        throw new Error(error.message || error.statusText);
      }

      return data;
    },
  });
};

/**
 * Custom hook for user logout functionality
 * Clears user session and invalidates related queries
 * @returns UseMutationResult for logout operation
 */
const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await authClient.signOut();

      if (error) {
        throw new Error(error.message || error.statusText);
      }

      return data;
    },
    onSuccess: () => {
      router.refresh();
      queryClient.clear();
    },
  });
};

export {
  useSignup,
  useSignin,
  useSendResetEmail,
  useResetPassword,
  useVerifyEmail,
  useResendEmailVerification,
  useLogout,
};
