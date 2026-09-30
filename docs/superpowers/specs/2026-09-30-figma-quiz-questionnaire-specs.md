# Figma questionnaire specs — file `AQXk4ivy9vA7scCI9DgmQ3` (Jobwhisper 1.0)

Source: 14 scraped FlexJobs-style frames, fetched one at a time. Site chrome (header logo/nav, footer legal links, "Skip to content", ad/related sidebars) is stripped; only the questionnaire body is specced. Progress is a full-width bar of 5px-tall segments; filled = blue `#007CAD`, empty = `#E8EDF2`. There is no "Step N of M" text anywhere — the step is conveyed only by the segment bar (segment layers are named "Button - Go to step N").

---

## 1. Node `1239:19591` — frame "Auto Aply"

- **Page/question heading:** "Apply to jobs in 1-click." (eyebrow) over display headline "Find your next role.\nLand the Job. Or Don't Pay!"
- **Sub/lede:** "Browse handpicked jobs from the best companies" + "Trusted by 2M+ job seekers"
- **Form controls (in order):**
  1. Button/dropzone — "Drop a resume here, or browse files" (helper "PDF · up to 2 MB")
  2. Button (primary, blue pill) — "Import resume"
  3. Link (grey bar) — "Start Your Remote Job Search Now!"
- **Options:** none (not a choice question)
- **Primary CTA:** "Import resume"; **secondary:** "Start Your Remote Job Search Now!" (repeated as blue CTA at the bottom of the white section)
- **Progress:** none on this frame
- **Layout:** 1736px marketing/landing frame, pale-blue hero band + white body; not part of the step flow.

---

## 2. Node `1238:19402` — frame "What kind of remote work are you looking for? | FlexJobs"

- **Heading (H1):** "What kind of remote work are you looking for?"
- **Sub/lede:** none; helper banner below options: "✅ Work-life balance! We get it!"
- **Form controls:** 3 radio-style cards (row, centered) → then footer button "Next"
- **Option list (in order):**
  1. "100% Remote" — "No daily commute to the office. Work from home or the location of your choice." (selected: black 1.5px border)
  2. "Hybrid" — "A blend of working in the office near you and working from home."
  3. "I'm open to both" — "I'm open to all work setups, 100% remote or hybrid."
- **Primary CTA:** "Next" (orange). No Back button.
- **Progress:** 12-segment bar, 0 segments filled (first screen).
- **Layout:** single centered column, 1280px section inside 1736px page, white bg, cards 325px wide with shadow.

---

## 3. Node `1238:19257` — frame "Document"

- **Heading (H1):** "I'm looking for..."
- **Sub/lede:** none
- **Form controls:** 4 image+text option cards (row) → text link "Other" with chevron → footer buttons "Back", "Next"
- **Option list (in order):**
  1. "Any job" — "I'm open to a wide range of jobs with minimal requirements"
  2. "Career progression" — "I want a role aligned with my background"
  3. "A side hustle" — "I want an additional source of income"
  4. "An entry-level role" — "I'm new to this career path (new grad, career switcher...)"
  5. "Other" (link, blue, with down chevron — expands a further choice)
- **Primary CTA:** "Next" (orange); **secondary:** "Back" (blue text)
- **Progress:** 16-segment bar, 2 filled (step 2)
- **Layout:** single centered column, 1250px option row, white bg, 270px-wide cards with soft shadow.

---

## 4. Node `1238:19142` — frame "What is your minimum desired salary | FlexJobs"

- **Heading (H1):** "What is your minimum desired salary?"
- **Sub/lede:** none
- **Form controls (in order):**
  1. Range slider (single handle, blue filled track to ~32%) with value bubble "$65,000 per year"
  2. Field label — "Minimum desired salary"
  3. Segmented toggle (2 options) — "Annually" (selected) / "Hourly"
  4. Link — "Skip, I'm not sure yet"
  5. Footer buttons — "Back", "Next"
- **Options:** toggle options: `Annually`, `Hourly`
- **Primary CTA:** "Next" (orange); **secondary:** "Back" (blue), skip link "Skip, I'm not sure yet"
- **Progress:** 16-segment bar, 4 filled (step 4)
- **Layout:** narrow 710px centered column inside 1280px section, white bg.

---

## 5. Node `1238:19021` — frame "Where will you work remotely? | FlexJobs"

- **Heading (H1):** "Where do you want to work remotely from?" (frame title says "Where will you work remotely?")
- **Sub/lede:** none
- **Form controls (in order):**
  1. Text input with leading location icon — value "Nigeria" (720px wide; placeholder state not shown)
  2. Checkbox (checked) — "Include jobs where I can work from anywhere in the US"
  3. Checkbox (checked) — "Include jobs where I can work from anywhere in the world"
  4. Footer buttons — "Back", "Next"
