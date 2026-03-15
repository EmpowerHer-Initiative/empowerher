import { Footer } from "@/services/email/components/footer";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface SetupAccountProps {
  setupAccountLink?: string;
  customerName?: string;
}

export default function SetupAccount({
  setupAccountLink,
  customerName = "there",
}: SetupAccountProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white font-sans text-black">
          <Preview>Welcome! Set up your Dream Website account</Preview>
          <Container className="mx-auto max-w-2xl p-8">
            <Section className="bg-white">
              <Section className="p-8">
                <Heading className="mb-6 text-2xl font-bold text-black">
                  Welcome to Dream Website! 🎉
                </Heading>
                <Text className="mb-6 text-base leading-6 text-gray-700">
                  Hi {customerName},
                </Text>
                <Text className="mb-6 text-base leading-6 text-gray-700">
                  Thank you for your purchase! We&apos;re excited to have you on
                  board. To get started, you&apos;ll need to set up your account
                  password.
                </Text>

                <Section className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                  <Link
                    href={setupAccountLink}
                    className="inline-block rounded-lg bg-black px-8 py-3 text-base font-semibold text-white no-underline"
                  >
                    Set Up Your Account
                  </Link>
                </Section>

                <Text className="mb-6 text-sm text-gray-600">
                  This link will expire in 1 hour for your security. Once
                  you&apos;ve set up your password, you&apos;ll have full access
                  to your account.
                </Text>

                <Text className="mb-6 text-sm text-gray-600">
                  If the button doesn&apos;t work, you can copy and paste this
                  link into your browser:
                </Text>

                <Text className="rounded border border-gray-200 bg-gray-50 p-3 text-xs break-all text-gray-500">
                  {setupAccountLink}
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

SetupAccount.PreviewProps = {
  setupAccountLink: "https://dreamwebsite.com/reset-password?token=abc123",
  customerName: "John Doe",
} satisfies SetupAccountProps;
