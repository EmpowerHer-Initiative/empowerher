import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface VolunteerEmailProps {
  siteName?: string;
  name: string;
  email: string;
  message: string;
  cvFilename: string;
  submittedAt: string;
}

const label = {
  fontSize: "13px",
  color: "#6b7280",
  margin: "0",
  padding: "4px 0",
  width: "160px",
  verticalAlign: "top" as const,
};

const value = {
  fontSize: "13px",
  color: "#111827",
  margin: "0",
  padding: "4px 0",
};

const Row = ({ k, v }: { k: string; v: string }) => (
  <tr>
    <td style={label}>{k}</td>
    <td style={value}>{v}</td>
  </tr>
);

export default function VolunteerEmail({
  siteName = "EmpowerHer",
  name = "Mariam Rahimi",
  email = "mariam@example.com",
  message = "I'd like to volunteer as a mentor for the education program.",
  cvFilename = "mariam-rahimi-cv.pdf",
  submittedAt = new Date().toISOString(),
}: VolunteerEmailProps) {
  const submitted = new Date(submittedAt).toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <Html>
      <Head />
      <Preview>{`Volunteer application — ${name}`}</Preview>
      <Body
        style={{
          backgroundColor: "#ffffff",
          margin: 0,
          fontFamily:
            "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
        }}
      >
        <Container style={{ maxWidth: "600px", margin: "0 auto" }}>
          <Section
            style={{ backgroundColor: "#1E78C4", height: "4px", width: "100%" }}
          />
          <Section style={{ padding: "32px 32px 0" }}>
            <Text
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              New Volunteer Application
            </Text>
            <Text style={{ margin: "4px 0 0", fontSize: "14px", color: "#6b7280" }}>
              {siteName}
            </Text>
          </Section>
          <Hr style={{ borderTop: "1px solid #e5e7eb", margin: "24px 32px" }} />
          <Section style={{ padding: "0 32px" }}>
            <table cellPadding={0} cellSpacing={0} style={{ width: "100%" }}>
              <tbody>
                <Row k="Name" v={name} />
                <Row k="Email" v={email} />
                <Row k="CV attached" v={cvFilename} />
                <Row k="Submitted" v={submitted} />
              </tbody>
            </table>
          </Section>
          <Hr style={{ borderTop: "1px solid #e5e7eb", margin: "24px 32px" }} />
          <Section style={{ padding: "0 32px 32px" }}>
            <Text
              style={{
                margin: 0,
                fontSize: "13px",
                color: "#111827",
                whiteSpace: "pre-wrap",
              }}
            >
              {message}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
