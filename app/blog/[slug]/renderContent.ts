// Minimal Markdown-ish renderer for blog posts.
// Supports: ## / ### headings, paragraphs, - and 1. lists, > callouts, | tables |,
// ![alt](src) figures, ``` fenced code, **bold**, `code` and [text](https://…) links.

const STYLES = {
  h2: "font-size:1.4rem;font-weight:700;color:#fff;letter-spacing:-0.5px;margin:3rem 0 1rem;",
  h3: "font-size:1.1rem;font-weight:700;color:#ddd;letter-spacing:-0.3px;margin:2rem 0 0.75rem;",
  p: "margin-bottom:1.2rem;",
  ul: "margin:0 0 1.2rem;padding-left:1.25rem;",
  ol: "margin:0 0 1.2rem;padding-left:1.25rem;list-style:decimal;",
  li: "margin-bottom:0.5rem;padding-left:0.25rem;list-style:inherit;color:#777;",
  ulLi: "list-style:disc;",
  strong: "color:#ddd;",
  code: "font-family:monospace;font-size:0.85em;color:#93c5fd;background:rgba(96,165,250,0.08);padding:0.1em 0.35em;border-radius:3px;word-break:break-word;",
  pre: "font-family:monospace;font-size:13px;line-height:1.7;color:#a5d6a7;background:#0a0a0a;border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:1.25rem 1.5rem;margin:0 0 1.5rem;overflow-x:auto;white-space:pre;",
  callout: "display:flex;gap:0.9rem;align-items:flex-start;margin:0 0 1.5rem;padding:1rem 1.25rem;background:rgba(96,165,250,0.05);border:1px solid rgba(96,165,250,0.15);border-left:3px solid #60a5fa;border-radius:4px;color:#aaa;",
  calloutIcon: "font-size:1.25rem;line-height:1.6;flex-shrink:0;",
  figure: "margin:2rem 0 2.5rem;",
  img: "display:block;width:100%;height:auto;border:1px solid rgba(255,255,255,0.08);border-radius:6px;",
  figcaption: "margin-top:0.75rem;font-family:monospace;font-size:12px;color:#555;text-align:center;",
  a: "color:#60a5fa;text-decoration:underline;text-underline-offset:3px;",
  tableWrap: "overflow-x:auto;margin:0 0 1.5rem;border:1px solid rgba(255,255,255,0.08);border-radius:6px;",
  table: "width:100%;border-collapse:collapse;font-size:14px;line-height:1.6;",
  th: "text-align:left;padding:0.7rem 1rem;color:#ddd;font-weight:600;background:rgba(255,255,255,0.03);border-bottom:1px solid rgba(255,255,255,0.1);white-space:nowrap;",
  td: "padding:0.7rem 1rem;color:#888;border-top:1px solid rgba(255,255,255,0.05);vertical-align:top;",
} as const;

const FENCE = /```[\w-]*\n([\s\S]*?)```/g;
const HEADING = /^(#{2,3}) (.+)$/;
const IMAGE = /^!\[([^\]]*)\]\(([^)\s]+)\)$/;
const UL_ITEM = /^- (.+)$/;
const OL_ITEM = /^\d+\. (.+)$/;
const CALLOUT = /^> ?(.*)$/;
const TABLE_ROW = /^\|(.+)\|\s*$/;
const TABLE_SEPARATOR = /^\|?[\s:|-]+\|?$/;
const LEADING_EMOJI = /^(\p{Extended_Pictographic}️?)\s*/u;

