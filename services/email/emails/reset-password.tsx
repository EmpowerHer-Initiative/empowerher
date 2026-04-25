import EmailLayout from "@/services/email/components/layout";
import { Heading, Link, Section, Text } from "@react-email/components";

import { siteConfig } from "@/lib/site";

interface ResetPasswordProps {
  resetPasswordLink?: string;
}

export default function ResetPassword({
  resetPasswordLink,
}: ResetPasswordProps) {
  return (
    <EmailLayout preview={`${siteConfig.name} — Reset your password`}>
      <Heading
        className="mt-0 mb-4 text-xl font-bold"
        style={{ color: "#111111" }}
      >
        Reset your password
      </Heading>
      <Text className="mb-6 text-base leading-6 text-gray-600">
        Click the button below to reset your password.
      </Text>

      <Section className="mb-6 text-center">
        <Link
          href={resetPasswordLink}
          className="inline-block px-8 py-3 text-sm font-semibold no-underline"
          style={{
            backgroundColor: siteConfig.emailPrimaryColor,
            borderRadius: "6px",
            color: "#ffffff",
          }}
        >
          Reset Password
        </Link>
      </Section>

      <Text className="mb-4 text-sm text-gray-400">
        This link expires in 1 hour. If you didn&apos;t request this, you can
        safely ignore this email.
      </Text>

      <Text className="mb-1 text-xs text-gray-400">
        If the button doesn&apos;t work, copy and paste this link:
      </Text>
      <Text
        className="m-0 p-3 text-xs break-all text-gray-400"
        style={{
          backgroundColor: "#f5f5f5",
          borderRadius: "6px",
        }}
      >
        {resetPasswordLink}
      </Text>
    </EmailLayout>
  );
}

ResetPassword.PreviewProps = {
  resetPasswordLink: `${siteConfig.url}/reset-password?token=abc123`,
} satisfies ResetPasswordProps;
