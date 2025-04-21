import mockRouter from "next-router-mock";
import { axe } from "vitest-axe";
import { render, screen, userEvent, within } from "@/test/utils";
import { DateFilter, formatToString } from "./date-filter";
import { format } from "date-fns";

function addOrdinalSuffix(n: number) {
  if (n > 3 && n < 21) return n + "th";

  switch (n % 10) {
    case 1:
      return n + "st";
    case 2:
      return n + "nd";
    case 3:
      return n + "rd";
    default:
      return n + "th";
  }
}

function formatDate(date: Date) {
  const dayOfWeek = format(date, "EEEE");
  const month = format(date, "MMMM");
  const dayOfMonth = format(date, "d");
  const year = format(date, "yyyy");

  const dayWithOrdinal = addOrdinalSuffix(parseInt(dayOfMonth));

  return `${dayOfWeek}, ${month} ${dayWithOrdinal}, ${year}`;
}

const renderDateFilter = (props = {}) =>
  render(<DateFilter name="from" {...props} />);

describe("DateFilter", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/");
  });

  it("should render with default label", () => {
    renderDateFilter();
    const button = screen.getByRole("button", { name: /From/i });
    expect(button).toBeInTheDocument();
  });

  it("should display the correct label", async () => {
    renderDateFilter();
    const button = screen.getByRole("button", { name: /From/i });
    expect(button).toBeInTheDocument();
    await userEvent.click(button);

    const calendar = screen.getByRole("dialog", { name: /From date picker/i });
    const dayButton = within(calendar).getByRole("button", {
      name: `Today, ${formatDate(new Date())}`,
    });
    await userEvent.click(dayButton);
    expect(button).toHaveTextContent(format(new Date(), "dd MMM"));
  });

  it("should open the date picker when the pill is clicked", async () => {
    renderDateFilter();
    const button = screen.getByRole("button", { name: /From/i });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await userEvent.click(button);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should update the filter when a date is selected", async () => {
    renderDateFilter();
    const button = screen.getByRole("button", { name: /From/i });

    await userEvent.click(button);
    const dayButton = screen.getByRole("button", {
      name: `Today, ${formatDate(new Date())}`,
    });
    await userEvent.click(dayButton);
    const selectedDateString = formatToString(new Date());

    expect(mockRouter).toMatchObject({
      asPath: `/?from=${selectedDateString}`,
      pathname: "/",
      query: { from: `${selectedDateString}` },
    });
  });

  it("should remove the filter when the date is cleared", async () => {
    renderDateFilter();
    const button = screen.getByRole("button", { name: /From/i });

    await userEvent.click(button);
    const dayButton = screen.getByRole("button", {
      name: `Today, ${formatDate(new Date())}`,
    });
    await userEvent.click(dayButton);

    await userEvent.click(dayButton);
    expect(mockRouter).toMatchObject({
      asPath: "/",
      query: {},
    });
  });

  it("should initialize with the correct date from query params", async () => {
    mockRouter.push("/?from=2025-04-19");
    renderDateFilter();

    const button = screen.getByRole("button", { name: /19 Apr/i });
    expect(button).toBeInTheDocument();
  });

  it("should have no axe violations", async () => {
    const { container } = renderDateFilter();
    expect(await axe(container)).toHaveNoViolations();
  });
});
