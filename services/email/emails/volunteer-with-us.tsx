import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { EmailFooter } from "../components/email-footer";

interface VolunteerEmailProps {
  firstName?: string;
  lastName?: string;
  businessEmailAddress?: string;
  message?: string;
}

export default function VolunteerEmail({
  firstName = "",
  lastName = "",
  businessEmailAddress = "",
  message = "",
}: VolunteerEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 py-2.5">
          <Preview>
            New Volunteer Submission - {firstName} {lastName}
          </Preview>
          <Container className="border border-gray-100 bg-white p-11">
            <Img
              src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTbc5Ufv9xopPYBqCUaZOIeEGDyJzvSfLh2M0n"
              width="80"
              alt="Logo"
            />
            <Section>
              <Text className="mb-6 font-sans text-2xl font-bold text-gray-900">
                New Volunteer Submission
              </Text>

              <Text className="mb-4 font-sans text-base leading-7 text-gray-700">
                A new person has submitted their information to get involved
                with EmpowerHer.
              </Text>

              <div className="mb-6 rounded-lg bg-gray-50 p-6">
                <Text className="mb-4 font-sans text-lg font-semibold text-gray-900">
                  Contact Information
                </Text>

                <div>
                  <Text className="mb-2 font-sans text-base text-gray-700">
                    <strong>Name:</strong> {firstName} {lastName}
                  </Text>

                  <Text className="mb-2 font-sans text-base text-gray-700">
                    <strong>Email:</strong> {businessEmailAddress}
                  </Text>
                </div>
              </div>

              {message && (
                <div className="mb-6 rounded-lg bg-blue-50 p-6">
                  <Text className="mb-3 font-sans text-lg font-semibold text-gray-900">
                    Message
                  </Text>
                  <Text className="font-sans text-base leading-7 text-gray-700">
                    {message}
                  </Text>
                </div>
              )}

              <div className="mb-6 rounded-lg bg-gray-50 p-6">
                <Text className="font-sans text-base text-gray-700">
                  📎 The applicant&apos;s CV / Resume is attached to this email.
                </Text>
              </div>

              <EmailFooter customMessage="This submission was received from the Volunteer form on the EmpowerHer website." />
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

VolunteerEmail.templateName = "volunteer-with-us" as const;

VolunteerEmail.PreviewProps = {
  firstName: "Alan",
  lastName: "Doe",
  businessEmailAddress: "alan.doe@example.com",
  message:
    "I want to get involved in the project and contribute my technical skills to help empower women in technology.",
} satisfies VolunteerEmailProps;
