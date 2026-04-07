import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: siteConfig.pages.contact.title,
  description: siteConfig.pages.contact.description,
};

export default function ContactPage() {
  return <ContactForm />;
}
