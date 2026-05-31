import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { siteConfig } from "@/lib/site";

interface ContactFormEmailProps {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  phone?: string;
  ipAddress?: string;
  userAgent?: string;
  referer?: string;
  submittedAt?: string;
  pageUrl?: string;
}

export default function ContactFormEmail({
  name = "",
  email = "",
  subject = "",
  message = "",
  phone,
  ipAddress = "Unknown",
  userAgent = "Unknown",
  referer,
  submittedAt = new Date().toISOString(),
  pageUrl,
}: ContactFormEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body
          className="font-sans"
          style={{ backgroundColor: "#f9fafb", margin: 0, padding: 0 }}
        >
          <Preview>
            New contact from {name}: {subject}
          </Preview>

          <Container className="mx-auto max-w-[600px] px-4 py-10">
            {/* Header */}
            <Text
              className="mb-0 text-lg font-bold"
              style={{ color: "#111827" }}
            >
              New message from {siteConfig.name}
            </Text>
            <Text className="mt-1 mb-6 text-sm" style={{ color: "#6b7280" }}>
              {new Date(submittedAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Text>

            {/* Message Card */}
            <Section
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            >
              {/* From line */}
              <Section
                className="px-6 py-4"
                style={{ borderBottom: "1px solid #f3f4f6" }}
              >
                <Text className="m-0 text-sm" style={{ color: "#111827" }}>
                  <strong>{name}</strong>{" "}
                  <Link
                    href={`mailto:${email}`}
                    className="no-underline"
                    style={{ color: "#6b7280" }}
                  >
                    &lt;{email}&gt;
                  </Link>
                </Text>
                {phone && (
                  <Text
                    className="m-0 mt-1 text-xs"
                    style={{ color: "#9ca3af" }}
                  >
                    {phone}
                  </Text>
                )}
              </Section>

              {/* Subject */}
              <Section
                className="px-6 py-3"
                style={{ borderBottom: "1px solid #f3f4f6" }}
              >
                <Text
                  className="m-0 text-sm font-semibold"
                  style={{ color: "#111827" }}
                >
                  {subject}
                </Text>
              </Section>

              {/* Message body */}
              <Section className="px-6 py-5">
                <Text
                  className="m-0 text-sm leading-6 whitespace-pre-wrap"
                  style={{ color: "#374151" }}
                >
                  {message}
                </Text>
              </Section>
            </Section>

            {/* Reply button */}
            <Section className="mt-5 text-center">
              <Link
                href={`mailto:${email}?subject=Re: ${subject}`}
                className="inline-block rounded-md px-6 py-2.5 text-sm font-medium text-white no-underline"
                style={{ backgroundColor: "#111827" }}
              >
                Reply to {name.split(" ")[0]}
              </Link>
            </Section>

            <Hr className="mt-8 mb-6" style={{ borderColor: "#e5e7eb" }} />

            {/* Metadata */}
            <table
              cellPadding={0}
              cellSpacing={0}
              style={{ width: "100%", fontSize: "11px", color: "#9ca3af" }}
            >
              <tbody>
                <tr>
                  <td style={{ padding: "2px 0", width: "90px" }}>IP</td>
                  <td style={{ padding: "2px 0" }}>{ipAddress}</td>
                </tr>
                <tr>
                  <td style={{ padding: "2px 0" }}>Device</td>
                  <td style={{ padding: "2px 0" }}>{userAgent}</td>
                </tr>
                {referer && (
                  <tr>
                    <td style={{ padding: "2px 0" }}>Referer</td>
                    <td style={{ padding: "2px 0" }}>{referer}</td>
                  </tr>
                )}
                {pageUrl && (
                  <tr>
                    <td style={{ padding: "2px 0" }}>Page</td>
                    <td style={{ padding: "2px 0" }}>{pageUrl}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

ContactFormEmail.templateName = "contact-form" as const;

ContactFormEmail.PreviewProps = {
  name: "John Doe",
  email: "john@example.com",
  subject: "Partnership Inquiry",
  message:
    "Hi there,\n\nI'm interested in discussing a potential partnership. We've been following your work and think there's a great opportunity to collaborate.\n\nLooking forward to hearing from you.\n\nBest regards,\nJohn",
  phone: "+1 (555) 123-4567",
  ipAddress: "203.0.113.42",
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  referer: "https://google.com",
  submittedAt: "2026-05-31T14:30:00.000Z",
  pageUrl: "https://alisamadii.com/contact",
} satisfies ContactFormEmailProps;
