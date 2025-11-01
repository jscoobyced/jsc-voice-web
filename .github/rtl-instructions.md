---
description: "Guidelines and best practices for writing unit and component tests using React Testing Library (RTL) and Vitest"
applyTo: "**/*.{test,spec}.{js,jsx,ts,tsx}"
---

# React Testing Library (RTL) & Unit Test Instructions

These guidelines describe how to write high-quality, maintainable unit and component tests for React applications using React Testing Library (RTL), Vitest, user-event, and MSW (Mock Service Worker). Follow these to ensure tests are reliable, readable, and fast.

## Goals

- Encourage tests that reflect how users interact with the UI
- Keep tests fast and deterministic
- Ensure good coverage of behavior, accessibility, and critical paths
- Maintainable and reusable test utilities and patterns

## Tools & Recommended Versions

- React Testing Library (latest v) — prefer RTL over shallow rendering
- Vitest — choose one consistently across the repo
- @testing-library/user-event for user interactions
- msw (Mock Service Worker) for network mocking in tests
- @testing-library/jest-dom for matchers
- Testing utilities: custom render with providers, fixtures, test-ids helper

## File Organization & Naming

- Place tests adjacent to code when practical:
  - components/Button.tsx → components/Button.test.tsx
- Alternatively, mirror src in a **tests** folder:
  - src/components/**tests**/Button.test.tsx
- Use `.test.tsx` / `.spec.tsx` consistently. Prefer `.test.tsx` for unit/component tests.
- Keep unit tests small and focused; integration tests may span multiple components.

## Test Types

- Unit tests: single component small scope, mocking external dependencies
- Integration tests: multiple components and logic interacting (preferred with RTL)
- End-to-end (E2E): separate from RTL (Cypress/Playwright)

Label tests clearly with describe/context blocks to indicate scope.

## Test Structure & Style

Follow Arrange — Act — Assert (AAA) structure:

- Arrange: render and prepare props/state/mocks
- Act: perform user interactions via user-event
- Assert: assert behavior/state/DOM

Keep tests readable:

- Use descriptive test names: it('shows loading spinner while fetching story')
- Avoid asserting implementation details (internal state, component internals)
- Prefer queries that resemble how users find elements (getByRole, getByLabelText, getByText). Reserve getByTestId for exceptional cases.

Example ordering:

- describe('ComponentName', () => {
  - it('does X when Y', async () => { /_ AAA _/ })
  - it('renders fallback when ...', () => { /_ AAA _/ })
  - })

## Queries & Accessibility

- Prefer:
  - getByRole(role, { name: /label/i })
  - getByLabelText, getByPlaceholderText, getByText
- Avoid relying primarily on data-testid — use semantic queries first.
- Ensure components expose accessible names and roles (aria-label, aria-labelledby) so tests become accessibility checks too.
- Include a11y regressions: use axe or jest-axe in CI for critical UIs.

## User interactions

- Use @testing-library/user-event for interactions (typing, clicking, keyboard).
- Await user-event calls where they return promises (e.g., userEvent.type).
- Prefer user-event over fireEvent for realistic behavior.

## Async code & Waiting

- Use waitFor or findBy\* queries for async expectations.
- Avoid arbitrary timeouts (no setTimeout in tests). Use MSW to control network timing.
- For promises that resolve in effects, await findBy\* with an appropriate matcher.

## Mocking & Network

- Use MSW (Mock Service Worker) for network interactions — tests should mock network at network boundary, not inside components.
- Keep msw handlers in test utilities and reset handlers between tests.
- For modules or functions (e.g., analytics), mock at the module boundary with vi.mock.
- Avoid mocking internal implementation; mock external dependencies only.

## Test Utilities & Custom Render

Create shared testing utilities (e.g., test-utils.tsx):

- Provide a custom render function that wraps components with required providers (Router, Redux/Context, Theme, Intl)
- Export typed helpers:
  - render(ui, {preloadedState, route})
  - userEvent instance if needed
- Keep custom render minimal; pass options for different provider needs.

Example exported utilities:

- renderWithProviders
- server (MSW server) start/stop
- makeFakeUser, makeStoryFixture

## State Management & Context

- For components using context (Theme, Auth, Store), tests should wrap with the minimal provider setup using custom render.
- For complex store states, use preloadedState or small fixtures instead of full app state.

## Timers

- Use fake timers only when testing timer-based behavior explicitly.
- For async code and microtasks prefer real timers to avoid hiding race conditions.
- If using fake timers, restore real timers after test.

## Snapshots

- Use snapshots sparingly for small components with stable markup (icons, small presentational pieces).
- Prefer explicit assertions over large snapshots for components with frequent change.
- Keep snapshot files readable and intentionally updated.

## TypeScript & Test Types

- Type test utilities and custom render return types.
- Use assertive typing for mock functions: vi.Mock.
- Prefer typed fixtures and props to reduce runtime errors in tests.

## Coverage & CI

- Set reasonable coverage thresholds per package (e.g., 80%) and enforce critical coverage for core modules.
- Run tests in CI with a headless runner (node) and a stable environment.
- Run MSW and any setup files in test setup config.

## Flaky Tests & Debugging

- Write deterministic tests: avoid reliance on Date.now or random values; mock them.
- Use debug utilities (screen.debug()) temporarily to inspect DOM in failing tests.
- Isolate flaky test and add more robust waits (findBy\*) or refine expected behavior.

## Test Examples / Patterns

- Test for text and accessible attributes instead of class names.
- Test that user flows progress (click → network call → new content shown).
- Test components render appropriate placeholders during loading and errors.

Minimal test example:

- Arrange:
  - server.use(handlerWithFixture)
  - renderWithProviders(<StoryPlayer />)
- Act:
  - await userEvent.click(screen.getByRole('button', { name: /record/i }))
- Assert:
  - expect(await screen.findByText(/your story begins/i)).toBeInTheDocument()

## Common Anti-patterns

- Do not assert implementation details (internal state or DOM class names) — test user-observable behavior.
- Avoid over-mocking: tests should exercise component logic; mock only external boundaries.
- Don’t use shallow rendering; RTL encourages full render in a JSDOM-like environment.

## Project-level Setup Recommendations

- Provide a test setup file that:
  - configures @testing-library/jest-dom
  - starts/stops MSW server lifecycle
  - exports custom render utilities
- Keep handlers and fixtures in a shared test/fixtures and test/handlers folder.
- Document how to run tests locally and in CI (npm test, npm run test:ci).

## Maintenance & Review

- Keep tests small and focused; update tests alongside component changes.
- Use PR checks to run tests and enforce style/coverage rules.
- Regularly review flaky tests and convert brittle tests into integration tests with MSW.

## Quick Checklist for a Good RTL Test

- [ ] Uses semantic queries (role/label/text) first
- [ ] Uses user-event for interactions
- [ ] Mocks network with MSW or module-mocking only at boundaries
- [ ] Asserts user-observable outcomes (DOM/text/aria)
- [ ] Uses custom render for providers
- [ ] Avoids arbitrary waits/timeouts
- [ ] Keeps tests isolated and deterministic

---

These rules are broad guidance — adapt them where needed for specific components while keeping readability, accessibility, and user-focused assertions as the primary goals.
