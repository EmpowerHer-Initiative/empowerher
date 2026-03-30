// [TRIGGER.DEV] — Remove this file (and the entire services/trigger/ directory)
// when removing Trigger.dev from the project.
import { tasks } from "@trigger.dev/sdk/v3";

import type { exampleTask } from "./tasks/example-task";

// Re-export task types for use in tRPC routers or server actions.
// Add new task types here as you create them.
export type { exampleTask };

// Use this to trigger tasks from your backend (tRPC routers, route handlers).
//
// Example:
//   import { tasks } from "@trigger.dev/sdk/v3";
//   import type { exampleTask } from "@/services/trigger/client";
//   await tasks.trigger<typeof exampleTask>("example-task", { message: "hello" });
export { tasks };
