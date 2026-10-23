import { describe, expect, it } from "vitest";
import { shouldRetryQuery } from "./queryClient";

describe("shouldRetryQuery", () => {
  it("retries transient server and network failures at most twice", () => {
    expect(shouldRetryQuery(0, { isAxiosError: true, response: { status: 503 } })).toBe(true);
    expect(shouldRetryQuery(1, new Error("network error"))).toBe(true);
    expect(shouldRetryQuery(2, new Error("network error"))).toBe(false);
  });

  it("does not retry client errors", () => {
    expect(shouldRetryQuery(0, { isAxiosError: true, response: { status: 404 } })).toBe(false);
    expect(shouldRetryQuery(0, { isAxiosError: true, response: { status: 401 } })).toBe(false);
  });
});