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

interface ApproveStudentEmailProps {
  name?: string;
  workshopName?: string;
  googleClassroomCode?: string;
  dueDate?: string;
}

export default function ApproveStudentEmail({
  name = "",
  workshopName = "",
  googleClassroomCode = "",
  dueDate = "",
}: ApproveStudentEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 py-2.5">
          <Preview>
            Congratulations! You&apos;ve been accepted into EmpowerHer&apos;s{" "}
            {workshopName}
          </Preview>
          <Container className="border border-gray-100 bg-white p-11">
            <Img
              src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTbc5Ufv9xopPYBqCUaZOIeEGDyJzvSfLh2M0n"
              width="80"
              alt="EmpowerHer Logo"
            />
            <Section>
              <Text className="mb-6 font-sans text-2xl font-bold text-gray-900">
                Dear {name},
              </Text>

              <Text className="mb-4 font-sans text-base leading-7 text-gray-700">
                Congratulations! We are thrilled to inform you that you have
                been accepted into EmpowerHer&apos;s {workshopName}.
              </Text>

              <div className="mb-6 rounded-lg bg-blue-50 p-6">
                <Text className="mb-4 font-sans text-lg font-semibold text-gray-900">
                  Next Steps
                </Text>

                <Text className="mb-3 font-sans text-base leading-7 text-gray-700">
                  To get started, please join your workshop on Google Classroom
                  using this code: <strong>{googleClassroomCode}</strong>.
                </Text>

                <Text className="mb-3 font-sans text-base leading-7 text-gray-700">
                  <strong>Important:</strong> Please accept your invitations by{" "}
                  {dueDate}.
                </Text>

                <Text className="mb-3 font-sans text-base leading-7 text-gray-700">
                  If you are unfamiliar with Google Classroom, please watch this
                  tutorial:{" "}
                  <Link
                    href="https://youtu.be/qSxNLaWm74g"
                    className="text-blue-600 underline"
                  >
                    https://youtu.be/qSxNLaWm74g
                  </Link>
                  .
                </Text>
              </div>

              <div className="mb-6 rounded-lg bg-yellow-50 p-6">
                <Text className="mb-3 font-sans text-base leading-7 text-gray-700">
                  <strong>Important Note:</strong> You are responsible for
                  joining your first Google Meet session with your own internet;
                  your assigned mentor will inform you of your MIS application
                  (if you have applied) decision during your first Google Meet
                  session.
                </Text>
              </div>

              <Text className="mb-4 font-sans text-base leading-7 text-gray-700">
                This is an automated email. Please do not reply. If you have any
                questions, reach out to your mentor(s) via Google Classroom.
              </Text>

              <Text className="mb-4 font-sans text-base leading-7 text-gray-700">
                We look forward to seeing you at the workshop!
              </Text>

              <Text className="font-sans text-base leading-7 text-gray-700">
                Best,
                <br />
                EmpowerHer Team of Mentors
              </Text>

              <EmailFooter customMessage="This is an automated acceptance email from EmpowerHer." />
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

ApproveStudentEmail.templateName = "approve-student" as const;

ApproveStudentEmail.PreviewProps = {
  name: "Sarah Johnson",
  workshopName: "Creative Art Workshop",
  googleClassroomCode: "e5y22pk",
  dueDate: "May 10, 2025",
} satisfies ApproveStudentEmailProps;
