import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { EmailFooter } from "../components/email-footer";

interface ReminderEmailProps {
  content?: string;
  dueDate?: string;
  timeRemaining?: string;
}

export default function ReminderEmail({
  content = "",
  dueDate = "",
  timeRemaining = "",
}: ReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 py-2.5">
          <Preview>
            Reminder: Important deadline approaching - {dueDate}
          </Preview>
          <Container className="border border-gray-100 bg-white p-11">
            <Img
              src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTbc5Ufv9xopPYBqCUaZOIeEGDyJzvSfLh2M0n"
              width="80"
              alt="EmpowerHer Logo"
            />
            <Section>
              <Text className="mb-6 font-sans text-2xl font-bold text-gray-900">
                Dear Staff,
              </Text>

              <Text className="mb-4 font-sans text-base leading-7 text-gray-700">
                This is a reminder that we are approaching a deadline.
              </Text>

              <div className="mb-6 rounded-lg bg-yellow-50 p-6">
                <Text className="mb-4 font-sans text-lg font-semibold text-gray-900">
                  Important Reminder
                </Text>

                <Text className="mb-3 font-sans text-base leading-7 text-gray-700">
                  {content}
                </Text>

                <Text className="mb-3 font-sans text-base leading-7 text-gray-700">
                  <strong>Due Date:</strong> {dueDate}
                </Text>
                {timeRemaining && (
                  <Text className="mb-3 font-sans text-base leading-7 text-gray-700">
                    <strong>Time remaining:</strong> {timeRemaining}
                  </Text>
                )}
              </div>

              <Text className="mb-4 font-sans text-base leading-7 text-gray-700">
                Please take the necessary action before the deadline. If you
                have any questions or concerns, please reach out to the
                Mentorship Program Director at{" "}
                <Link href="mailto:apply@empowerher-initiative.org">
                  apply@empowerher-initiative.org
                </Link>{" "}
                or text privately in our WhatsApp numbers.
              </Text>

              <Text className="mb-4 font-sans text-base leading-7 text-gray-700">
                This is an automated email. Please do not reply.
              </Text>

              <Text className="font-sans text-base leading-7 text-gray-700">
                Best,
                <br />
                EmpowerHer Directors
              </Text>

              <EmailFooter customMessage="This is an automated reminder email from EmpowerHer." />
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

ReminderEmail.templateName = "reminders" as const;

ReminderEmail.PreviewProps = {
  content:
    "Please remember to accept your Google Classroom invitation and complete your initial setup before the deadline.",
  dueDate: "December 10, 2025, 11:59 PM EST",
  timeRemaining: "in 3 days",
} satisfies ReminderEmailProps;
