/* eslint-disable @typescript-eslint/no-explicit-any */
export const inCypress =
  typeof window !== "undefined" && (window as any)?.Cypress;
