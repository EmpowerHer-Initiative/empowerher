import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/services/auth/auth";

export const metadata = {
  title: "Settings",
  description: "Manage your account settings and preferences.",
  url: "/settings",
};

interface Props {
  children: React.ReactNode;
}

export default async function SettingsLayout({ children }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login?callbackUrl=/settings");

  return (
    <div className="mx-auto max-w-3xl gap-8 px-8 pt-20">
      <h1 className="mb-8 text-4xl font-bold capitalize">Settings</h1>
      {/* <SettingsLinks /> */}
      <div className="grow">{children}</div>
    </div>
  );
}
