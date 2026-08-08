import { AgencyClient } from "@alisamadiillc/agency-api";

export const agency = new AgencyClient(
  process.env.NEXT_PUBLIC_AGENCY_API_KEY!
);
