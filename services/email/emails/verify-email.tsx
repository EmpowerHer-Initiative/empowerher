import { Heading, Section, Text } from "@react-email/components";

import { siteConfig } from "@/lib/site";
import EmailLayout from "@/services/email/components/layout";

interface VerifyEmailProps {
  verificationCode?: string;
}

export default function VerifyEmail({ verificationCode }: VerifyEmailProps) {
  return (
    <EmailLayout preview={`${siteConfig.name} — Verify your email`}>
      <Heading
        className="mt-0 mb-4 text-xl font-bold"
        style={{ color: "#111111" }}
      >
        Verify your email
      </Heading>
      <Text className="mb-6 text-base leading-6 text-gray-600">
        Enter this code to verify your email address.
      </Text>

      <Section
        className="mb-6 p-6 text-center"
        style={{
          backgroundColor: "#f5f5f5",
          borderRadius: "6px",
        }}
      >
        <Text
          className="my-0 font-mono text-3xl font-bold"
          style={{ color: "#111111", letterSpacing: "0.15em" }}
        >
          {verificationCode}
        </Text>
      </Section>

      <Text className="m-0 text-sm text-gray-400">
        This code expires in 10 minutes. If you didn&apos;t request this, you
        can safely ignore this email.
      </Text>
    </EmailLayout>
  );
}

VerifyEmail.templateName = "verify-email" as const;

VerifyEmail.PreviewProps = {
  verificationCode: "596853",
} satisfies VerifyEmailProps;
