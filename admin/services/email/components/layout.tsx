import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { siteConfig } from "@/lib/site";

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
}

export default function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body
          className="font-sans"
          style={{ backgroundColor: "#f6f6f6", margin: 0, padding: 0 }}
        >
          <Preview>{preview}</Preview>
          <Container className="mx-auto max-w-[560px] px-4 py-10">
            {/* Logo */}
            <Section className="mb-8 text-center">
              <Link href={siteConfig.url}>
                <Img
                  src={siteConfig.emailLogoUrl}
                  width="40"
                  height="40"
                  alt={siteConfig.name}
                  className="mx-auto"
                  style={{ borderRadius: "50%" }}
                />
              </Link>
            </Section>

            {/* Content card */}
            <Section
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e5e5e5",
              }}
            >
              <Section className="px-10 py-10">{children}</Section>
            </Section>

            {/* Footer */}
            <Section className="mt-8 text-center">
              <Text className="m-0 text-xs text-gray-400">
                {siteConfig.companyName}
              </Text>
              <Text className="m-0 mt-1 text-xs text-gray-400">
                <Link
                  href={`mailto:${siteConfig.supportEmail}`}
                  className="text-gray-400 underline"
                >
                  Contact Support
                </Link>
                {" · "}
                <Link
                  href={`${siteConfig.url}/legal/privacy`}
                  className="text-gray-400 underline"
                >
                  Privacy
                </Link>
                {" · "}
                <Link
                  href={`${siteConfig.url}/legal/terms`}
                  className="text-gray-400 underline"
                >
                  Terms
                </Link>
              </Text>
              <Hr className="mt-6 border-gray-200" />
              <Text className="m-0 mt-4 text-xs text-gray-300">
                &copy; {new Date().getFullYear()} {siteConfig.companyName}. All
                rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
