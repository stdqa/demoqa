# DemoQA Register & Login — Automation

## Structure

```
components/          Component Object Model (reusable UI widgets, not whole pages)
  RegisterFormComponent.js
  LoginFormComponent.js
  ProfileComponent.js
fixtures/
  fixtures.js        Custom Playwright fixtures (setup/yield/teardown pattern)
utils/
  testData.js         Random, unique test data generator
tests/
  ui/
    register.spec.js  Playwright UI tests
    login.spec.js
  api-karate/
    register.feature  Karate API tests (register + verify + negative cases)
playwright.config.js
package.json
```

## Running the Playwright (UI) tests

```bash
npm install
npx playwright install --with-deps
npm test
```

HTML report: `npm run report`

## Running the Karate (API) test

Requires a Karate/Java setup (standalone Karate jar, or a Maven/Gradle project
with the `karate` dependency). Point it at `tests/api-karate/register.feature`:

```bash
java -jar karate.jar tests/api-karate/register.feature
```

## Design notes

- **Component Object Model**, not Page Object Model: `RegisterFormComponent`,
  `LoginFormComponent`, `ProfileComponent` each model one UI widget. Pages are
  just whatever combination of components a test needs — no per-page classes.
- **Fixtures over setup code in tests**: `registerForm` / `loginForm` navigate
  and hand back a ready component (Playwright's `use()` is the same
  setup → yield → teardown shape as pytest fixtures). `registeredUser` creates
  a user through the API before the test and deletes it afterward, so
  login-only tests don't depend on the UI registration flow at all.
- **No hardcoded tokens/auth state**: as requested, the login tests always go
  through the real login form; only the *setup* of a login-negative test uses
  the API (to create the account), never to bypass login itself.
- **Test data isolation**: every test generates its own unique username via
  `generateUser()`, so tests can run in parallel without colliding on
  "already exists" errors.

## Selectors — please verify before running

The site (`demoqa.com`) has no official docs and its DOM can change between
deployments. Selectors here (`#firstname`, `#userName`, `#password`,
`#register`, `#login`, `#name` for errors, `#userName-value`, `#submit` for
logout, etc.) reflect the well-documented, long-standing structure of this
practice app, but it's worth a quick `npx playwright codegen demoqa.com/register`
check before treating failures as real bugs vs. a selector drift.
