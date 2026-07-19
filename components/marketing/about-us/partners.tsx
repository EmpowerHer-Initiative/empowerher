import { caller } from "@/services/trpc/server";

import { PartnersSection } from "@/components/partners-section";

export const Partners = async () => {
  const partners = await caller.partners.list();
  return <PartnersSection partners={partners} />;
};
