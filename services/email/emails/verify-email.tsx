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

interface VerifyEmailProps {
  verificationCode?: string;
}

export default function VerifyEmail({
  verificationCode = "",
}: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 py-2.5">
          <Preview>Verify your EmpowerHer email address</Preview>
          <Container className="border border-gray-100 bg-white p-11">
            <Img
              src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTbc5Ufv9xopPYBqCUaZOIeEGDyJzvSfLh2M0n"
              width="80"
              alt="EmpowerHer Logo"
            />
            <Section>
              <Text className="mb-6 font-sans text-2xl font-bold text-gray-900">
                Verify your email
              </Text>

              <Text className="mb-4 font-sans text-base leading-7 text-gray-700">
                Enter the code below to verify your email address and finish
                setting up your account.
              </Text>

              <div className="mb-6 rounded-lg bg-blue-50 p-6 text-center">
                <Text
                  className="my-0 font-mono text-3xl font-bold text-gray-900"
                  style={{ letterSpacing: "0.15em" }}
                >
                  {verificationCode}
                </Text>
              </div>

              <Text className="mb-4 font-sans text-base leading-7 text-gray-700">
                This code expires in 10 minutes. If you didn&apos;t request
                this, you can safely ignore this email.
              </Text>

              <Text className="mb-4 font-sans text-base leading-7 text-gray-700">
                This is an automated email. Please do not reply.
              </Text>

              <Text className="font-sans text-base leading-7 text-gray-700">
                Best,
                <br />
                EmpowerHer Team
              </Text>

              <EmailFooter customMessage="This is an automated verification email from EmpowerHer." />
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

VerifyEmail.templateName = "verify-email" as const;

VerifyEmail.PreviewProps = {
  verificationCode: "596853",
} satisfies VerifyEmailProps;
