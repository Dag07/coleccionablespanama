<p align="center">
  <img src="https://raw.githubusercontent.com/coleccionablespanama/coleccionablespanama/master/.github/logo.svg" alt="Coleccionables Panamá" width="120px">
</p>

# Coleccionables Panamá - Frontend Monorepo

Spanish-language collectibles marketplace for Pokémon cards, rare coins, and authentic collectibles from Panama.

[![Continuous Integration](https://github.com/coleccionablespanama/coleccionablespanama/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/coleccionablespanama/coleccionablespanama/actions/workflows/ci.yml)
[![CodeQL](https://github.com/coleccionablespanama/coleccionablespanama/actions/workflows/codeql.yml/badge.svg?branch=master)](https://github.com/coleccionablespanama/coleccionablespanama/actions/workflows/codeql.yml)
[![Codacy Security Scan](https://github.com/coleccionablespanama/coleccionablespanama/actions/workflows/codacy.yml/badge.svg?branch=master)](https://github.com/coleccionablespanama/coleccionablespanama/actions/workflows/codacy.yml)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/a3c2b7e4c8654547927789ca983f3b93)](https://www.codacy.com/gh/coleccionablespanama/coleccionablespanama/dashboard?utm_source=github.com&utm_medium=referral&utm_content=coleccionablespanama/coleccionablespanama&utm_campaign=Badge_Grade)

## 🚀 Quick Start

### Option 1: Start Everything at Once (Recommended)

```bash
./start-dev.sh
```

This starts both the mock API server and the frontend dev server.

### Option 2: Start Servers Separately

**Terminal 1 - Start Mock API:**

```bash
npm run api
```

Mock API will run at: http://localhost:3001

**Terminal 2 - Start Frontend:**

```bash
npx nx serve main
```

Frontend will run at: http://localhost:4200

## 📡 Mock API

This project uses **JSON Server** to provide realistic mock data during development.

- **API Docs:** See [API-SETUP.md](./API-SETUP.md) for complete documentation
- **Test Interface:** Open `api-test.html` in your browser to visually test the API
- **Endpoints:**
  - `GET http://localhost:3001/assets` - Collectibles (Pokémon cards & coins)
  - `GET http://localhost:3001/collections` - Themed collections
  - `GET http://localhost:3001/bundles` - Item bundles

## Development server

Run `npx nx serve main` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Running unit tests

Run `nx test main` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `nx e2e main-e2e` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Build

Run `nx build main` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

# Contributing

## Generate an application

Run `nx g @nrwl/react:app new-react-app` to generate an react application.

Run `nx g @nrwl/next:app new-next-app` to generate an next application.

## Code scaffolding

Run `nx g @nrwl/react:component new-component-name --project=main` to generate a new component.

Run `nx g @nrwl/react:page new-page-name --project=main` to generate a new paage.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `nx g @nrwl/react:lib new-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `coleccionablespanama/newlib`.

## For more info

Visit the [Nx Documentation](https://nx.dev) to learn more.
