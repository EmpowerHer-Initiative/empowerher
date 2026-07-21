import { Hr, Img, Link, Section, Text } from "@react-email/components";

interface EmailFooterProps {
  showContactInfo?: boolean;
  customMessage?: string;
}

export const EmailFooter = ({
  showContactInfo = true,
  customMessage,
}: EmailFooterProps) => {
  return (
    <>
      <Hr className="my-8 border-gray-200" />

      <Section className="rounded-lg bg-gray-50 p-6">
        {/* Logo */}
        <div className="mb-6 text-center">
          <Img
            src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTbc5Ufv9xopPYBqCUaZOIeEGDyJzvSfLh2M0n"
            width="60"
            alt="EmpowerHer Logo"
            className="mx-auto mb-4"
          />
          <Text className="mb-2 font-sans text-lg font-bold text-gray-900">
            EmpowerHer Initiative
          </Text>
          <Text className="mb-4 font-sans text-sm text-gray-600">
            Empowering Afghan girls through leadership, mentorship, and skill
            building.
          </Text>
        </div>

        {/* Social Links */}
        <div className="mb-6 text-center">
          <Text className="mb-3 font-sans text-sm font-semibold text-gray-900">
            Follow Us
          </Text>
          <div className="mx-auto mb-4 inline-flex gap-4">
            <Link
              href="https://www.facebook.com/share/157naMfgkw"
              className="text-blue-600 underline"
            >
              <Img
                src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTfsYlbQ3C8OG5vkbyTeNds9rYucAtpJg0PMV7"
                width="48"
                height="48"
              />
            </Link>

            <Link
              href="https://www.instagram.com/_empowerher_org"
              className="text-blue-600 underline"
            >
              <Img
                src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT7KN0n5r8z9fanFIbtTmygWp2lveujsorVdkJ"
                width="48"
                height="48"
              />
            </Link>

            <Link
              href="https://www.linkedin.com/company/empowerher-org/"
              className="text-blue-600 underline"
            >
              <Img
                src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTMoULw6Q5dPxX4yzks8aejvpTSgtbZVQfFCHB"
                width="48"
                height="48"
              />
            </Link>
          </div>
        </div>

        {/* Contact Information */}
        {showContactInfo && (
          <div className="mb-6 text-center">
            <Text className="mb-3 font-sans text-sm font-semibold text-gray-900">
              Contact Us
            </Text>
            <div>
              <Text className="font-sans text-sm text-gray-700">
                <strong>Website:</strong>{" "}
                <Link
                  href="https://www.empowerher-initiative.org/"
                  className="text-blue-600 underline"
                >
                  www.empowerher-initiative.org
                </Link>
              </Text>
              <Text className="font-sans text-sm text-gray-700">
                <strong>Email:</strong>{" "}
                <Link
                  href="mailto:info@empowerher-initiative.org"
                  className="text-blue-600 underline"
                >
                  info@empowerher-initiative.org
                </Link>
              </Text>
            </div>
          </div>
        )}

        {/* Custom Message */}
        {customMessage && (
          <div className="mb-6 text-center">
            <Text className="font-sans text-sm text-gray-600">
              {customMessage}
            </Text>
          </div>
        )}

        {/* Footer Text */}
        <div className="text-center">
          <Text className="mb-2 font-sans text-xs text-gray-500">
            EST. 2024 | United States of America
          </Text>
          <Text className="font-sans text-xs text-gray-500">
            &copy; {new Date().getFullYear()} EmpowerHer Initiative. All rights
            reserved.
          </Text>
        </div>
      </Section>
    </>
  );
};
