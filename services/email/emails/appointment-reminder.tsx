// [TRIGGER.DEV] — Remove this file when removing Trigger.dev from the project.
import { Footer } from "@/services/email/components/footer";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
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
        <Body className="bg-white font-sans text-black">
          <Preview>Reminder: {title || ""} is coming up soon</Preview>
          <Container className="mx-auto max-w-2xl p-8">
            <Section className="bg-white">
              <Section className="p-8">
                <Heading className="mb-6 text-2xl font-bold text-black">
                  Upcoming appointment reminder
                </Heading>

                <Text className="mb-6 text-base leading-6 text-gray-700">
                  Hi {userName}, this is a reminder that you have an appointment
                  coming up in the next 24 hours.
                </Text>

                <Section className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <Text className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Appointment
                  </Text>
                  <Text className="mb-4 text-lg font-semibold text-black">
                    {title}
                  </Text>

                  {description && (
                    <Text className="mb-4 text-sm text-gray-600">
                      {description}
                    </Text>
                  )}

                  <Text className="mb-0 text-sm font-medium text-black">
                    {scheduledAt}
                  </Text>
                </Section>

                <Text className="text-sm text-gray-600">
                  Please make sure you&apos;re prepared and arrive on time. If
                  you need to reschedule, please contact us as soon as possible.
                </Text>
              </Section>

              <Footer />
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
