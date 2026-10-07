import { describe, it, expect } from "vitest";
import en from "../../messages/en.json";
import ro from "../../messages/ro.json";
import ru from "../../messages/ru.json";

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === "string" ? [`${prefix}${key}`] : flatten(value, `${prefix}${key}.`),
  );
}

const keys = {
  en: flatten(en as Tree).sort(),
  ro: flatten(ro as Tree).sort(),
  ru: flatten(ru as Tree).sort(),
};

describe("translation files", () => {
  it("have identical keys in every locale", () => {
    expect(keys.ro).toEqual(keys.en);
    expect(keys.ru).toEqual(keys.en);
  });

  it("have no empty values", () => {
    for (const messages of [en, ro, ru]) {
      const empty = Object.entries(messages as Tree).flatMap(([ns, tree]) =>
        Object.entries(tree as Tree)
          .filter(([, value]) => value === "")
          .map(([key]) => `${ns}.${key}`),
      );
      expect(empty).toEqual([]);
    }
  });

  it("contain the redesign keys", () => {
    for (const key of [
      "Nav.menu",
      "Hero.pill",
      "Hero.title_1",
      "Hero.title_2",
      "Services.consulting_short",
      "Home.about_title",
      "NotFound.title",
    ]) {
      expect(keys.en).toContain(key);
    }
  });
});
