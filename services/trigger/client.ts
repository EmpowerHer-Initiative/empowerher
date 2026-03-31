// [TRIGGER.DEV] — Remove this file (and the entire services/trigger/ directory)
// when removing Trigger.dev from the project.
import { tasks } from "@trigger.dev/sdk/v3";

import type { appointmentReminderTask } from "./tasks/appointment-reminder";

// Re-export task types for use in tRPC routers or server actions.
// Add new task types here as you create them.
export type { appointmentReminderTask };

// Use this to trigger tasks manually from your backend (tRPC routers, route handlers).
//
// Example:
//   import { tasks } from "@trigger.dev/sdk/v3";
//   import type { appointmentReminderTask } from "@/services/trigger/client";
//   await tasks.trigger<typeof appointmentReminderTask>("appointment-reminder", {});
export { tasks };
