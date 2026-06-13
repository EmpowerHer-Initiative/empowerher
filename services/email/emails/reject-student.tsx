import { Text } from "@react-email/components";

import EmailLayout from "../components/layout";

export default function RejectStudentEmail() {
  return (
    <EmailLayout preview="Thank you for applying to EmpowerHer">
      <Text className="m-0 mb-6 text-2xl font-bold text-gray-900">
        Dear Applicant,
      </Text>

      <Text className="m-0 mb-4 text-base leading-7 text-gray-700">
        Thank you for applying to EmpowerHer. We appreciate the time and effort
        you put into your application.
      </Text>

      <Text className="m-0 mb-4 text-base leading-7 text-gray-700">
        After careful review, we regret to inform you that you have not been
        selected for this round of our workshops. Due to limited seats, we are
        unable to accept all applicants.
      </Text>

      <Text className="m-0 mb-4 text-base leading-7 text-gray-700">
        We encourage you to stay connected for future opportunities and our next
        round of applications (You can still apply to our workshops in the next
        rounds). Please remember that every Afghan girl&apos;s story is strong
        and noteworthy, and yours was one of them.
      </Text>

      <Text className="m-0 mb-4 text-base leading-7 text-gray-700">
        We appreciate your interest and hope to see your application in the
        future.
      </Text>

      <Text className="m-0 text-base leading-7 text-gray-700">
        Best,
        <br />
        EmpowerHer Team of Mentors
      </Text>
    </EmailLayout>
  );
}

RejectStudentEmail.templateName = "reject-student" as const;

RejectStudentEmail.PreviewProps = {};
