# Jobwhisper Desktop Copilot TikTok Tutorial

## Goal

Produce a 45-second vertical tutorial showing how to download, install, configure, and use Jobwhisper Desktop Copilot on Windows and macOS. The video should feel fast and polished while remaining practical enough for a first-time user to follow.

The primary product promise is that Jobwhisper can provide live interview guidance in a desktop overlay, with privacy-focused display controls for supported screen-sharing environments. The video must show Stealth Mode as an app feature and demonstrate a screen-share test. It must not promise universal invisibility or encourage use where AI assistance is prohibited.

## Format

- Canvas: 1080 × 1920, vertical 9:16
- Duration: 45 seconds
- Frame rate: 60 fps
- Delivery: MP4 with H.264 video and AAC audio
- Style: real product captures enhanced with deterministic 2D motion graphics
- Audio: spoken voiceover, burned-in captions, licensed music, and restrained interface SFX

## Creative approach

Use a fast guided walkthrough with genuine Jobwhisper screens. Camera moves should isolate the active control so desktop UI remains legible in a vertical frame. Cursor movement, click rings, callouts, and captions guide attention. A short split-screen proof at the end compares the candidate's view with the shared view.

The visual system follows the product: Jobwhisper blue, white surfaces, dark desktop-session UI, Rethink Sans-style typography, rounded panels, and compact controls. Avoid generic glass effects, decorative gradients, 3D scenes, excessive bounce, or unrelated stock footage.

## Storyboard and voiceover

### 0:00–0:03 — Hook

Visual: A live interview call fills the frame. The Jobwhisper overlay appears on the candidate side, while a smaller shared-view card shows a clean call screen.

Voiceover: “Here’s how to set up Jobwhisper Copilot before your next interview.”

Caption: `Set up Jobwhisper Copilot in 45 seconds`

### 0:03–0:10 — Choose the installer

Visual: Jobwhisper Downloads page. Windows, Mac Apple Silicon, and Mac Intel cards enter as the camera tracks between them. Show “About This Mac” briefly to explain the Mac choice.

Voiceover: “Open Download Apps. Choose Windows, or select Apple Silicon or Intel for your Mac.”

Caption: `Pick the correct desktop version`

### 0:10–0:16 — Install and approve setup

Visual: Windows installer progress transforms into the macOS drag-to-Applications interaction. Required permissions appear as a short checklist rather than displaying passwords, biometrics, or private system information.

Voiceover: “Install the app, sign in, and approve the permissions it needs for audio and display controls.”

Caption: `Install • Sign in • Enable permissions`

### 0:16–0:26 — Add interview context

Visual: Jobwhisper Desktop Home changes into the configuration view. Populate a fictional Product Manager role, fictional company, sample job description, and a clearly fictional résumé filename.

Voiceover: “Add the role, job description, and résumé you used, so every suggestion matches the interview.”

Caption: `Give Copilot the right context`

### 0:26–0:33 — Configure answers

Visual: The response preference and answer-length controls take focus. Select a concise setting appropriate for the mock session.

Voiceover: “Choose how you want answers structured, then pick a comfortable response length.”

Caption: `Choose your response style`

### 0:33–0:40 — Start and enable Stealth Mode

Visual: Start the mock session. Audio changes to connected, a sample interviewer question appears, and Copilot generates a short structured suggestion. The Stealth Mode control is selected and visibly changes to its enabled state.

Voiceover: “Start Copilot, confirm it can hear the call, and turn on Stealth Mode in supported environments.”

Caption: `Listen → Suggest → Answer naturally`

### 0:40–0:45 — Verify before the interview

Visual: Split screen labeled “Your screen” and “Shared view.” Jobwhisper remains on the candidate side and is absent from the simulated shared view. End on the Jobwhisper wordmark and a download call to action.

Voiceover: “Run a quick screen-share test before the call, and use AI assistance only where it’s permitted.”

Captions: `Test before your call` then `Download Jobwhisper Copilot`

## Source material

- Current Jobwhisper logo and wordmark from `dist/Jobwhisper/`
- Product tokens and typography from `src/tokens/theme.css`
- Downloads data from `src/mocks/account.ts`
- Desktop home, configuration, session, overlay, and Stealth Mode states from `src/apps/desktop/` and `src/features/desktop/`
- Real desktop app captures for macOS installation and runtime screens
- A Windows capture or faithful Windows setup reconstruction if a Windows machine is unavailable

All accounts, résumés, jobs, companies, interview questions, notifications, and filenames shown in the video must be fictional or purpose-built demo data. No real candidate data or credentials may appear.

## Motion and editing rules

- Drive the timeline through a deterministic `seek(t)` function.
- Use shared-element transformations between download cards, installer windows, and app screens.
- Keep one camera move active at a time.
- Use short, controlled easing and minimal spring overshoot.
- Keep captions inside TikTok-safe margins and large enough to read on a phone.
- Use cursor movement only to explain an action; avoid decorative wandering.
- Align clicks, panel changes, and the Stealth Mode toggle to music beats or deliberate SFX.
- Use four subframes per frame for motion blur, increasing only if proof renders show stepping.

## Capture and safety requirements

- Do not show passwords, biometrics, email addresses, tokens, private résumés, or real interview details.
- Screen-record permission dialogs only after replacing or masking identifying information.
- Do not characterize Stealth Mode as universally “undetectable.” Use “privacy-focused display controls for supported environments.”
- Demonstrate the shared-view result in a controlled mock call and label it as a test.
- Include the final “use where permitted” line in voiceover and captions.

## Review gates

1. Approve the beat map and voiceover timing.
2. Approve four key stills: hook, installer choice, configured session, and split-screen proof.
3. Review a silent motion proof at reduced resolution.
4. Review the voiceover/caption pass.
5. Review the final master at normal speed and inspect fast transitions frame by frame.

## Acceptance criteria

- Final duration is 43–47 seconds.
- Output is 1080 × 1920 at 60 fps with audible, balanced voiceover.
- Windows, Mac Apple Silicon, and Mac Intel download choices are visible.
- Installation, sign-in, permissions, context setup, response preferences, session start, and Stealth Mode are all represented.
- The split-screen test clearly communicates the supported screen-sharing behavior without overstating it.
- Captions are accurate, synchronized, and readable within platform-safe margins.
- No private information, blank frames, loading artifacts, clipped text, missing fonts, or one-frame visual pops remain.
- Final deliverables include the MP4, editable motion source, voiceover/caption script, and asset/license notes.