- **Primary CTA:** "Next" (orange); **secondary:** "Back" (blue)
- **Progress:** 16-segment bar, 5 filled (step 5)
- **Layout:** centered 720px form column, white bg, plain bordered input + checkbox rows.

---

## 6. Node `1238:18908` — frame "Document"

- **Heading (H1):** "Where are you with your resume right now?"
- **Sub/lede:** helper banner: "👍Don't worry if your resume isn't ready yet. Even an incomplete resume can improve your job matches."
- **Form controls:** 3 pill buttons (row) → footer "Back", "Next"
- **Option list (in order):**
  1. "My resume is up to date"
  2. "I have a resume, but it needs updates" (selected — filled pale-blue pill with close icon)
  3. "I don't have a resume yet"
- **Primary CTA:** "Next" (orange); **secondary:** "Back" (blue)
- **Progress:** 16-segment bar, 6 filled (step 6)
- **Layout:** single centered column, 1250px pill row, white bg.

---

## 7. Node `1238:18779` — frame "Upload Success | Flexjobs"

- **Heading (H1):** "Save time and get more relevant job matches"
- **Sub/lede:** card heading "Upload your resume"; body "Uploading helps us set up your search faster." / "You can always make changes to your resume later."
- **Form controls (in order):**
  1. Button (primary orange, inside dashed-free card) — "Upload Resume"
  2. Helper text — "Files we can use: DOC, DOCX, PDF, RTF, TXT"
  3. Button (outline orange) — "Skip Resume Upload"
  4. Footer buttons — "Back", "Next"
