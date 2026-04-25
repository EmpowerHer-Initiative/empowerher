import { createInterface } from "node:readline";
// ── Email templates (imported from service) ──────────────────────────────────
import { templates } from "@/services/email/index";
import {
  GetAccountSendingEnabledCommand,
  GetIdentityDkimAttributesCommand,
  GetIdentityVerificationAttributesCommand,
  GetSendQuotaCommand,
  GetSendStatisticsCommand,
  ListIdentitiesCommand,
  SESClient,
} from "@aws-sdk/client-ses";
import { config } from "dotenv";

// ── Site config ──────────────────────────────────────────────────────────────
import { siteConfig } from "@/lib/site";

config();

function sanitizeError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  return msg
    .replace(/AKIA[0-9A-Z]{12,}/g, "AKIA***REDACTED***")
    .replace(/arn:aws:[^\s'"]*/g, "arn:aws:***");
}

// ── ANSI helpers ──────────────────────────────────────────────────────────────
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const CLEAR = "\x1b[2J\x1b[H";

function bold(s: string) {
  return `${BOLD}${s}${RESET}`;
}
function dim(s: string) {
  return `${DIM}${s}${RESET}`;
}
function green(s: string) {
  return `${GREEN}${s}${RESET}`;
}
function red(s: string) {
  return `${RED}${s}${RESET}`;
}
function yellow(s: string) {
  return `${YELLOW}${s}${RESET}`;
}
function cyan(s: string) {
  return `${CYAN}${s}${RESET}`;
}

function statusColor(status: string) {
  switch (status.toLowerCase()) {
    case "success":
      return green(status);
    case "pending":
      return yellow(status);
    case "failed":
    case "temporaryfailure":
      return red(status);
    default:
      return status;
  }
}

const NOREPLY_EMAIL = siteConfig.noreplyEmail;
const SUPPORT_EMAIL = siteConfig.supportEmail;

// ── SES Client ────────────────────────────────────────────────────────────────
function createSesClient(): SESClient {
  const accessKeyId = process.env.AWS_ACCESS_KEY_VALUE;
  const secretAccessKey = process.env.AWS_SECRET_KEY_VALUE;
  const region = process.env.AWS_BUCKET_ORIGIN || "us-east-1";

  if (!accessKeyId || !secretAccessKey) {
    console.log(
      red(
        "\n  ✗ Missing AWS credentials (AWS_ACCESS_KEY_VALUE / AWS_SECRET_KEY_VALUE)"
      )
    );
    process.exit(1);
  }

  return new SESClient({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });
}

const ses = createSesClient();

// ── Menu ──────────────────────────────────────────────────────────────────────
const MENU_OPTIONS = [
  "Check Account Status",
  "Verify Identity Status",
  "Check DKIM Status",
  "Send Test Email",
  "View Send Statistics",
  "Check Specific Email/Domain",
  "List Email Templates",
];

let selected = 0;

function renderMenu() {
  process.stdout.write(CLEAR);
  const domain = NOREPLY_EMAIL.split("@")[1] ?? "unknown";
  console.log(
    `\n${bold("📧 SES Email Health Check")}  ${dim(`(${domain})`)}\n`
  );
  MENU_OPTIONS.forEach((name, i) => {
    if (i === selected) {
      console.log(`  ${cyan("❯")} ${bold(name)}`);
    } else {
      console.log(`    ${dim(name)}`);
    }
  });
  console.log(`\n${dim("↑/↓ to move · Enter to run · q to quit")}`);
}

function waitForKey(): Promise<void> {
  return new Promise((resolve) => {
    console.log(`\n${dim("Press any key to return to menu...")}`);
    const handler = () => {
      process.stdin.removeListener("data", handler);
      resolve();
    };
    process.stdin.on("data", handler);
  });
}

function promptInput(question: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdin.setRawMode(false);
    process.stdin.pause();

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(`  ${question}`, (answer) => {
      rl.close();
      process.stdin.setRawMode(true);
      process.stdin.resume();
      resolve(answer.trim());
    });
  });
}

// ── Option Handlers ───────────────────────────────────────────────────────────

async function checkAccountStatus() {
  console.log(`\n${bold("Account Status")}\n`);

  try {
    const [sendingEnabled, quota] = await Promise.all([
      ses.send(new GetAccountSendingEnabledCommand({})),
      ses.send(new GetSendQuotaCommand({})),
    ]);

    const enabled = sendingEnabled.Enabled;
    const max24h = quota.Max24HourSend ?? 0;
    const maxRate = quota.MaxSendRate ?? 0;
    const sentLast24h = quota.SentLast24Hours ?? 0;
    const isSandbox = max24h <= 200;

    console.log(`  Sending Enabled:  ${enabled ? green("Yes") : red("No")}`);
    console.log(
      `  Account Mode:     ${isSandbox ? yellow("Sandbox") : green("Production")}`
    );
    console.log(`  24h Send Limit:   ${bold(String(max24h))}`);
    console.log(`  Max Send Rate:    ${bold(String(maxRate))} emails/sec`);
    console.log(`  Sent (last 24h):  ${bold(String(sentLast24h))}`);
    console.log(`  Remaining:        ${bold(String(max24h - sentLast24h))}`);

    if (isSandbox) {
      console.log(
        `\n  ${yellow("⚠")} Sandbox mode — can only send to verified addresses`
      );
    }
  } catch (err) {
    console.log(red(`  ✗ ${sanitizeError(err)}`));
  }
}

