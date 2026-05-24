"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ActivateDevTools() {
  const searchParams = useSearchParams();

  useEffect(() => {
    localStorage.setItem("devtools-enabled", "true");

    const redirect = searchParams.get("r");
    if (redirect) {
      window.location.href = redirect;
    } else if (
      document.referrer &&
      new URL(document.referrer).origin === window.location.origin
    ) {
      window.location.href = document.referrer;
    } else {
      window.location.href = "/";
    }
  }, [searchParams]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "system-ui, sans-serif",
        color: "#888",
        fontSize: 14,
      }}
    >
      Activating...
    </div>
  );
}
