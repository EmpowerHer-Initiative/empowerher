import { getPartners } from "@/lib/cache/partners";

import { PartnersSection } from "@/components/partners-section";

export const Partners = async () => {
  const partners = await getPartners();
  return <PartnersSection partners={partners} />;
};
