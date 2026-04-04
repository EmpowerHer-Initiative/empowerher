// [TRIGGER.DEV] — Remove this file when removing Trigger.dev from the project.
import { siteConfig } from "@/lib/site";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface AppointmentReminderProps {
  userName?: string;
  title?: string;
  description?: string;
  scheduledAt?: string; // pre-formatted date string
}

export default function AppointmentReminder({
  userName,
  title,
  description,
  scheduledAt,
}: AppointmentReminderProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body
          className="font-sans"
          style={{
            backgroundColor: siteConfig.emailPrimaryColor,
            margin: 0,
            padding: 0,
          }}
        >
          <Preview>Reminder: {title || ""} is coming up soon</Preview>
          <Container className="mx-auto max-w-xl py-12 px-4">
            {/* Brand header */}
            <Section className="mb-6 text-center">
              <Img
                src={siteConfig.emailLogoUrl}
                width="40"
                height="40"
                alt={siteConfig.name}
                className="mx-auto"
              />
            </Section>

            {/* Card */}
            <Section
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <Section className="px-10 pt-10 pb-6">
                <Heading
                  className="mt-0 mb-4 text-2xl font-bold"
                  style={{ color: "#111111" }}
                >
                  Upcoming appointment reminder
                </Heading>

                <Text className="mb-6 text-base leading-6 text-gray-600">
                  Hi {userName}, this is a reminder that you have an appointment
                  coming up in the next 24 hours.
                </Text>

                {/* Appointment details */}
                <Section
                  className="mb-6 p-6"
                  style={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Text
                    className="mb-1 text-xs font-semibold uppercase tracking-widest"
                    style={{ color: siteConfig.emailPrimaryColor }}
                  >
                    Appointment
                  </Text>
                  <Text
                    className="mb-4 text-lg font-semibold"
                    style={{ color: "#111111" }}
                  >
                    {title}
                  </Text>

                  {description && (
                    <Text className="mb-4 text-sm text-gray-600">
                      {description}
                    </Text>
                  )}

                  <Text
                    className="mb-0 text-sm font-medium"
                    style={{ color: "#111111" }}
                  >
                    {scheduledAt}
                  </Text>
                </Section>

                <Text className="text-sm text-gray-500">
                  Please make sure you&apos;re prepared and arrive on time. If
                  you need to reschedule, please contact us as soon as possible.
                </Text>
              </Section>

              {/* Footer inside card */}
              <Section
                className="px-10 py-6"
                style={{ borderTop: "1px solid #f0f0f0" }}
              >
                <Text className="mb-2 text-xs text-gray-400">
                  For your security, we will never ask you to verify your
                  password, credit card, or banking information via email.
                </Text>
                <Text className="m-0 text-xs text-gray-400">
                  Questions?{" "}
                  <Link
                    href={`mailto:${siteConfig.supportEmail}`}
                    style={{ color: siteConfig.emailPrimaryColor }}
                    className="no-underline"
                  >
                    Contact support
                  </Link>{" "}
                  &middot;{" "}
                  <Link
                    href={`${siteConfig.url}/privacy`}
                    style={{ color: siteConfig.emailPrimaryColor }}
                    className="no-underline"
                  >
                    Privacy
                  </Link>{" "}
                  &middot;{" "}
                  <Link
                    href={`${siteConfig.url}/terms`}
                    style={{ color: siteConfig.emailPrimaryColor }}
                    className="no-underline"
                  >
                    Terms
                  </Link>
                </Text>
              </Section>
            </Section>

            {/* Outer footer */}
            <Section className="mt-6 text-center">
              <Text
                className="m-0 text-xs"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                &copy; {new Date().getFullYear()} {siteConfig.name}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

AppointmentReminder.PreviewProps = {
  userName: "Ali",
  title: "Strategy Call",
  description: "30-minute onboarding call to discuss project goals.",
  scheduledAt: "Tuesday, April 1 2026 at 10:00 AM (UTC)",
} satisfies AppointmentReminderProps;
