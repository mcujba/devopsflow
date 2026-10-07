import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useEffect } from "react";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/app/actions/contact", () => ({
  submitContact: vi.fn(),
}));

// next/script calls onReady once the script is loaded and again on every mount.
vi.mock("next/script", () => {
  function ScriptMock({ src, onReady }: { src: string; onReady?: () => void }) {
    useEffect(() => onReady?.(), [onReady]);
    return <script data-testid="turnstile-script" data-src={src} />;
  }
  return { default: ScriptMock };
});

import { cleanup, render } from "@testing-library/react";
import { ContactForm } from "@/components/contact/contact-form";

const turnstile = {
  render: vi.fn(() => "widget-1"),
  remove: vi.fn(),
};

beforeEach(() => {
  vi.stubGlobal("turnstile", turnstile);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("ContactForm captcha", () => {
  it("loads Turnstile in explicit mode so the page controls when the widget is drawn", () => {
    const { getByTestId } = render(<ContactForm />);
    expect(getByTestId("turnstile-script").getAttribute("data-src")).toBe(
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",
    );
  });

  it("draws the widget inside the form every time the form is mounted", () => {
    const first = render(<ContactForm />);
    expect(turnstile.render).toHaveBeenCalledTimes(1);
    const [container] = turnstile.render.mock.calls[0] as unknown as [HTMLElement];
    expect(first.container.querySelector("form")?.contains(container)).toBe(true);

    first.unmount();
    render(<ContactForm />);
    expect(turnstile.render).toHaveBeenCalledTimes(2);
  });

  it("removes the widget when the form leaves the page", () => {
    const { unmount } = render(<ContactForm />);
    unmount();
    expect(turnstile.remove).toHaveBeenCalledWith("widget-1");
  });
});
