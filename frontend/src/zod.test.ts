import { expect, test } from "vitest";
import { z } from "zod";

test("validates a string", () => {
  const schema = z.string();

  expect(schema.parse("test")).toBe("test");
});