type BlockKind = "p" | "ul" | "ol" | "callout" | "table";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderInline(text: string): string {
  // Pull code spans out first so bold/link rules never touch their contents.
  const codeSpans: string[] = [];
  const withPlaceholders = escapeHtml(text).replace(/`([^`]+)`/g, (_, code: string) => {
    codeSpans.push(`<code style="${STYLES.code}">${code}</code>`);
    return `\u0000${codeSpans.length - 1}\u0000`;
  });

  return withPlaceholders
    .replace(/\*\*(.+?)\*\*/g, `<strong style="${STYLES.strong}">$1</strong>`)
    .replace(
      /\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g,
      `<a href="$2" target="_blank" rel="noopener noreferrer" style="${STYLES.a}">$1</a>`
    )
    .replace(/\u0000(\d+)\u0000/g, (_, i: string) => codeSpans[Number(i)]);
}

function splitCells(row: string): string[] {
  return row.split("|").map((cell) => cell.trim());
}

function renderTable(rows: readonly string[]): string {
  const [header, ...rest] = rows;
  const body = rest.filter((row) => !TABLE_SEPARATOR.test(`|${row}|`));
  const cell = (tag: "th" | "td", text: string) => `<${tag} style="${STYLES[tag]}">${renderInline(text)}</${tag}>`;
  const head = `<tr>${splitCells(header).map((text) => cell("th", text)).join("")}</tr>`;
  const bodyRows = body.map((row) => `<tr>${splitCells(row).map((text) => cell("td", text)).join("")}</tr>`).join("");
  return `<div style="${STYLES.tableWrap}"><table style="${STYLES.table}"><thead>${head}</thead><tbody>${bodyRows}</tbody></table></div>`;
}

function renderBlock(kind: BlockKind, lines: readonly string[]): string {
  if (kind === "table") return renderTable(lines);

  if (kind === "ul" || kind === "ol") {
    const liStyle = kind === "ul" ? STYLES.li + STYLES.ulLi : STYLES.li;
    const items = lines.map((line) => `<li style="${liStyle}">${renderInline(line)}</li>`).join("");
    return `<${kind} style="${STYLES[kind]}">${items}</${kind}>`;
  }

  const text = lines.join(" ");
  if (kind === "callout") {
    const match = text.match(LEADING_EMOJI);
    const icon = match ? `<span aria-hidden="true" style="${STYLES.calloutIcon}">${match[1]}</span>` : "";
    const body = match ? text.slice(match[0].length) : text;
    return `<div role="note" style="${STYLES.callout}">${icon}<div>${renderInline(body)}</div></div>`;
  }

  return `<p style="${STYLES.p}">${renderInline(text)}</p>`;
}

function renderFigure(alt: string, src: string): string {
  const safeAlt = escapeHtml(alt);
  const safeSrc = escapeHtml(src);
  const caption = alt ? `<figcaption style="${STYLES.figcaption}">${safeAlt}</figcaption>` : "";
  return `<figure style="${STYLES.figure}"><a href="${safeSrc}" target="_blank" rel="noopener noreferrer"><img src="${safeSrc}" alt="${safeAlt}" loading="lazy" style="${STYLES.img}" /></a>${caption}</figure>`;
}

function classifyLine(line: string): { kind: BlockKind; body: string } {
  const row = line.match(TABLE_ROW);
  if (row) return { kind: "table", body: row[1] };
  const ul = line.match(UL_ITEM);
  if (ul) return { kind: "ul", body: ul[1] };
  const ol = line.match(OL_ITEM);
  if (ol) return { kind: "ol", body: ol[1] };
  const callout = line.match(CALLOUT);
  if (callout) return { kind: "callout", body: callout[1] };
  return { kind: "p", body: line.trim() };
}

// A block is either pre-rendered HTML (headings, figures) or a run of
// same-kind lines that still needs rendering.
type Block = { html: string } | { kind: BlockKind; lines: readonly string[]; open: boolean };

function renderSingleLine(line: string): string | null {
  const heading = line.match(HEADING);
  if (heading) {
    const tag = heading[1] === "##" ? "h2" : "h3";
    return `<${tag} style="${STYLES[tag]}">${renderInline(heading[2])}</${tag}>`;
  }
  const image = line.match(IMAGE);
  return image ? renderFigure(image[1], image[2]) : null;
}

function appendLine(blocks: readonly Block[], line: string): Block[] {
  const last = blocks[blocks.length - 1];
  const closeLast = () =>
    last && "open" in last && last.open ? [...blocks.slice(0, -1), { ...last, open: false }] : [...blocks];

  if (line.trim() === "") return closeLast();

  const single = renderSingleLine(line);
  if (single !== null) return [...closeLast(), { html: single }];

  const { kind, body } = classifyLine(line);
  if (last && "open" in last && last.open && last.kind === kind) {
    return [...blocks.slice(0, -1), { ...last, lines: [...last.lines, body] }];
  }
  return [...closeLast(), { kind, lines: [body], open: true }];
}

function renderText(text: string): string {
  return text
    .split("\n")
    .reduce<Block[]>(appendLine, [])
    .map((block) => ("html" in block ? block.html : renderBlock(block.kind, block.lines)))
    .join("");
}

export function renderContent(content: string): string {
  const source = content.trim();
  const html: string[] = [];
  let cursor = 0;

  for (const match of source.matchAll(FENCE)) {
    html.push(renderText(source.slice(cursor, match.index)));
    html.push(`<pre style="${STYLES.pre}"><code>${escapeHtml(match[1].replace(/\n$/, ""))}</code></pre>`);
    cursor = (match.index ?? 0) + match[0].length;
  }

  html.push(renderText(source.slice(cursor)));
  return html.join("");
}
