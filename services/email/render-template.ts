import { createElement, type ComponentType } from "react";
import type { EmailTemplateName } from "@/services/db/schema";
import { render } from "@react-email/render";

type TemplateComponent = ComponentType<Record<string, string | undefined>>;

export async function renderTemplate(
  template: EmailTemplateName,
  props: Record<string, string>
): Promise<string> {
  const mod = await import(`./emails/${template}`);
  const Component: TemplateComponent = mod.default;
  return render(createElement(Component, props));
}
