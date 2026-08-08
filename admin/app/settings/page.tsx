"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useLogout } from "@/services/auth/hooks/use-functions";
import { useCurrentUser } from "@/services/auth/hooks/use-user";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Accounts } from "@/components/settings/accounts";
import { DangerSettings } from "@/components/settings/danger";
import { EmailName } from "@/components/settings/general/email-name";

export default function SettingsPage() {
  const user = useCurrentUser();
  const logout = useLogout();
  const router = useRouter();

  if (user.isPending) {
    return (
      <div className="flex h-48 min-h-[80dvh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user.data) {
    router.replace("/login");
    return null;
  }

  return (
    <div className="space-y-16">
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold capitalize">General</h2>
        <EmailName />
      </div>
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold capitalize">Accounts</h2>
        <Accounts />
      </div>
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold capitalize">Danger</h2>
        <DangerSettings />
      </div>
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold capitalize">Logout</h2>
        <Button
          onClick={() => {
            logout.mutate(undefined, {
              onSuccess: () => {
                toast.success("Logged out successfully");
                router.push("/login");
              },
              onError: (error) => {
                toast.error(error.message);
              },
            });
          }}
          size="lg"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
