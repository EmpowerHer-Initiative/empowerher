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

export default function RejectStudentEmail() {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 py-2.5">
          <Preview>Thank you for applying to EmpowerHer</Preview>
          <Container className="border border-gray-100 bg-white p-11">
            <Img
              src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTbc5Ufv9xopPYBqCUaZOIeEGDyJzvSfLh2M0n"
              width="80"
              alt="EmpowerHer Logo"
            />
            <Section>
              <Text className="mb-6 font-sans text-2xl font-bold text-gray-900">
                Dear Applicant,
              </Text>

              <Text className="mb-4 font-sans text-base leading-7 text-gray-700">
                Thank you for applying to EmpowerHer. We appreciate the time and
                effort you put into your application.
              </Text>

              <Text className="mb-4 font-sans text-base leading-7 text-gray-700">
                After careful review, we regret to inform you that you have not
                been selected for this round of our workshops. Due to limited
                seats, we are unable to accept all applicants.
              </Text>

              <Text className="mb-4 font-sans text-base leading-7 text-gray-700">
                We encourage you to stay connected for future opportunities and
                our next round of applications (You can still apply to our
                workshops in the next rounds). Please remember that every Afghan
                girl&apos;s story is strong and noteworthy, and yours was one of
                them.
              </Text>

              <Text className="mb-4 font-sans text-base leading-7 text-gray-700">
                We appreciate your interest and hope to see your application in
                the future.
              </Text>

              <Text className="font-sans text-base leading-7 text-gray-700">
                Best,
                <br />
                EmpowerHer Team of Mentors
              </Text>

              <EmailFooter customMessage="This is an automated rejection email from EmpowerHer." />
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

RejectStudentEmail.templateName = "reject-student" as const;

RejectStudentEmail.PreviewProps = {};
