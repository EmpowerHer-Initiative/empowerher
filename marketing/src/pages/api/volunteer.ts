import { CONTACT_EMAIL } from "astro:env/server";
import type { APIRoute } from "astro";
import { render } from "@react-email/components";
import { createElement } from "react";

import VolunteerEmail from "../../emails/volunteer";
import { sendEmail } from "../../lib/email";
import { clientIp, isRateLimited } from "../../lib/rate-limit";

export const prerender = false;

// CV cap is ~1 MB of PDF; base64 inflates ~4/3, plus the JSON envelope.
const MAX_BODY_BYTES = 1_500_000;
const MAX_CV_BYTES = 1_000_000;

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (isRateLimited(`volunteer:${clientIp(request, clientAddress)}`)) {
    return json({ error: "Too many requests — please try again later" }, 429);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json(
      { error: "That file is too large — please keep your CV under 1 MB" },
      413,
    );
  }

  let body: {
    name?: string;
    email?: string;
    message?: string;
    cv?: { filename?: string; content?: string };
    company?: string;
  };
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  // Honeypot — real users never see this field, bots fill it. Pretend success.
  if (body.company?.trim()) {
    return json({ ok: true });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();
  const cvFilename = body.cv?.filename?.trim();
  const cvContent = body.cv?.content;

  if (
    !name ||
    name.length > 200 ||
    !email ||
    email.length > 320 ||
    !message ||
    message.length < 10 ||
    message.length > 5000 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return json({ error: "Please fill out all required fields" }, 400);
  }
  if (!cvFilename || !cvContent) {
    return json({ error: "Please attach your CV (PDF)" }, 400);
  }
  // Base64 length ≈ bytes * 4/3.
  if (cvContent.length > (MAX_CV_BYTES * 4) / 3 + 4) {
    return json(
      { error: "That file is too large — please keep your CV under 1 MB" },
      413,
    );
  }

  const to = CONTACT_EMAIL;
  if (!to) {
    console.error("[volunteer] CONTACT_EMAIL is not set");
    return json({ error: "Not configured" }, 500);
  }

  const template = createElement(VolunteerEmail, {
    name,
    email,
    message,
    cvFilename,
    submittedAt: new Date().toISOString(),
  });

  try {
    await sendEmail({
      to,
      replyTo: email,
      type: "volunteer",
      subject: `Volunteer application — ${name}`,
      html: await render(template),
      text: await render(template, { plainText: true }),
      attachments: [
        {
          filename: cvFilename,
          content: cvContent,
          contentType: "application/pdf",
        },
      ],
    });
  } catch (error) {
    console.error("[volunteer] send failed", error);
    return json({ error: "Failed to send — please try again" }, 502);
  }

  return json({ ok: true });
};
