/* eslint-disable @typescript-eslint/no-require-imports */
import axe = require("axe-core");

export function fileLog(violations: axe.Result[]) {
  // write all violations to JSON file
  cy.writeFile("./cypress/downloads/a11y_violations.json", violations);
}

export function terminalLog(violations: axe.Result[]) {
  cy.task(
    "log",
    `${violations.length} accessibility violation${
      violations.length === 1 ? "" : "s"
    } ${violations.length === 1 ? "was" : "were"} detected`
  );
  // pluck specific keys to keep the table readable
  const violationData = violations.map(
    ({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.length,
    })
  );

  cy.task("table", violationData);
}
