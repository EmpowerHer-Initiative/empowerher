"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { sendTestEmail } from "./actions";

const Hero = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );

  const handleSend = async () => {
    setStatus("loading");
    const result = await sendTestEmail();
    setStatus("error" in result ? "error" : "sent");
  };

  return (
    <section
      id="hero"
      className="flex flex-col items-center gap-4 py-20 text-center"
    >
      <h1 className="text-2xl font-bold">Hero Section</h1>
      <Button onClick={handleSend} disabled={status === "loading"}>
        {status === "loading"
          ? "Sending..."
          : status === "sent"
            ? "Sent!"
            : status === "error"
              ? "Failed — try again"
              : "Send Test Email"}
      </Button>
    </section>
  );
};

export default function LandingPage() {
  return <Hero />;
}
