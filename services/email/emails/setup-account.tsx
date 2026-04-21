import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { siteConfig } from "@/lib/site";

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
        <Body
          className="font-sans"
          style={{
            backgroundColor: siteConfig.emailPrimaryColor,
            margin: 0,
            padding: 0,
          }}
        >
          <Preview>Welcome! Set up your {siteConfig.name} account</Preview>
          <Container className="mx-auto max-w-xl px-4 py-12">
            {/* Brand header */}
            <Section className="mb-6 text-center">
              <Img
                src={siteConfig.emailLogoUrl}
                width="40"
                height="40"
                alt={siteConfig.name}
                className="mx-auto"
              />
            </Section>

            {/* Card */}
            <Section
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <Section className="px-10 pt-10 pb-6">
                <Heading
                  className="mt-0 mb-4 text-2xl font-bold"
                  style={{ color: "#111111" }}
                >
                  Welcome to {siteConfig.name}!
                </Heading>
                <Text className="mb-6 text-base leading-6 text-gray-600">
                  Hi {customerName},
                </Text>
                <Text className="mb-6 text-base leading-6 text-gray-600">
                  Thank you for your purchase! We&apos;re excited to have you on
                  board. To get started, you&apos;ll need to set up your account
                  password.
                </Text>

                {/* CTA */}
                <Section className="mb-6 text-center">
                  <Link
                    href={setupAccountLink}
                    className="inline-block px-8 py-3 text-base font-semibold text-white no-underline"
                    style={{
                      backgroundColor: siteConfig.emailPrimaryColor,
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                  >
                    Set Up Your Account
                  </Link>
                </Section>

                <Text className="mb-4 text-sm text-gray-500">
                  This link will expire in 1 hour for your security. Once
                  you&apos;ve set up your password, you&apos;ll have full access
                  to your account.
                </Text>

                <Text className="mb-2 text-sm text-gray-500">
                  If the button doesn&apos;t work, copy and paste this link:
                </Text>

                <Text
                  className="p-3 text-xs break-all text-gray-400"
                  style={{
                    backgroundColor: "#f9f9f9",
                    borderRadius: "6px",
                    border: "1px solid #eeeeee",
                  }}
                >
                  {setupAccountLink}
                </Text>
              </Section>

              {/* Footer inside card */}
              <Section
                className="px-10 py-6"
                style={{ borderTop: "1px solid #f0f0f0" }}
              >
                <Text className="mb-2 text-xs text-gray-400">
                  For your security, we will never ask you to verify your
                  password, credit card, or banking information via email.
                </Text>
                <Text className="m-0 text-xs text-gray-400">
                  Questions?{" "}
                  <Link
                    href={`mailto:${siteConfig.supportEmail}`}
                    style={{ color: siteConfig.emailPrimaryColor }}
                    className="no-underline"
                  >
                    Contact support
                  </Link>{" "}
                  &middot;{" "}
                  <Link
                    href={`${siteConfig.url}/privacy`}
                    style={{ color: siteConfig.emailPrimaryColor }}
                    className="no-underline"
                  >
                    Privacy
                  </Link>{" "}
                  &middot;{" "}
                  <Link
                    href={`${siteConfig.url}/terms`}
                    style={{ color: siteConfig.emailPrimaryColor }}
                    className="no-underline"
                  >
                    Terms
                  </Link>
                </Text>
              </Section>
            </Section>

            {/* Outer footer */}
            <Section className="mt-6 text-center">
              <Text
                className="m-0 text-xs"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                &copy; {new Date().getFullYear()} {siteConfig.name}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

SetupAccount.PreviewProps = {
  setupAccountLink: `${siteConfig.url}/reset-password?token=abc123`,
  customerName: "John Doe",
} satisfies SetupAccountProps;
