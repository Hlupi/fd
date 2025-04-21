import mockRouter from "next-router-mock";
import { axe } from "vitest-axe";

import { render, screen, userEvent } from "@/test/utils";
import { Filter } from "./filter";

const renderFilter = () =>
  render(<Filter name="Filter 1" values={["option 1", "option 2"]} />);

describe("Filter", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/");
  });

  it("should display a filter with correct name ", () => {
    renderFilter();
    const button = screen.getByRole("button", { name: /Filter by Filter 1/i });
    expect(button).toBeInTheDocument();
  });

  it("should toggle a filter to show & hide options", async () => {
    renderFilter();
    const button = screen.getByRole("button", { name: /Filter by Filter 1/i });
    expect(screen.queryByRole("list")).not.toBeInTheDocument();

    await userEvent.click(button);
    expect(screen.getByRole("list")).toBeInTheDocument();

    const options = screen.getAllByRole("checkbox");
    expect(options.length).toBe(2);

    await userEvent.click(button);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("should toggle update search params", async () => {
    mockRouter.push("/");
    renderFilter();
    const button = screen.getByRole("button", { name: /Filter by Filter 1/i });
    await userEvent.click(button);
    const option1 = screen.getByRole("checkbox", { name: /option 1/i });
    await userEvent.click(option1);
    expect(mockRouter).toMatchObject({
      asPath: "/?Filter+1=option+1",
      pathname: "/",
      query: { "Filter 1": "option 1" },
    });
  });

  it("should show selected filter if it's in the params", async () => {
    mockRouter.push("/?Filter+1=option+2");
    renderFilter();
    const button = screen.getByRole("button", { name: /Filter by Filter 1/i });
    await userEvent.click(button);
    const option2 = screen.getByRole("checkbox", { name: /option 2/i });
    expect(option2).toBeChecked();
  });

  it("should remove a filter value when an active filter is clicked", async () => {
    mockRouter.push("/?Filter+1=option+2");
    renderFilter();
    const button = screen.getByRole("button", { name: /Filter by Filter 1/i });
    await userEvent.click(button);
    const option2 = screen.getByRole("checkbox", { name: /option 2/i });
    await userEvent.click(option2);
    expect(option2).not.toBeChecked();
    expect(mockRouter).toMatchObject({
      asPath: "/",
      pathname: "/",
    });
  });

  it("should have no axe violations", async () => {
    const { container } = renderFilter();
    expect(await axe(container)).toHaveNoViolations();
  });
});
