import { Link, Section, Text } from "@react-email/components";

import EmailLayout from "../components/layout";

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
    <EmailLayout
      preview={`Congratulations! You've been accepted into EmpowerHer's ${workshopName}`}
    >
      <Text className="m-0 mb-6 text-2xl font-bold text-gray-900">
        Dear {name},
      </Text>

      <Text className="m-0 mb-4 text-base leading-7 text-gray-700">
        Congratulations! We are thrilled to inform you that you have been
        accepted into EmpowerHer&apos;s {workshopName}.
      </Text>

      <Section className="mb-6 rounded-lg bg-blue-50 p-6">
        <Text className="m-0 mb-4 text-lg font-semibold text-gray-900">
          Next Steps
        </Text>

        <Text className="m-0 mb-3 text-base leading-7 text-gray-700">
          To get started, please join your workshop on Google Classroom using
          this code: <strong>{googleClassroomCode}</strong>.
        </Text>

        <Text className="m-0 mb-3 text-base leading-7 text-gray-700">
          <strong>Important:</strong> Please accept your invitations by{" "}
          {dueDate}.
        </Text>

        <Text className="m-0 mb-3 text-base leading-7 text-gray-700">
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
      </Section>

      <Section className="mb-6 rounded-lg bg-yellow-50 p-6">
        <Text className="m-0 mb-3 text-base leading-7 text-gray-700">
          <strong>Important Note:</strong> You are responsible for joining your
          first Google Meet session with your own internet; your assigned mentor
          will inform you of your MIS application (if you have applied) decision
          during your first Google Meet session.
        </Text>
      </Section>

      <Text className="m-0 mb-4 text-base leading-7 text-gray-700">
        This is an automated email. Please do not reply. If you have any
        questions, reach out to your mentor(s) via Google Classroom.
      </Text>

      <Text className="m-0 mb-4 text-base leading-7 text-gray-700">
        We look forward to seeing you at the workshop!
      </Text>

      <Text className="m-0 text-base leading-7 text-gray-700">
        Best,
        <br />
        EmpowerHer Team of Mentors
      </Text>
    </EmailLayout>
  );
}

ApproveStudentEmail.templateName = "approve-student" as const;

ApproveStudentEmail.PreviewProps = {
  name: "Sarah Johnson",
  workshopName: "Creative Art Workshop",
  googleClassroomCode: "e5y22pk",
  dueDate: "May 10, 2025",
} satisfies ApproveStudentEmailProps;