- **Primary CTA:** "Upload Resume"; **secondary:** "Skip Resume Upload", "Back"
- **Progress:** 16-segment bar, 7 filled (step 7)
- **Layout:** single centered column, 539px bordered upload card (#F8FAFB) with icon, white bg.

---

## 8. Node `1238:18641` — frame "Do you have a job title in mind? | FlexJobs"

- **Heading (H1):** "Tell us what job title(s) you have in mind."
- **Sub/lede:** "Select more job titles to get more results."
- **Form controls (in order):**
  1. Text input — placeholder "Add up to 5 job titles" (720px)
  2. Selected chip with remove (×) — "Product Manager"
  3. Suggestion chips: 2 selected with ×, 3 unselected with + (see list)
  4. Footer buttons — "Back", "Next"
- **Option list:**
  - Selected: `Product Manager` (in input area), `Product Marketing Manager`, `Assistant Product Manager`
  - Unselected (+): `Technical Product Manager`, `Product Development Manager`, `Product Manager Intern`
- **Primary CTA:** "Next" (orange); **secondary:** "Back" (blue)
- **Progress:** 16-segment bar, 10 filled
- **Layout:** centered 720px column, chip cloud wrapped in 2 rows, white bg.

---

## 9. Node `1238:18478` — frame "No worries! We've got you covered. Select up to 5 job categories. | FlexJobs"

- **Heading (H1):** "Select up to 5 job categories."
- **Sub/lede:** none in body (page title adds "No worries! We've got you covered.")
- **Form controls (in order):** category pill buttons (multi-select, wrapped) → "See More" link-button → footer "Back", "Next"
- **Option list (order as laid out; selected = filled pale-blue pill):**
  1. Account Management *(selected)*
  2. Accounting & Finance
  3. Administrative *(selected)*
  4. Advertising & PR
  5. Animals & Wildlife *(selected)*
  6. Art & Creative *(selected)*
  7. Bilingual *(selected)*
  8. Business Development
  9. Call Center
  10. Communications
  — plus a "See More" control revealing the rest of the category list.
- **Primary CTA:** "Next" (orange); **secondary:** "Back" (blue), "See More"
- **Progress:** 16-segment bar, 11 filled (step 11)
- **Layout:** full-width 1250px centered pill grid (3 rows), white bg.

---

## 10. Node `1238:18367` — frame "How many years of relevant experience do you have? | FlexJobs"

- **Heading (H1):** "How many years of relevant experience do you have?"
- **Sub/lede:** none
- **Form controls:** 4 pill buttons (single row) → footer "Back", "Next"
- **Option list (in order):**
  1. "Less Than 3 Years" *(selected — pale-blue fill, close icon)*
  2. "3-5 Years"
  3. "5-10 Years"
  4. "10+ Years"
- **Primary CTA:** "Next" (orange); **secondary:** "Back" (blue)
- **Progress:** 16-segment bar, 12 filled (step 12)
- **Layout:** centered 1250px pill row, white bg.

---

## 11. Node `1238:18246` — frame "What best describes your level of education?"

- **Heading (H1):** "What best describes your level of education?"
- **Sub/lede:** "Select the best option and we'll find the best jobs for your education level."
- **Form controls:** 7 pill buttons (2 rows, centered) → footer "Back", "Next"
- **Option list (in order):**
  1. High School or GED
  2. Associate's Degree or Some College *(selected — pale-blue fill, close icon)*
  3. Bachelor's Degree
  4. Master's or Higher
  5. Unspecified Education
  6. Other
  7. Prefer Not to Answer
- **Primary CTA:** "Next" (orange); **secondary:** "Back" (blue)
- **Progress:** 16-segment bar, 13 filled (step 13)
- **Layout:** centered 840px pill block (2 rows), white bg.

---

## 12. Node `1238:18041` — frame "What benefits are you looking for? | FlexJobs"

- **Heading (H1):** "What benefits are you looking for?"
- **Sub/lede:** helper banner: "💪 Great benefits for a productive work life!"
- **Form controls:** benefit pills (multi-select, wrapped 5 rows) → footer "Back" + final CTA
- **Option list (order as laid out; *selected* marked):**
  1. Health/Medical Insurance *(selected)*
  2. Dental Insurance *(selected)*
  3. Vision Insurance
  4. Disability Insurance
  5. Life Insurance
  6. Family/Dependent Insurance
  7. 401k Matching/Retirement Savings *(selected)*
  8. Tuition/Education Assistance
  9. Paid Holidays
  10. Paid Vacation
  11. Flexible/Unlimited PTO
  12. Paid Sick Leave
  13. Parental and Family Leave
  14. Paid Community Service Time
  15. Professional/Career Development
  16. Home Office Reimbursement/Stipend
  17. Health & Wellness Programs
  (17 chips total; no "See More" on this frame)
- **Primary CTA:** "Find Your Next Remote Job!" (orange, replaces "Next"); **secondary:** "Back" (blue)
- **Progress:** 16-segment bar, 14 filled (final question, step 14)
- **Layout:** 1129px centered chip cloud over 4–5 rows, white bg, blue banner beneath.

---

## 13. Node `1238:17852` — frame "What benefits are you looking for? | FlexJobs" (processing screen)

- **Heading (H1):** "Finding the best remote & flexible jobs for you..." (mixed text + highlighted words)
- **Sub/lede:** none — this is a loading/interstitial screen (126×126 spinner image labelled "Loading, please wait...")
- **Form controls:** none
- **Content stats (3-up):** "246,444" active remote & flexible jobs · "15,520" companies hiring today · "9,000,000 +" people we've helped since 2007; below: "As seen on*" press logos (Forbes/CNBC/CNN/USA Today) + trademark footnote
- **Primary CTA:** none (auto-advances)
- **Progress:** 16-segment bar, 14 filled (same as previous step)
- **Layout:** single centered column, 1736px page, white bg, big 52px stat numerals.

---

## 14. Node `1238:15103` — frame "Job Search Results that … | FlexJobs" (destination results page)

- **Heading (H1):** "Job Search Results"
- **Sub/lede:** results summary line — "1 to 50 of 51 for "Product Manager|Product Marketing Manager|Assistant Product Manager"; 100% Remote; Entry-Level; Associate's Degree or Some College; Account Management; Client Services; Bilingual; Chinese; French; German; Japanese; Portuguese; Spanish; Administrative; Appointment Setting; Collections; Virtual Admin; Art & Creative; Music; Photography; Theater; Animals & Wildlife; Dental Insurance, Health/Medical Insurance, 401k Matching/Retirement Savings; Nigeria" (breadcrumb above: Home / Remote Jobs / Job Listings for …)
- **Form controls (in order):**
  1. Text input (search) — value "Product Manager|Product Marketing Manager|Assistant Product Manager"
  2. Text input (location) — placeholder "Location", with dropdown showing "Nigeria"
  3. Button (icon, orange) — search submit (magnifier)
  4. Link — "Tips"
  5. Applied filter chips (removable ×): "100% Remote", "Entry-Level", "Associate's Degree or Some College", "Bilingual..."
  6. Filter dropdown buttons: "Job Type", "Schedule", "Travel", "Accolades", "Title"
  7. Link — "Less" (collapse filter panel)
  8. Sort toggle: "Date" | "Relevance" (Relevance active)
  9. Pagination: "Page 1 is your current page", "Page 2", "Next page"
- **Option/filter labels:** as listed above; job card meta chips read "100% Remote", "Full-Time", "Employee", salary.
- **Job cards shown (in order):** Regional Growth Marketing Manager (30+ days ago) · Enterprise Account Manager (30+ days ago) · Business Development Manager (9 days ago) · Senior Customer Success Manager ("New!", 6 days ago) · Regional Account Manager (2 weeks ago) · Senior Contracts Manager, Commercial · Community Growth Manager
- **Primary CTA:** search button (icon) on-page; sidebar "Sign Up Today!" (newsletter) is site chrome.
- **Progress indicator:** none (post-questionnaire).
- **Layout:** two-column results grid (967.5px results + 322.5px sidebar) in 1320px container, white bg, sidebar is promo/testimonial chrome (stripped from summary).
