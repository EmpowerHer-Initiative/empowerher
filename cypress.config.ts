import { neon } from "@neondatabase/serverless";
import { defineConfig } from "cypress";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on) {
      on("task", {
        async deleteUserSessions(email: string) {
          const sql = neon(process.env.DATABASE_URL!);
          const rows = await sql`
            DELETE FROM session
            WHERE user_id = (SELECT id FROM "user" WHERE email = ${email})
            RETURNING id
          `;
          return rows.length;
        },
      });
    },
  },
});
