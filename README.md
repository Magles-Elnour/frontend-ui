# MaglesElnour

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

Temporary mock APIs and login are enabled for development builds while backend CORS is being
fixed. Enter any non-empty username and password to sign in as a local admin.
The session survives page reloads in the same tab, and logout clears it. Login,
session restoration, and logout do not call the backend in this mode, and the fake
token is never attached to API requests. All `/api/` requests stay local. The current
auth and member endpoints return mock responses, including member creation, editing,
soft deletion, name/status filters, and pagination. The members list starts with
eight sample records, and changes persist across reloads in browser local storage.
Translation files and other assets load normally. Unknown API endpoints return a
local 404 instead of contacting the backend.

To restore the real backend and login in development, set `ENABLE_MOCK_BACKEND` to
`false` in `src/app/core/auth/auth.config.ts`. Production builds always use the real
backend. To reset the sample member data, remove `mock-api-members-v1` from browser
local storage and reload.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
