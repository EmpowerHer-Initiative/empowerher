"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import { sendTestEmail, sendTestEmailWithAttachment } from "./actions";

const Hero = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );
  const [attachStatus, setAttachStatus] = useState<
    "idle" | "loading" | "sent" | "error"
  >("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    setStatus("loading");
    const result = await sendTestEmail();
    setStatus("error" in result ? "error" : "sent");
  };

  const handleSendWithAttachment = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setAttachStatus("loading");
    const formData = new FormData();
    formData.append("file", file);
    const result = await sendTestEmailWithAttachment(formData);
    setAttachStatus("error" in result ? "error" : "sent");
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

      <div className="flex flex-col items-center gap-2">
        <input ref={fileRef} type="file" className="text-sm" />
        <Button
          onClick={handleSendWithAttachment}
          disabled={attachStatus === "loading"}
          variant="outline"
        >
          {attachStatus === "loading"
            ? "Sending..."
            : attachStatus === "sent"
              ? "Sent!"
              : attachStatus === "error"
                ? "Failed — try again"
                : "Send with Attachment"}
        </Button>
      </div>
    </section>
  );
};

export default function LandingPage() {
  return <Hero />;
}
