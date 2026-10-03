# AI Resume Playwright E2E

This repository contains the Playwright automation suite for the AI Resume website. The website and API must be running separately; this repository contains test code, not the application server.

## Setup

```powershell
npm ci
npx playwright install
Copy-Item .env.example .env
```

Set `BASE_URL` in `.env` to the running website URL. Set `TEST_EMAIL` and `TEST_PASSWORD` to an existing QA account for tests that need authentication. `API_BASE_URL` is reserved for API checks.

## Run tests

```powershell
npm test                                      # all configured browsers/devices
npm run test:chrome                           # Desktop Chrome
npm run test:firefox                          # Desktop Firefox
npm run test:mobile-chrome                    # Pixel 5
npm run test:mobile-safari                    # iPhone 14 Pro
npm run test:auth                             # registration flow and auth edge cases
npm run test:upload                            # resume upload validation
npm run test:analysis                          # resume analysis
npm run test:profile                           # profile and settings
npm run test:navigation                        # navigation and session
npm run test:critical                          # complete real-user journey on Desktop Chrome
npm run test:full-system                       # register, upload, analyze, navigate, and logout
npm run test:features                          # authentication, routes, navigation, and logout on all devices
npm run test:extended                          # all extended scenarios
npx playwright test tests/full-system.spec.ts --project="Desktop Chrome" # click register from sign-in and check all protected pages
npm run report                                # open latest HTML report
```

The suite covers app availability, authentication validation, registration/login, protected navigation, profile settings, resume upload validation, analysis results, result persistence after reload, logout protection, and mobile UI. Tests requiring a pre-existing account need valid `TEST_EMAIL` and `TEST_PASSWORD` values. The new-member upload and full-system flows require `REGISTRATION_NAME`, `REGISTRATION_EMAIL`, and `REGISTRATION_PASSWORD`; the test derives a unique email using plus-addressing from `REGISTRATION_EMAIL`, so the configured domain must accept plus-addresses. Authenticated tests are skipped with a clear reason when credentials are not configured.

## Project layout

- `playwright.config.ts`: browser/device projects and reporting
- `pages/`: page objects for authentication, dashboard, upload, analysis, and settings
- `tests/`: smoke, registration, dashboard, upload, analysis, and extended browser scenarios
- `utils/testData.ts`: environment values and test data helpers
- `utils/testFiles.ts`: generated PDF and invalid upload fixtures
