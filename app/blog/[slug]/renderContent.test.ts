import { test } from "node:test";
import assert from "node:assert/strict";
import { renderContent, renderInline } from "./renderContent";

test("renders h2 and h3 headings", () => {
  const html = renderContent("## Part 1\n\n### DDoS");
  assert.match(html, /<h2[^>]*>Part 1<\/h2>/);
  assert.match(html, /<h3[^>]*>DDoS<\/h3>/);
});

test("groups consecutive bullet lines into one ul", () => {
  const html = renderContent("- one\n- two");
  assert.equal(html.match(/<ul/g)?.length, 1);
  assert.equal(html.match(/<li/g)?.length, 2);
});

test("renders numbered lines as an ordered list", () => {
  const html = renderContent("1. Ingest\n2. Retrieve");
  assert.match(html, /<ol[^>]*><li[^>]*>Ingest<\/li><li[^>]*>Retrieve<\/li><\/ol>/);
});

test("joins paragraph lines and splits paragraphs on blank lines", () => {
  const html = renderContent("line a\nline b\n\nline c");
  assert.equal(html.match(/<p /g)?.length, 2);
  assert.match(html, />line a line b<\/p>/);
});

test("renders a callout with its leading emoji as the icon", () => {
  const html = renderContent("> 💡 **Core** idea");
  assert.match(html, /role="note"/);
  assert.match(html, /<span aria-hidden="true"[^>]*>💡<\/span>/);
  assert.match(html, /<strong[^>]*>Core<\/strong> idea/);
});

test("renders an image line as a captioned figure", () => {
  const html = renderContent("![Layers](/blog/x.svg)");
  assert.match(html, /<figure/);
  assert.match(html, /<img src="\/blog\/x.svg" alt="Layers"/);
  assert.match(html, /<figcaption[^>]*>Layers<\/figcaption>/);
});

test("renders fenced code verbatim and escaped, including blank lines", () => {
  const html = renderContent("before\n\n```http\nX-A: 1\n\n**not bold** <b>\n```\n\nafter");
  assert.match(html, /<pre[^>]*><code>X-A: 1\n\n\*\*not bold\*\* &lt;b&gt;<\/code><\/pre>/);
  assert.match(html, />before<\/p>/);
  assert.match(html, />after<\/p>/);
});

test("escapes raw HTML in text", () => {
  assert.equal(renderInline("<script>alert(1)</script>"), "&lt;script&gt;alert(1)&lt;/script&gt;");
});

test("does not apply bold inside code spans", () => {
  const html = renderInline("`a **b** c` and **d**");
  assert.match(html, /<code[^>]*>a \*\*b\*\* c<\/code>/);
  assert.match(html, /<strong[^>]*>d<\/strong>/);
});

test("only links https URLs", () => {
  assert.match(renderInline("[OWASP](https://owasp.org)"), /<a href="https:\/\/owasp.org" target="_blank" rel="noopener noreferrer"/);
  assert.doesNotMatch(renderInline("[x](javascript:alert(1))"), /<a /);
});
