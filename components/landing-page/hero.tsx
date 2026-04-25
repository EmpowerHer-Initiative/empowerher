"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { sendTestEmail } from "./actions";

export const Hero = () => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSend() {
    setStatus("loading");
    const result = await sendTestEmail();
    if (result.success) {
      setStatus("success");
      setMessage("Email sent! Check your inbox.");
    } else {
      setStatus("error");
      setMessage(result.error ?? "Failed to send email");
    }
  }

  return (
    <section
      id="hero"
      className="flex flex-col items-center gap-4 py-20 text-center"
    >
      <h1 className="text-2xl font-bold">Hero Section</h1>
      <Button onClick={handleSend} disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send Email"}
      </Button>
      {message && (
        <p
          className={status === "error" ? "text-destructive" : "text-green-600"}
        >
          {message}
        </p>
      )}
    </section>
  );
};
