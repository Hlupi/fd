import "@testing-library/jest-dom";
import * as jestDomMatchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import * as matchers from "vitest-axe/matchers";
import { afterEach, beforeAll, expect, vi } from "vitest";
import { toHaveNoViolations } from "jest-axe";

expect.extend(jestDomMatchers);
expect.extend(matchers);
expect.extend(toHaveNoViolations);

afterEach(cleanup);

beforeAll(async () => {
  vi.mock("next/navigation", async (importOriginal) => {
    const actual = await importOriginal<typeof import("next/navigation")>();
    const { useRouter } =
      await vi.importActual<typeof import("next-router-mock")>(
        "next-router-mock"
      );
    const usePathname = vi.fn().mockImplementation(() => {
      const router = useRouter();
      return router.pathname;
    });
    const useSearchParams = vi.fn().mockImplementation(() => {
      const router = useRouter();
      let queryString = "";
      if (router.query && typeof router.query === "object") {
        queryString = Object.entries(router.query)
          .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
          .join("&");
      }
      return new URLSearchParams(queryString);
    });
    return {
      ...actual,
      useRouter: vi.fn().mockImplementation(useRouter),
      usePathname,
      useSearchParams,
    };
  });
  vi.mock("next/router", async (importOriginal) => {
    const actual = await importOriginal<typeof import("next/router")>();
    const { useRouter } =
      await vi.importActual<typeof import("next-router-mock")>(
        "next-router-mock"
      );
    return {
      ...actual,
      useRouter: vi.fn().mockImplementation(useRouter),
    };
  });
});
