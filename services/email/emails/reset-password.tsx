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

interface ResetPasswordProps {
  resetPasswordLink?: string;
}

export default function ResetPassword({
  resetPasswordLink = "",
}: ResetPasswordProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 py-2.5">
          <Preview>Reset your EmpowerHer password</Preview>
          <Container className="border border-gray-100 bg-white p-11">
            <Img
              src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTbc5Ufv9xopPYBqCUaZOIeEGDyJzvSfLh2M0n"
              width="80"
              alt="EmpowerHer Logo"
            />
            <Section>
              <Text className="mb-6 font-sans text-2xl font-bold text-gray-900">
                Reset your password
              </Text>

              <Text className="mb-4 font-sans text-base leading-7 text-gray-700">
                We received a request to reset your password. Click the button
                below to choose a new one.
              </Text>

              <div className="mb-6 text-center">
                <Link
                  href={resetPasswordLink}
                  className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-sans text-base font-semibold text-white no-underline"
                >
                  Reset Password
                </Link>
              </div>

              <Text className="mb-4 font-sans text-base leading-7 text-gray-700">
                This link expires in 1 hour. If you didn&apos;t request a
                password reset, you can safely ignore this email.
              </Text>

              <Text className="mb-2 font-sans text-sm text-gray-600">
                If the button doesn&apos;t work, copy and paste this link into
                your browser:
              </Text>
              <Text className="mb-4 rounded-lg bg-gray-50 p-4 font-sans text-sm break-all text-blue-600">
                {resetPasswordLink}
              </Text>

              <Text className="mb-4 font-sans text-base leading-7 text-gray-700">
                This is an automated email. Please do not reply.
              </Text>

              <Text className="font-sans text-base leading-7 text-gray-700">
                Best,
                <br />
                EmpowerHer Team
              </Text>

              <EmailFooter customMessage="This is an automated password reset email from EmpowerHer." />
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

ResetPassword.templateName = "reset-password" as const;

ResetPassword.PreviewProps = {
  resetPasswordLink:
    "https://www.empowerher-initiative.org/reset-password?token=abc123",
} satisfies ResetPasswordProps;
