import type { Block } from "./types";

/* Authoring format for post bodies: blank-line separated blocks.
     ## Heading / ### Heading
     > quote
     - bullet  (consecutive ones become one list)
     ``` fenced code ```
     anything else -> paragraph
   A block editor would be a lot of UI for one author; this is not. */

export function parseBody(text: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: string[] = [];
  let code: string[] = [];
  let mode: "p" | "ul" | "code" | null = null;

  const flush = () => {
    if (mode === "ul" && list.length) blocks.push({ type: "ul", content: list });
    else if (mode === "code") blocks.push({ type: "code", content: code.join("\n") });
    else if (mode === "p") {
      const joined = para.join(" ").trim();
      if (joined) blocks.push({ type: "p", content: joined });
    }
    para = [];
    list = [];
    code = [];
    mode = null;
  };

  for (const raw of text.replace(/\r\n/g, "\n").split("\n")) {
    if (raw.trim().startsWith("```")) {
      const closing = mode === "code";
      flush();
      if (!closing) mode = "code";
      continue;
    }
    if (mode === "code") {
      code.push(raw);
      continue;
    }

    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    if (line.startsWith("### ")) {
      flush();
      blocks.push({ type: "h3", content: line.slice(4) });
      continue;
    }
    if (line.startsWith("## ")) {
      flush();
      blocks.push({ type: "h2", content: line.slice(3) });
      continue;
    }
    if (line.startsWith("> ")) {
      flush();
      blocks.push({ type: "blockquote", content: line.slice(2) });
      continue;
    }
    if (/^[-*] /.test(line)) {
      if (mode !== "ul") {
        flush();
        mode = "ul";
      }
      list.push(line.slice(2));
      continue;
    }
    if (mode !== "p") {
      flush();
      mode = "p";
    }
    para.push(line);
  }

  flush();
  return blocks;
}

export function serializeBody(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "h2":
          return `## ${b.content}`;
        case "h3":
          return `### ${b.content}`;
        case "blockquote":
          return `> ${b.content}`;
        case "code":
          return "```\n" + b.content + "\n```";
        case "ul":
          return (b.content as string[]).map((i) => `- ${i}`).join("\n");
        default:
          return String(b.content);
      }
    })
    .join("\n\n");
}
