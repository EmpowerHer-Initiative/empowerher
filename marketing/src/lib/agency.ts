import { AgencyClient } from "@alisamadiillc/agency-api";

// Public by design: the agency API enforces an origin allowlist and per-IP
// rate limits server-side, so the key ships in the client bundle.
// Null until PUBLIC_AGENCY_API_KEY is set (see .env.example) — the constructor
// throws on an empty key, which would kill the page script at load.
const key = import.meta.env.PUBLIC_AGENCY_API_KEY;

export const agency = key ? new AgencyClient(key) : null;
