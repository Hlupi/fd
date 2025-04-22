export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

export const originalInnerWidth = window.innerWidth;
export const changeInnerWidth = (value: number) =>
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value,
  });
