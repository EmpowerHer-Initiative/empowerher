import { createElement, type ComponentType } from "react";
import { render } from "@react-email/render";

import type { EmailTemplateName } from "@/services/db/schema";

type TemplateComponent = ComponentType<Record<string, string | undefined>>;

export async function renderTemplate(
  template: EmailTemplateName,
  props: Record<string, string>
): Promise<string> {
  const mod = await import(`./emails/${template}`);
  const Component: TemplateComponent = mod.default;
  return render(createElement(Component, props));
}