async function verifyIdentityStatus() {
  console.log(`\n${bold("Identity Verification Status")}\n`);

  try {
    const identities = await ses.send(
      new ListIdentitiesCommand({ IdentityType: "EmailAddress", MaxItems: 100 })
    );
    const domains = await ses.send(
      new ListIdentitiesCommand({ IdentityType: "Domain", MaxItems: 100 })
    );

    const allIdentities = [
      ...(identities.Identities ?? []),
      ...(domains.Identities ?? []),
    ];

    if (allIdentities.length === 0) {
      console.log(dim("  No identities found"));
      return;
    }

    const verification = await ses.send(
      new GetIdentityVerificationAttributesCommand({
        Identities: allIdentities,
      })
    );

    const attrs = verification.VerificationAttributes ?? {};

    console.log(`  ${dim("Identity".padEnd(40))} ${dim("Status")}`);
    console.log(`  ${"─".repeat(40)} ${"─".repeat(20)}`);

    for (const identity of allIdentities) {
      const status = attrs[identity]?.VerificationStatus ?? "Unknown";
      const isConfigured =
        identity === NOREPLY_EMAIL || identity === SUPPORT_EMAIL;
      const label = isConfigured ? ` ${cyan("← configured")}` : "";

      console.log(`  ${identity.padEnd(40)} ${statusColor(status)}${label}`);
    }
  } catch (err) {
    console.log(red(`  ✗ ${sanitizeError(err)}`));
  }
}

async function checkDkimStatus() {
  console.log(`\n${bold("DKIM Status")}\n`);

  try {
    const domains = await ses.send(
      new ListIdentitiesCommand({ IdentityType: "Domain", MaxItems: 100 })
    );

    const allDomains = domains.Identities ?? [];

    if (allDomains.length === 0) {
      console.log(dim("  No domains found"));
      return;
    }

    const dkim = await ses.send(
      new GetIdentityDkimAttributesCommand({ Identities: allDomains })
    );

    const attrs = dkim.DkimAttributes ?? {};

    for (const domain of allDomains) {
      const attr = attrs[domain];
      const enabled = attr?.DkimEnabled;
      const status = attr?.DkimVerificationStatus ?? "Unknown";
      const tokens = attr?.DkimTokens ?? [];

      console.log(`  ${bold(domain)}`);
      console.log(
        `    DKIM Enabled:     ${enabled ? green("Yes") : red("No")}`
      );
      console.log(`    DKIM Status:      ${statusColor(status)}`);

      if (tokens.length > 0 && status !== "Success") {
        console.log(`    DKIM Tokens (add as CNAME records):`);
        for (const token of tokens) {
          console.log(
            dim(
              `      ${token}._domainkey.${domain} → ${token}.dkim.amazonses.com`
            )
          );
        }
      }
      console.log();
    }
  } catch (err) {
    console.log(red(`  ✗ ${sanitizeError(err)}`));
  }
}

async function sendTestEmail() {
  console.log(`\n${bold("Send Test Email")}\n`);

  const DEFAULT_EMAIL = "alisamadi0583@gmail.com";
  const input = await promptInput(
    `Recipient email ${dim(`(${DEFAULT_EMAIL})`)}: `
  );
  const email = input || DEFAULT_EMAIL;

  if (!email.includes("@")) {
    console.log(red("  ✗ Invalid email address"));
    return;
  }

  console.log(`\n  Sending test email to ${bold(email)}...`);

  try {
    const { sendEmail } = await import("@/services/email/index");
    const result = await sendEmail("verifyEmail", email, {
      verificationCode: "TEST-123456",
    });

    if ("error" in result) {
      console.log(red(`  ✗ ${result.error}`));
    } else {
      console.log(green("  ✓ Email sent successfully"));
      console.log(dim("    Check your inbox (and spam folder)"));
    }
  } catch (err) {
    console.log(red(`  ✗ ${sanitizeError(err)}`));
  }
}

