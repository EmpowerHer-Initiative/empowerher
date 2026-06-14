import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/services/auth/auth";

export const metadata = {
  title: "Features",
  description: "Access your subscription and purchased features.",
  url: "/features",
};

interface Props {
  children: React.ReactNode;
}

export default async function FeaturesLayout({ children }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login?callbackUrl=/features");

  return (
    <div className="mx-auto max-w-3xl gap-8 px-8 pt-20">
      <h1 className="mb-8 text-4xl font-bold capitalize">Features</h1>
      <div className="grow">{children}</div>
    </div>
  );
}
