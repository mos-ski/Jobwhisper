# Extension App — Screen Manifest

| Route | View file | Props type | States covered | Notes |
|-------|-----------|------------|----------------|-------|
| (popup) | `src/features/extension/sign-in-view.tsx` | `ExtensionSignInViewProps` | idle, signing-in | Email + password form, simulated auth delay |
| (popup) | `src/features/extension/extension-popup-view.tsx` | `ExtensionPopupViewProps` | run, jobs, applications tabs | Shell: header with credit balance, tab strip, footer with sign out |
| (popup) | `src/features/extension/run-tab-view.tsx` | `ExtensionRunTabViewProps` | start, connect, in-progress per board | Board list with state-driven controls |
| (popup) | `src/features/extension/jobs-tab-view.tsx` | `ExtensionJobsTabViewProps` | empty, populated | Matched jobs list |
| (popup) | `src/features/extension/applications-tab-view.tsx` | `ExtensionApplicationsTabViewProps` | empty, populated | Applied jobs with outcome badges |
