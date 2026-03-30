// [TRIGGER.DEV] — This is an example task. Replace or delete it.
// All tasks must live in services/trigger/tasks/.
import { logger, task } from "@trigger.dev/sdk/v3";

export const exampleTask = task({
  id: "example-task",
  run: async (payload: { message: string }) => {
    logger.log("Running example task", { payload });

    // Add your background logic here.
    // This can run for minutes without hitting serverless timeouts.

    return { result: `Processed: ${payload.message}` };
  },
});
