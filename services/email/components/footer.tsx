import { Link, Section, Text } from "@react-email/components";

export const Footer = () => {
  return (
    <Section className="border-t border-gray-200 p-8">
      <Text className="mb-4 text-sm text-gray-600">
        For your security, we will never ask you to verify your password, credit
        card, or banking information via email.
      </Text>

      <Text className="text-xs text-gray-500">
        This email was sent by Dream Website. If you have any questions, please{" "}
        <Link
          href="mailto:support@dreamwebsite.com"
          className="text-black underline"
        >
          contact our support team
        </Link>
        . View our{" "}
        <Link href="/privacy" className="text-black underline">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms" className="text-black underline">
          Terms of Service
        </Link>
        .
      </Text>
    </Section>
  );
};
