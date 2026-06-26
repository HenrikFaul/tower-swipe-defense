# Smart Site Autopilot Checks

## Purpose

Use `../qa-automation/` as the runtime browser automation layer for visual and interaction regression checks.

## Run Checklist

- [ ] Start the website in a local or disposable staging environment.
- [ ] Run `npm install` once in `AI_PROMPTING_FOLDERSTRUCTURE/qa-automation`.
- [ ] Run `npx playwright install chromium` once.
- [ ] If the app requires login, capture or configure a dedicated test-account session first.
- [ ] Execute `npm run audit -- --url <target-url>`.
- [ ] Open the generated `report.html`.
- [ ] Open `execution-log.md` and identify the last successful milestone and first failed milestone.
- [ ] Review screenshots.
- [ ] Review failed actions.
- [ ] Review console errors.
- [ ] Review page errors.
- [ ] Review failed network requests.
- [ ] Classify risky skipped actions.
- [ ] Review business concept and value proposition summary.
- [ ] Review technology hints and analytics/traffic-measurement signals.
- [ ] Review UI/UX, usability, user-friendliness, contextual-fit, speed, responsiveness, reliability, and passive security sections.
- [ ] Confirm separate Markdown files were generated under `business-analysis/`.
- [ ] If control files were used, confirm `controlPlan` and BPMN milestones are represented in `report.json` and `execution-log.md`.

## Acceptance Signal

A run is release-supporting when:

- critical pages are visited
- primary navigation is exercised
- tabs and menus have screenshot evidence
- no unexpected page errors are present
- no unexpected failed requests are present
- failed actions have a documented reason
- business analysis does not contradict the intended page purpose
- passive security observations have been triaged or accepted

## Authenticated Run Checklist

- [ ] Use a non-admin, disposable test account.
- [ ] Prefer `npm run auth:capture` for custom, magic-link, SSO, captcha, or 2FA flows.
- [ ] Use `--auth storage-state` for the main audit after session capture.
- [ ] Use `--auth form` only for simple predictable email/password forms.
- [ ] Do not commit files from `qa-automation/auth/`.
- [ ] Re-capture auth state when the saved session expires.

## Non-Regression Notes

The crawler is evidence-generating, not a replacement for deterministic unit or integration tests. Promote repeated failures into stable Playwright specs once the behavior is important and expected.