async function viewSendStatistics() {
  console.log(`\n${bold("Send Statistics (last 2 weeks)")}\n`);

  try {
    const stats = await ses.send(new GetSendStatisticsCommand({}));
    const dataPoints = stats.SendDataPoints ?? [];

    if (dataPoints.length === 0) {
      console.log(dim("  No send data available"));
      return;
    }

    // Sort by timestamp descending
    dataPoints.sort(
      (a, b) => (b.Timestamp?.getTime() ?? 0) - (a.Timestamp?.getTime() ?? 0)
    );

    // Show last 10
    const recent = dataPoints.slice(0, 10);

    console.log(
      `  ${dim("Timestamp".padEnd(22))} ${dim("Sent".padEnd(8))} ${dim("Delivered".padEnd(11))} ${dim("Bounces".padEnd(9))} ${dim("Complaints".padEnd(12))} ${dim("Rejects")}`
    );
    console.log(`  ${"─".repeat(75)}`);

    let totalSent = 0;
    let totalBounces = 0;
    let totalComplaints = 0;
    let totalRejects = 0;

    for (const dp of recent) {
      const ts =
        dp.Timestamp?.toISOString().slice(0, 19).replace("T", " ") ?? "?";
      const sent = dp.DeliveryAttempts ?? 0;
      const bounces = dp.Bounces ?? 0;
      const complaints = dp.Complaints ?? 0;
      const rejects = dp.Rejects ?? 0;

      totalSent += sent;
      totalBounces += bounces;
      totalComplaints += complaints;
      totalRejects += rejects;

      console.log(
        `  ${ts.padEnd(22)} ${String(sent).padEnd(8)} ${String(sent - bounces - rejects).padEnd(11)} ${bounces > 0 ? red(String(bounces).padEnd(9)) : String(bounces).padEnd(9)} ${complaints > 0 ? red(String(complaints).padEnd(12)) : String(complaints).padEnd(12)} ${rejects > 0 ? red(String(rejects)) : String(rejects)}`
      );
    }

    console.log(`  ${"─".repeat(75)}`);
    console.log(
      `  ${bold("Total".padEnd(22))} ${bold(String(totalSent).padEnd(8))} ${bold(String(totalSent - totalBounces - totalRejects).padEnd(11))} ${totalBounces > 0 ? red(bold(String(totalBounces).padEnd(9))) : bold(String(totalBounces).padEnd(9))} ${totalComplaints > 0 ? red(bold(String(totalComplaints).padEnd(12))) : bold(String(totalComplaints).padEnd(12))} ${totalRejects > 0 ? red(bold(String(totalRejects))) : bold(String(totalRejects))}`
    );
  } catch (err) {
    console.log(red(`  ✗ ${sanitizeError(err)}`));
  }
}

async function checkSpecificEmail() {
  console.log(`\n${bold("Check Specific Email/Domain")}\n`);

  const identity = await promptInput("Email or domain: ");

  if (!identity) {
    console.log(red("  ✗ No input provided"));
    return;
  }

  try {
    const result = await ses.send(
      new GetIdentityVerificationAttributesCommand({
        Identities: [identity],
      })
    );

    const attrs = result.VerificationAttributes ?? {};
    const attr = attrs[identity];

    if (!attr) {
      console.log(yellow(`\n  ⚠ "${identity}" is not registered with SES`));
      console.log(
        dim("    It needs to be added and verified in AWS SES console")
      );
      return;
    }

    const status = attr.VerificationStatus ?? "Unknown";
    console.log(`\n  Identity:  ${bold(identity)}`);
    console.log(`  Status:    ${statusColor(status)}`);

    if (attr.VerificationToken) {
      console.log(`  Token:     ${dim(attr.VerificationToken)}`);
    }
  } catch (err) {
    console.log(red(`  ✗ ${sanitizeError(err)}`));
  }
}

function listEmailTemplates() {
  console.log(`\n${bold("Registered Email Templates")}\n`);

  console.log(
    `  ${dim("Template".padEnd(22))} ${dim("Subject".padEnd(30))} ${dim("From Label")}`
  );
  console.log(`  ${"─".repeat(70)}`);

  for (const [name, tmpl] of Object.entries(templates)) {
    const subject =
      typeof tmpl.subject === "function" ? "(dynamic)" : tmpl.subject;
    console.log(
      `  ${cyan(name.padEnd(22))} ${subject.padEnd(30)} ${tmpl.fromLabel}`
    );
  }

  console.log(`\n  ${bold("Configured Sender Addresses")}`);
  console.log(`  No-Reply:  ${bold(NOREPLY_EMAIL)}`);
  console.log(`  Support:   ${bold(SUPPORT_EMAIL)}`);
}

// ── Main Loop ─────────────────────────────────────────────────────────────────

const handlers = [
  checkAccountStatus,
  verifyIdentityStatus,
  checkDkimStatus,
  sendTestEmail,
  viewSendStatistics,
  checkSpecificEmail,
  listEmailTemplates,
];

async function runOption(index: number) {
  process.stdout.write(CLEAR);
  await handlers[index]();
  await waitForKey();
}

function handleKey(key: string) {
  if (key === "\u0003" || key === "q") {
    process.stdout.write("\x1b[?25h");
    process.exit(0);
  }

  if (key === "\r") {
    process.stdin.removeAllListeners("data");
    runOption(selected).then(() => {
      renderMenu();
      process.stdin.on("data", handleKey);
    });
    return;
  }

  if (key === "\x1b[A" || key === "k") {
    selected = (selected - 1 + MENU_OPTIONS.length) % MENU_OPTIONS.length;
    renderMenu();
  }

  if (key === "\x1b[B" || key === "j") {
    selected = (selected + 1) % MENU_OPTIONS.length;
    renderMenu();
  }
}

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf-8");

renderMenu();
process.stdin.on("data", handleKey);
