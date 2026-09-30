# Jobwhisper Desktop Copilot TikTok Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a verified 45-second vertical tutorial showing how to download, install, configure, and use Jobwhisper Desktop Copilot on Windows and macOS, including a supported Stealth Mode screen-share test.

**Architecture:** Build an isolated deterministic HTML/SVG motion project outside the product repository. Export purpose-built product states from the existing Jobwhisper app, drive every frame through `seek(t)`, capture exact frames in Chromium, and assemble picture, voiceover, music, captions, and SFX with FFmpeg. Keep the product repository read-only except for the approved design and this plan.

**Tech Stack:** HTML, CSS, JavaScript, SVG, Playwright/Chromium, FFmpeg/ffprobe, Node.js, and the Jobwhisper React source/assets.

## Global Constraints

- Output is 1080 × 1920, vertical 9:16, 60 fps, and 43–47 seconds long.
- Use real Jobwhisper branding and real product UI states; use only fictional demo data.
- Show Windows, Mac Apple Silicon, and Mac Intel download choices.
- Represent installation, sign-in, permissions, interview context, response preferences, session start, and Stealth Mode.
- Describe Stealth Mode as privacy-focused display controls for supported environments, never as universally undetectable.
- Include “test before your call” and “use AI assistance only where permitted.”
- Deliver MP4, editable source, voiceover/caption script, and asset/license notes.

---

### Task 1: Establish the isolated production project and source assets

**Files:**
- Create: `/Users/theoneglobal/Documents/Codex/2026-09-30/referenced-chatgpt-conversation-this-is-an-2/work/jobwhisper-copilot-video/package.json`
- Create: `/Users/theoneglobal/Documents/Codex/2026-09-30/referenced-chatgpt-conversation-this-is-an-2/work/jobwhisper-copilot-video/src/storyboard.js`
- Create: `/Users/theoneglobal/Documents/Codex/2026-09-30/referenced-chatgpt-conversation-this-is-an-2/work/jobwhisper-copilot-video/assets/asset-manifest.md`
- Copy selected brand and UI assets into: `/Users/theoneglobal/Documents/Codex/2026-09-30/referenced-chatgpt-conversation-this-is-an-2/work/jobwhisper-copilot-video/assets/`

**Interfaces:**
- Consumes: Jobwhisper wordmark, icon, product screenshots, design tokens, and the approved storyboard.
- Produces: `STORYBOARD`, an ordered immutable array of `{ id, start, end, caption, voiceover }`, plus a traceable asset manifest.

- [ ] **Step 1: Verify local production dependencies**

Run `node --version`, `ffmpeg -version`, `ffprobe -version`, and verify that a Chromium-capable browser automation runtime is available. Record any missing dependency before implementation.

- [ ] **Step 2: Create the production package and storyboard test**

Create a Node package whose `test` script runs `node --test`. Add a test asserting that the first segment begins at `0`, the last ends at `45`, segments are contiguous, and every segment has non-empty caption and voiceover strings.

- [ ] **Step 3: Verify the storyboard test fails**

Run `npm test`. Expected: failure because `src/storyboard.js` does not yet export `STORYBOARD`.

- [ ] **Step 4: Implement the approved timed storyboard**

Export the seven approved segments: hook `0–3`, installer selection `3–10`, installation `10–16`, context `16–26`, response settings `26–33`, live session and Stealth Mode `33–40`, and verification/CTA `40–45`.

- [ ] **Step 5: Copy only required brand/UI assets and document provenance**

Copy the Jobwhisper icon and wordmark plus selected, purpose-built UI captures. Record each source path, intended scene, and license/ownership status in `asset-manifest.md`. Do not copy personal data or credentials.

- [ ] **Step 6: Run the test and commit**

Run `npm test`; expected: pass. Commit the plan completion and production scaffold separately.

### Task 2: Build the deterministic motion film

**Files:**
- Create: `/Users/theoneglobal/Documents/Codex/2026-09-30/referenced-chatgpt-conversation-this-is-an-2/work/jobwhisper-copilot-video/src/index.html`
- Create: `/Users/theoneglobal/Documents/Codex/2026-09-30/referenced-chatgpt-conversation-this-is-an-2/work/jobwhisper-copilot-video/src/style.css`
- Create: `/Users/theoneglobal/Documents/Codex/2026-09-30/referenced-chatgpt-conversation-this-is-an-2/work/jobwhisper-copilot-video/src/timeline.js`
- Create: `/Users/theoneglobal/Documents/Codex/2026-09-30/referenced-chatgpt-conversation-this-is-an-2/work/jobwhisper-copilot-video/test/timeline.test.js`

**Interfaces:**
- Consumes: `STORYBOARD` and local assets.
- Produces: `seek(t: number): void`, which renders any time from `0` through `45` without relying on previous frames.

- [ ] **Step 1: Write timeline boundary tests**

Test clamping, segment selection at every boundary, normalized local progress, deterministic easing, and caption-safe positioning.

- [ ] **Step 2: Run tests to verify they fail**

Run `npm test`; expected: missing timeline exports.

- [ ] **Step 3: Implement pure timeline helpers and `seek(t)`**

