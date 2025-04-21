import { terminalLog } from "../support/violations-log";

describe("Happy Path: Forecast Dashboard", () => {
  before(() => {
    cy.intercept("https://forecast-mock-api.onrender.com/forecast/", {
      fixture: "forecast.json",
    }).as("forecast");

    cy.visit("/");

    cy.wait("@forecast");
  });

  it("happy path", () => {
    cy.injectAxe();

    cy.findByRole("heading", { name: /Demand forecast/i }).should("be.visible");

    // displays the filters
    cy.findByRole("button", { name: /Filter by Region/i }).should("be.visible");
    cy.findByRole("button", { name: /Filter by Product/i }).should(
      "be.visible"
    );
    cy.findByRole("button", { name: /From/i }).should("be.visible");
    cy.findByRole("button", { name: /To/i }).should("be.visible");

    // displays the table
    cy.findByRole("searchbox", {
      name: /Search through the forecast data/i,
    }).should("be.visible");
    cy.findByRole("table").should("be.visible");
    cy.findAllByRole("row").should("have.length", 11);
    cy.findByRole("button", { name: /First page/i }).should("be.visible");
    cy.findByRole("button", { name: /Last page/i }).should("be.visible");
    cy.findByText(/Showing page 1 of 4/i).should("be.visible");

    // displays the graph
    cy.findByLabelText(/Demand Over Time Chart/i);

    cy.checkA11y(null, null, terminalLog);

    // shows filtered data
    cy.intercept("https://forecast-mock-api.onrender.com/forecast/?*", {
      fixture: "forecast-filtered.json",
    }).as("forecast-filtered");
    cy.findByRole("button", { name: /Filter by Region/i }).click();
    cy.findByRole("checkbox", { name: /EU/i }).check();

    cy.wait("@forecast-filtered");

    cy.findByRole("button", { name: /Filter by Product/i }).click();
    cy.checkA11y(null, null, terminalLog);

    cy.findByRole("checkbox", { name: /Widget A/i }).check();
    cy.findByRole("button", { name: /From/i }).click();
    cy.findByRole("button", { name: /Monday, April 21st, 2025/i }).click();
    cy.checkA11y(null, null, terminalLog);

    cy.get("body").click(0, 0);
    cy.findByRole("button", { name: /To/i }).click();
    cy.findByRole("button", { name: /Tuesday, April 22nd, 2025/i }).click();
    cy.get("body").click(0, 0);

    cy.findAllByRole("row").should("have.length", 3);
    cy.findByText(/Showing page 1 /i).should("not.exist");

    cy.findByRole("searchbox", {
      name: /Search through the forecast data/i,
    }).type("76");
    cy.findAllByRole("row").should("have.length", 2);

    // removes filters and show all data
    cy.findByRole("searchbox", {
      name: /Search through the forecast data/i,
    }).clear();
    cy.findByRole("button", { name: /Filter by Region/i }).click();
    cy.findByRole("checkbox", { name: /EU/i }).uncheck();
    cy.findByRole("button", { name: /Filter by Product/i }).click();
    cy.findByRole("checkbox", { name: /Widget A/i }).uncheck();
    cy.get("body").click(0, 0);
    cy.findByRole("button", { name: /21 Apr/i }).click();
    cy.findByRole("button", { name: /Monday, April 21st, 2025/i }).click();
    cy.get("body").click(0, 0);
    cy.findByRole("button", { name: /22 Apr/i }).click();
    cy.findByRole("button", { name: /Tuesday, April 22nd, 2025/i }).click();
    cy.get("body").click(0, 0);
    cy.findAllByRole("row").should("have.length", 11);
    cy.findByRole("button", { name: /First page/i }).should("be.visible");
    cy.findByRole("button", { name: /Last page/i }).should("be.visible");
    cy.findByText(/Showing page 1 of 4/i).should("be.visible");

    cy.checkA11y(null, null, terminalLog);
  });
});
