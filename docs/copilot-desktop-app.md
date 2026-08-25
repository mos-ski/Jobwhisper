# Interview Copilot — Desktop App Product Brief

---

## What It Is

Interview Copilot is a real-time AI assistant that sits alongside a user during their actual live job interview. It listens to the conversation, detects what the interviewer is asking, and quietly displays a suggested response on the user's screen — so they always know what to say, without the interviewer ever knowing it's there.

The desktop app is the stealth version of Copilot. It runs invisibly in the background on the user's computer. Even if the interviewer asks the user to share their full screen, the Copilot window cannot be seen. This makes it the go-to solution for interviews happening inside installed apps like Zoom, Microsoft Teams, Slack, or any platform that isn't browser-based.

**Available on:** Windows, Mac (Intel), Mac (Apple Silicon / M-series)

---

## The Full User Journey

### Step 1 — Onboarding and Installation

When the user opens the desktop app for the first time, they land on a welcome screen that explains what Interview Copilot does and walks them through how to set it up correctly. This screen includes:

- A clear description of what the app does and why it's invisible to interviewers
- Step-by-step permission prompts — the user needs to grant Screen Recording access and System Audio access for Copilot to work
- Guidance on where to find these settings if the app doesn't appear in the permissions list (the user clicks the "+" button and manually selects Copilot from their Applications folder)
- A note that the app will restart automatically once permissions are granted and audio will connect correctly after restart
- A **Continue** button to proceed once everything is set up

---

### Step 2 — Session Setup

Before each interview session, the user fills in a short setup form:

- **Job title** — free text input with quick-select suggestions like UI/UX Designer, Software Engineer, and SEO Specialist
- **Resume** — choice between uploading a new resume or using their Lightforth-built resume (recommended). The selected resume filename is shown with an option to remove it
- **Job description** — an optional paste field. There's an AI-powered "Suggest for me" button that auto-generates a relevant job description based on the job title
- **Audio device** — a dropdown to select which microphone Copilot listens through, with a separate button to grant microphone permission if it hasn't been allowed yet. Once a device is connected, it shows a green "Connected" confirmation
- **Don't ask me again** — a checkbox at the bottom of the setup form. If the user checks this, their preferences are saved and the next time they start a session, setup is skipped entirely — they go straight into the live canvas. The settings icon inside the canvas is the only way to undo this.

---

### Step 3 — Response Style Preference

After completing setup, a preference screen appears asking the user to choose how they want Copilot to present suggested answers:

- **Default** — a full, natural-sounding answer written out completely, ready to be read aloud
- **Headlines** — a structured bullet-point response using the STAR format (Situation, Task, Action, Result) that hits every key point clearly
- **Coaching** — short tips and pointers that guide the user toward forming their own answer, rather than reading one out

The user selects one and proceeds to the live canvas.

---

### Step 4 — Live Interview Canvas

This is the core experience. A full dark-screen interface that sits on the user's screen during the interview.

**Status Bar (top of screen)**
Shows two things at all times:
- Network strength — a signal indicator showing connection quality
- Audio status — a live label showing what Copilot is currently doing, in italic grey text. It cycles through three states: *Listening...*, *Processing...*, and *Answering...*

**Live Interview Response Panel**
The main panel where Copilot's suggested answers appear. It has three distinct visual states:

- **Listening** — the panel border glows green, signalling that Copilot is actively picking up audio from the interview
- **Processing** — three bouncing dots appear, indicating the AI is analysing what was just said
- **Answering** — the suggested response streams in at high speed, character by character, like a live typewriter

In the top corner of this panel is a settings icon. Clicking it opens a small popover showing the user's current saved preferences — their role, resume, and whether setup is being skipped — along with a "Reset — show setup next time" button that clears the saved settings.

**Window Settings**
A separate settings area for adjusting how the Copilot window behaves on screen:

- **Stealth mode toggle** — turn stealth mode on or off. When on, the window is invisible to screen sharing software. When off, it behaves like a normal window
- **Transparent background slider** — adjust how opaque or transparent the Copilot window appears against whatever is behind it, so the user can overlay it on top of other applications without it being visually obtrusive
- **Always on top toggle** — when enabled, the Copilot window stays floating above all other active windows so it's always visible to the user, regardless of what app is in focus

**Top Bar**
Shows the job role being interviewed for, a live session timer with a red recording indicator, and an **End Interview** button.

---

### Step 5 — Session Complete

When the user clicks End Interview, a confirmation screen appears letting them know the session has been recorded and saved. A single **Go Home** button returns them to the landing screen.

---

## Pricing and Access

- Interview Copilot is available on **Pro and Premium plans only**
- **1 credit = 1 Copilot session**, including test runs
- The user's remaining credit balance should be clearly visible before they start a session — not after

---

## Important Product Notes

**Don't ask me again** is a key UX feature for returning users. Power users who interview frequently should never have to sit through setup every time. The flow should feel instant — open the app, go live. The settings icon inside the canvas is intentionally the only way to undo this, so it doesn't get triggered accidentally.

**Response Style** (Default / Headlines / Coaching) is shared between the desktop Copilot and Interview Prep on the web. Ideally, whatever style the user practises with in Interview Prep carries over automatically as the default in Copilot, since they're preparing for the same interview.

**Stealth mode is the core differentiator.** This is what makes the desktop app worth downloading instead of just using the web version. The install and permissions flow needs to be clear and reassuring — users need to trust that the setup is correct before their interview starts.

**Always do a test run before the real interview.** The recommended flow is to open a YouTube interview video, start a Copilot session, and confirm that it picks up audio and generates responses before interview day. This uses one credit, so users should be reminded of that upfront.