Implement clamped time, segment lookup, smooth easing, restrained spring response, camera keys, cursor keys, and per-scene visibility. All state must be derived from `t`.

- [ ] **Step 4: Build the seven scenes**

Use real Jobwhisper colors, logo, downloads UI, configuration view, session controls, Stealth Mode state, and a labeled candidate/shared-view comparison. Keep captions within vertical safe margins.

- [ ] **Step 5: Run tests and inspect keyframes**

Render stills at `1.5`, `6`, `13`, `21`, `29.5`, `36.5`, and `42.5` seconds. Confirm that each visually matches the intended storyboard section.

### Task 3: Produce voiceover, captions, music, and SFX

**Files:**
- Create: `/Users/theoneglobal/Documents/Codex/2026-09-30/referenced-chatgpt-conversation-this-is-an-2/work/jobwhisper-copilot-video/audio/voiceover-script.txt`
- Create: `/Users/theoneglobal/Documents/Codex/2026-09-30/referenced-chatgpt-conversation-this-is-an-2/work/jobwhisper-copilot-video/audio/captions.srt`
- Create: `/Users/theoneglobal/Documents/Codex/2026-09-30/referenced-chatgpt-conversation-this-is-an-2/work/jobwhisper-copilot-video/audio/audio-manifest.md`

**Interfaces:**
- Consumes: exact storyboard voiceover and caption timing.
- Produces: narration WAV, subtitle timing, licensed music/SFX, and an FFmpeg-ready mixed WAV.

- [ ] **Step 1: Fit the narration to 45 seconds**

Generate the approved narration, measure its actual duration, and adjust pauses without removing required claims or safety language.

- [ ] **Step 2: Create synchronized captions**

Create SRT entries matching the seven storyboard segments. Captions must match the spoken words while on-screen emphasis may remain shorter.

- [ ] **Step 3: Add licensed music and restrained interface effects**

Use a documented licensed or generated track. Add quiet click, installer, panel, connection, and Stealth Mode cues. Record provenance in `audio-manifest.md`.

- [ ] **Step 4: Mix and verify audio**

Keep speech clearly dominant, prevent clipping, and confirm the final mix is exactly aligned to the 45-second picture timeline.

### Task 4: Render the master and perform automated checks

**Files:**
- Create: `/Users/theoneglobal/Documents/Codex/2026-09-30/referenced-chatgpt-conversation-this-is-an-2/work/jobwhisper-copilot-video/scripts/render.mjs`
- Create: `/Users/theoneglobal/Documents/Codex/2026-09-30/referenced-chatgpt-conversation-this-is-an-2/work/jobwhisper-copilot-video/scripts/verify.mjs`
- Create: `/Users/theoneglobal/Documents/Codex/2026-09-30/referenced-chatgpt-conversation-this-is-an-2/outputs/jobwhisper-desktop-copilot-45s.mp4`

**Interfaces:**
- Consumes: deterministic HTML film and mixed audio.
- Produces: final H.264/AAC master plus verification report.

- [ ] **Step 1: Implement frame rendering**

Capture 60 output frames per second at 1080 × 1920. Sample four subframes per output frame and blend for motion blur. Wait for fonts and assets before capture.

- [ ] **Step 2: Encode picture and audio**

Use FFmpeg to encode H.264 video with AAC audio and web-compatible pixel format `yuv420p`.

- [ ] **Step 3: Implement automated verification**

Use ffprobe to assert width `1080`, height `1920`, frame rate `60`, duration between `43` and `47` seconds, and presence of one video and one audio stream. Detect blank frames and isolated frame-difference spikes.

- [ ] **Step 4: Run verification**

Run the verifier; expected: all media assertions pass and no unresolved blank-frame or single-frame-pop warning remains.

### Task 5: Visual review and delivery

**Files:**
- Create: `/Users/theoneglobal/Documents/Codex/2026-09-30/referenced-chatgpt-conversation-this-is-an-2/outputs/jobwhisper-desktop-copilot-voiceover.txt`
- Create: `/Users/theoneglobal/Documents/Codex/2026-09-30/referenced-chatgpt-conversation-this-is-an-2/outputs/jobwhisper-desktop-copilot-asset-notes.md`
- Create: `/Users/theoneglobal/Documents/Codex/2026-09-30/referenced-chatgpt-conversation-this-is-an-2/outputs/jobwhisper-desktop-copilot-source.zip`

**Interfaces:**
- Consumes: verified master, editable source, voiceover script, and asset manifests.
- Produces: complete user-facing delivery package.

- [ ] **Step 1: Watch the full master at normal speed**

Confirm story comprehension, caption readability, voice clarity, and natural pacing.

- [ ] **Step 2: Inspect fast transitions frame by frame**

Review installer morphs, app-screen transitions, the Stealth Mode toggle, and the final split-screen proof for layer errors or visual pops.

- [ ] **Step 3: Correct and rerender any localized failures**

Change only the responsible timeline or audio cue, rerender its proof, then regenerate and verify the master.

- [ ] **Step 4: Package and deliver**

Copy the final MP4 and text deliverables to `outputs/`, archive editable source, and confirm every link opens.
