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

export interface ContactEmailProps {
  siteName?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
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

export default function ContactEmail({
  siteName = "EmpowerHer",
  name = "Nahid Karimi",
  email = "nahid@example.com",
  phone = "+1 (555) 123-4567",
  subject = "Mentorship program",
  message = "Hi — I'd love to learn more about the mentorship program.",
  submittedAt = new Date().toISOString(),
}: ContactEmailProps) {
  const submitted = new Date(submittedAt).toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <Html>
      <Head />
      <Preview>{`New message from ${name}${subject ? ` — ${subject}` : ""}`}</Preview>
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
              New Contact Message
            </Text>
            <Text
              style={{ margin: "4px 0 0", fontSize: "14px", color: "#6b7280" }}
            >
              {siteName}
            </Text>
          </Section>
          <Hr style={{ borderTop: "1px solid #e5e7eb", margin: "24px 32px" }} />
          <Section style={{ padding: "0 32px" }}>
            <table cellPadding={0} cellSpacing={0} style={{ width: "100%" }}>
              <tbody>
                <Row k="Name" v={name} />
                <Row k="Email" v={email} />
                {phone ? <Row k="Phone" v={phone} /> : null}
                {subject ? <Row k="Subject" v={subject} /> : null}
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
