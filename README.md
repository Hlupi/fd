# Forecast Dashboard

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).
You can see the deployed version [here](https://fd-frontend-991905200096.europe-west4.run.app/)

## Getting Started

Add [Skapa component library](https://skapa.ikea.net/) npm registry:

```shell
npm set @ingka:registry https://npm.m2.blue.cdtapps.com
```

Install npm packages:

```bash
npm install
```

Start the NextJS development server:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

### Unit Tests

```sh
npm run test
```

or

```sh
npm run test:ui
```

This project uses

- [Vitest](https://vitest.dev/) as a test runner
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) to test components
- [Axe](https://github.com/chaance/vitest-axe) to check for a11y violations

### End-to-End Tests

```sh
npm run e2e
```

or

```sh
npm run e2e:dev
```

This project uses

- [Cypress](https://docs.cypress.io/guides/overview/why-cypress) as the testing tool
- [Cypress Testing Library](https://testing-library.com/docs/cypress-testing-library/intro/) selectors to query elements
- [Axe](https://github.com/component-driven/cypress-axe) to check for a11y violations
- API requests are mocked using cy.intercept() and fixtures
