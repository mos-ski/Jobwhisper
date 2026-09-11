# Root Landing Page Restoration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the public Jobwhisper homepage experience at `/` from the last known-good historical implementation.

**Architecture:** Keep the existing root route and app shell intact. Replace only the root landing-page module with its known-good `16c213b` version, add a focused DOM regression test, and update the web route manifest to describe the restored experience.

**Tech Stack:** React 19, TypeScript, React Router, Vite, Vitest, Testing Library, Tailwind CSS.

## Task 1: Lock the intended homepage contract

- [x] Add `src/apps/web/pages/landing-page.test.tsx`.
- [x] Assert the public-site hero, supporting copy, navigation, primary actions, and interactive demo affordance.
- [x] Run the focused test and confirm it fails against the redesigned local page.

## Task 2: Restore the known-good page

- [x] Restore `src/apps/web/pages/landing-page.tsx` exactly from commit `16c213b`.
- [x] Update the `/` row in `src/apps/web/MANIFEST.md` to describe the restored sections.
- [x] Run the focused test and confirm it passes.

## Task 3: Verify and commit the scoped restoration

- [x] Run the full test suite, production build, and `git diff --check`.
- [x] Compare local `/` with `https://www.jobwhisper.ai/` at desktop width.
- [x] Commit only the landing page, regression test, manifest row, and implementation plan.
