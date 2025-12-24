import { marked } from "marked";

marked.use({
  gfm: true,
  breaks: true,
});

export function renderMarkdown(markdown?: string | null): string {
  if (!markdown) return "";
  // Tina content is editorial (trusted). If you ever allow untrusted input, sanitize here.
  return marked.parse(markdown) as string;
}


