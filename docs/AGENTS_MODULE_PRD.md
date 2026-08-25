# Agents Module — Product Requirements Document

**Product:** Lightforth  
**Feature:** AI Agents Monitoring — Career Specialist Dashboard  
**Version:** 1.0  
**Status:** Ready for development  
**Last updated:** June 2026

---

## Background

Lightforth automates the job application process for students using a pipeline of four AI agents. These agents run continuously on each student's behalf — finding relevant jobs, scoring matches, tailoring resumes, and submitting applications.

Student Success Managers (SSMs) are Lightforth staff who manage a portfolio of students enrolled in the auto-apply programme. Currently, SSMs have no visibility into what the agents are doing for each student. They cannot confirm the pipeline is running, understand why certain jobs were prioritised or rejected, or know when an application was submitted.

This feature adds an **Agents monitoring tab** inside each student's profile in the Career Specialist dashboard, giving SSMs real-time visibility into the full agent pipeline.

---

## Objective

Build a live, view-only monitoring interface that lets SSMs observe AI agent activity for any student — from job discovery through application submission — in a single screen.

---

## Users

**Student Success Managers (SSMs)**  
Internal Lightforth staff. They are not technical users. They use this screen to stay informed about a student's pipeline and to prepare for student check-in calls. They do not control the agents — they only observe.

---

## The Four Agents

The pipeline runs in sequence. Each agent depends on the output of the one before it.

| Agent | What it does |
|---|---|
| **Scout** | Continuously scans job boards — LinkedIn, Greenhouse, Workday, Lever, Indeed — for open roles matching the student's profile (target title, location, seniority, certifications, salary range) |
| **Filter** | Scores every job Scout finds against the student's profile. Jobs scoring 85% or above are passed down the pipeline. The rest are rejected with a reason |
| **Tailor** | For each job that passes Filter, rewrites the student's base resume to match the specific job description. Runs an ATS simulation to verify keyword coverage. Generates a tailored cover letter |
| **Driver** | Takes the tailored resume and cover letter and submits the application through the employer's ATS or application portal. Fills all required form fields automatically |

---

## Feature Requirements

### 1. Student Profile Shell

Each student in the Career Specialist dashboard has a profile page. It includes a header with the student's name, target role, and location, and a tab navigation bar with three tabs: **Overview**, **Agents**, and **Applications**.

The **Agents** tab should be the default active tab when a student profile is opened.

---

### 2. Stats Summary

At the top of the Agents tab, display four counters showing running totals for the current agent session:

- **Found** — total job postings discovered by Scout
- **Matched** — jobs that passed Filter's scoring threshold
- **Tailored** — resumes successfully tailored by Tailor
- **Applied** — applications successfully submitted by Driver

The counters update in real time as the agents work.

---

### 3. Agent Status Cards

Below the stats, show one card for each of the four agents. Each card displays:

- The agent's name
- Its current status: **Running**, **Working**, or **Idle**
  - Running = actively scanning or processing
  - Working = engaged in a specific task (e.g. tailoring a resume)
  - Idle = waiting for input from an upstream agent
- A one-line description of what the agent is currently doing (e.g. "Scanning Workday and Lever" or "Building resume for Goldman Sachs")

Status and task descriptions update live.

---

### 4. Live Activity Feed

Below the agent cards, a full-width panel displays a chronological log of all agent activity. New entries appear at the bottom and the feed auto-scrolls to the latest event.

**Each event in the feed includes:**

- The name of the agent that fired the event
- A timestamp
- A plain-English description of the action taken — written with enough context to be useful. For example: *"Scored 6 LinkedIn jobs — 4 passed (≥85% match), 2 rejected. Top match: GRC Analyst at Barclays (91%). Passed roles queued for resume tailoring."*
- An **internal reasoning line** shown in smaller, muted italic text below the main message — the agent's internal logic for the decision. For example: *"Rejected: KPMG requires Big 4 background not in profile. EY title mismatch."*
- **Blue text links** for any documents or job postings associated with the event. For example:
  - When Tailor creates a resume: links to "Resume — Company Name.pdf" and "Cover letter — Company Name.pdf"
  - When Scout finds a job: link to the job posting
  - When Driver submits: link to the submitted application record

**Tab filtering**

Above the feed, a tab bar lets the SSM filter the log by agent: **All / Scout / Filter / Tailor / Driver**.

On the **All** tab, Scout events appear at the primary level and downstream agent events (Filter, Tailor, Driver) are visually indented beneath them, showing that they are working on Scout's output. Downstream events also appear in a slightly lighter text weight to reinforce the hierarchy.

On a **per-agent tab**, all events for that agent appear at full visual weight with no indentation — a flat view focused on one agent only.

A **Live** indicator in the top-right corner of the feed panel confirms the feed is active.

---

## Design Direction

- Clean, minimal interface — typography and layout carry the hierarchy, not decorative elements
- White card panels on a light blue-grey background (`#eef4ff`)
- Consistent with Lightforth's existing design system — fonts, colours, and component styles should match the rest of the product
- The feed should feel like a live activity log, not a data table

---

## What This Feature Is Not

- SSMs cannot pause, restart, or modify agent behaviour from this screen
- This screen does not show historical sessions from previous days
- This is not a student-facing feature — students do not see this view
- The Applications tab (separate) handles detailed application records and status tracking

---

## Success Criteria

- An SSM can open any student profile and immediately understand what the agents are doing right now
- The feed updates without requiring a page refresh
- Each feed event contains enough information that the SSM does not need to ask a developer what happened
- The interface matches the visual quality of the rest of the Lightforth product

---

## Out of Scope for v1

- Real-time backend integration (v1 uses simulated data)
- SSM ability to flag or annotate events
- Session history across multiple days
- Export or share feed as a report
- Push notifications when an application is submitted
