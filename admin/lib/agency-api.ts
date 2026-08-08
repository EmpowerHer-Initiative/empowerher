import { AgencyClient } from "@alisamadiillc/agency-api";

export const agency = new AgencyClient(process.env.PUBLIC_AGENCY_API_KEY!);
