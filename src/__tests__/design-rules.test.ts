import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "__tests__" ? [] : sourceFiles(path);
    return /\.(tsx?|css)$/.test(name) ? [path] : [];
  });
}

const files = sourceFiles("src").map((path) => ({ path, text: readFileSync(path, "utf8") }));

function offenders(pattern: RegExp): string[] {
  return files.filter(({ text }) => pattern.test(text)).map(({ path }) => path);
}

describe("design rules", () => {
  it("keeps the old gradient look out of the codebase", () => {
    expect(offenders(/text-gradient|bg-gradient-solid|backdrop-blur/)).toEqual([]);
  });

  it("has a single theme and no theme library", () => {
    // `dark:` followed by a letter is a Tailwind variant; the Shiki theme map in blog.ts is `dark: "…"`.
    expect(offenders(/next-themes|dark:[a-z]/)).toEqual([]);
  });

  it("does not use the generic default typeface", () => {
    expect(offenders(/Inter_Tight|\bInter\b/)).toEqual([]);
  });

  it("has no pill-shaped controls", () => {
    expect(offenders(/rounded-full/)).toEqual([]);
  });

  it("limits client components to the language keys and the contact form", () => {
    expect(offenders(/^"use client"/m).sort()).toEqual([
      "src/components/contact/contact-form.tsx",
      "src/components/layout/language-switcher.tsx",
    ]);
  });

  it("uses exactly one accent colour token", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    const tokens = [...css.matchAll(/--color-([a-z-]+):/g)].map((m) => m[1]);
    expect(tokens).toEqual([
      "desk", "desk-ink", "desk-muted", "enamel", "paper", "well",
      "ink", "ink-muted", "red", "lcd", "lcd-ink", "socket", "edge",
    ]);
  });
});
