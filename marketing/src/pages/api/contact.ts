import { CONTACT_EMAIL } from "astro:env/server";
import type { APIRoute } from "astro";
import { render } from "@react-email/components";
import { createElement } from "react";

import ContactEmail from "../../emails/contact";
import { sendEmail } from "../../lib/email";
import { clientIp, isRateLimited } from "../../lib/rate-limit";

export const prerender = false;

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (isRateLimited(`contact:${clientIp(request, clientAddress)}`)) {
    return json({ error: "Too many requests — please try again later" }, 429);
  }

  let body: {
    name?: string;
    email?: string;
    subject?: string;
    phone?: string;
    message?: string;
    company?: string;
  };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  // Honeypot — real users never see this field, bots fill it. Pretend success.
  if (body.company?.trim()) {
    return json({ ok: true });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const subject = body.subject?.trim();
  const phone = body.phone?.trim();
  const message = body.message?.trim();

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

  const to = CONTACT_EMAIL;
  if (!to) {
    console.error("[contact] CONTACT_EMAIL is not set");
    return json({ error: "Not configured" }, 500);
  }

  const template = createElement(ContactEmail, {
    name,
    email,
    phone,
    subject,
    message,
    submittedAt: new Date().toISOString(),
  });

  try {
    await sendEmail({
      to,
      replyTo: email,
      type: "contact",
      subject: `New message from ${name}${subject ? ` — ${subject}` : ""}`,
      html: await render(template),
      text: await render(template, { plainText: true }),
    });
  } catch (error) {
    console.error("[contact] send failed", error);
    return json({ error: "Failed to send — please try again" }, 502);
  }

  return json({ ok: true });
};
