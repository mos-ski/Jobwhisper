# Lightforth Admin and Operations Product PRD

**Version:** 2026-07-11  
**Status:** Current reference draft  
**Audience:** Product, design, engineering, QA, operations, support, marketing, sales, leadership  
**Scope:** Internal Lightforth operations, platform administration, business monitoring, user support, product configuration, and career specialist workflows.

## 1. Executive Summary

The Lightforth Admin and Operations product gives internal teams the visibility and controls needed to run the business. It supports revenue monitoring, user management, product analytics, pricing configuration, promotions, support, system notifications, broadcasts, audit logs, and career specialist operations.

This PRD is written for cross-functional stakeholders. It describes what each operational module must accomplish, who uses it, and how success is measured. It avoids implementation-specific language so product, design, engineering, marketing, sales, support, and leadership can use it as a shared reference.

## 2. Product Vision

The admin product should become the internal operating system for Lightforth. Every internal team should be able to answer its most important questions without asking engineering for raw data:

- Are users signing up, paying, and staying active?
- Which products are driving usage and revenue?
- Where are users getting stuck?
- Which support issues need attention?
- Which plans, promotions, and funnels are performing?
- Are students and job seekers receiving effective operational support?
- Are internal actions traceable and safe?

## 3. Internal Personas

| Persona | Description | Primary Need |
|---|---|---|
| Founder / Operator | Owns business performance and product direction | Monitor revenue, users, growth, and operational issues |
| Product Manager | Owns feature quality, adoption, and roadmap decisions | Track module usage and product health |
| Designer | Designs internal workflows and user-facing improvements | Understand operational workflows and pain points |
| Engineer | Builds and maintains the product | Understand expected behavior and acceptance criteria |
| Customer Support | Handles user issues and escalations | Inspect users, activity, billing, and support requests |
| Growth Manager | Runs campaigns, promotions, pricing tests, and funnels | Configure offers and understand conversion |
| Marketing | Communicates product value and campaign performance | Understand funnel and product engagement data |
| Sales | Supports higher-value accounts and partnerships | Understand users, enterprises, and plan value |
| Finance / RevOps | Monitors revenue, plans, credits, and transactions | Reconcile revenue and usage |
| Student Success Manager | Manages job seeker or student outcomes | Track students, applications, agents, and specialist activity |
| Career Specialist Manager | Oversees specialists and delivery quality | Monitor specialist workload and student progress |

## 4. Product Goals

- Give internal teams a complete operational view of Lightforth.
- Help teams identify revenue, user, product, and support issues quickly.
- Enable safe configuration of plans, credits, promotions, notifications, and product settings.
- Help career specialists manage students, applications, and AI agent activity.
- Reduce dependency on engineering for routine business questions.
- Preserve a clear boundary between internal operations and customer-facing workflows.

## 5. Admin Product Areas

The internal product includes the following areas:

- **Overview:** Business health and operational summary.
- **Revenue:** Subscription, plan, credit, and transaction performance.
- **Users:** User search, filters, profiles, subscriptions, billing, and account detail.
- **Partners and Affiliates:** Referral partners, affiliate performance, and program configuration.
- **Enterprises:** Company accounts, enterprise relationships, and B2B account status.
- **Analytics:** Cross-product usage, retention, adoption, and performance.
- **Funnels:** Marketing and product conversion tracking.
- **Product Operations:** Auto-Apply, Interview Copilot, Interview Prep, Meeting, and Resume Builder module monitoring.
- **Promotions:** Discounts, offers, campaigns, and redemption performance.
- **Broadcast:** Segmented or platform-wide user communication.
- **Activity Logs:** Audit trail for important user, admin, and system actions.
- **Support:** User tickets, escalations, status, and operational resolution.
- **Notifications:** Notification templates, categories, delivery behavior, and alert controls.
- **Pricing Configuration:** Plans, add-ons, credit costs, billing settings, and feature access.
- **Admin Settings:** Internal platform defaults and operational configuration.
- **Career Specialist Console:** Specialist, student, application, job, and agent-monitoring workflows.

## 6. Global Admin Requirements

### 6.1 Navigation and Structure

**Overview:** Internal tools must be grouped logically so teams can find the right operational area quickly.

**User Story:** As an internal operator, I want admin tools grouped by business function so that I can move through the console efficiently.

**Acceptance Criteria:**

- Given an internal user opens the admin console, then major areas are grouped into business-friendly sections such as Core, Revenue, Users, Products, Growth, and System.
- Given the user is inside a module, then the current module is visually clear.
- Given content is long, then users can continue navigating without losing orientation.
- Given a stakeholder reviews the console structure, then module names should be understandable without technical explanation.

### 6.2 Permissioning and Safety

**Overview:** Admin surfaces expose sensitive business, customer, billing, and operational data.

**User Story:** As a business owner, I want internal access controlled so that sensitive data and actions are limited to trusted roles.

**Acceptance Criteria:**

- Given a person is not authorized for internal tools, then they cannot access admin or operations areas.
- Given an internal user changes pricing, promotions, user access, notifications, support status, or settings, then the action is recorded for audit.
- Given a dangerous action is available, then the product requires confirmation before completion.
- Given sensitive customer or billing data is shown, then it is presented only where operationally necessary.

### 6.3 Operational Clarity

**Overview:** Internal tools must distinguish clearly between loading, no data, restricted access, and real errors.

**User Story:** As an internal team member, I want clear operational states so that I know whether I should wait, act, or escalate.

**Acceptance Criteria:**

- Given data is loading, then the user sees a clear loading state.
- Given no records match a filter, then the product shows an empty state rather than a broken table.
- Given the user lacks permission, then the product explains that access is restricted.
- Given a system error occurs, then the product shows an understandable error state and next step.

## 7. Overview PRD

**Overview:** The Overview module summarizes business and product health in one place.

**User Story:** As an operator, I want a business health snapshot so that I can identify issues without opening every module.

**Acceptance Criteria:**

- Given an internal user opens Overview, then top-level KPIs are visible.
- Given KPIs are present, then they cover user, revenue, usage, and operational health.
- Given a metric needs investigation, then the user can identify which deeper module to inspect.
- Given data is unavailable, then the Overview explains what is missing.

## 8. Revenue PRD

**Overview:** Revenue tracks subscription health, plan performance, credit usage, payment activity, and monetization trends.

**User Story:** As a finance or growth operator, I want revenue visibility so that I can understand business performance and plan health.

**Acceptance Criteria:**

- Given a revenue stakeholder opens the module, then core revenue KPIs are visible.
- Given a time period is selected, then all revenue summaries reflect that period.
- Given plan performance is shown, then revenue is segmented by plan where available.
- Given transaction or credit data is shown, then it supports reconciliation.
- Given data is exported, then the export matches the selected filters.

## 9. Users PRD

### 9.1 All Users

**Overview:** All Users provides searchable, filterable access to customer records.

**User Story:** As support, I want to find and inspect users quickly so that I can resolve issues.

**Acceptance Criteria:**

- Given an internal user opens All Users, then user counts, filters, search, and user records are visible.
- Given the user filters by plan or status, then only matching users appear.
- Given the user searches by customer details, then matching records are returned.
- Given the user exports user data, then the export reflects the current visible scope.
- Given the user selects a customer, then a detailed customer record opens.

### 9.2 User Detail

**Overview:** User Detail provides profile, subscription, billing, usage, and account-support context for one customer.

**User Story:** As support, I want a complete user record so that I can understand the customer's plan, usage, billing state, and issue history.

**Acceptance Criteria:**

- Given an internal user opens a customer record, then customer identity, status, and plan summary are visible.
- Given the user switches sections, then profile, subscription, billing, and account details are easy to inspect.
- Given subscription controls are available, then plan assignment and change options are clear.
- Given billing history exists, then payment history and payment methods are separated clearly.
- Given a user record cannot be found, then the product shows a clear not-found state.

### 9.3 Partners and Affiliates

**Overview:** Partners and Affiliates tracks referral partners, affiliate performance, and program settings.

**User Story:** As a growth manager, I want to manage partner relationships so that referral channels can be measured and improved.

**Acceptance Criteria:**

- Given a growth stakeholder opens Partners and Affiliates, then partner overview and partner records are visible.
- Given partner performance is shown, then conversions, commissions, status, and trend indicators are understandable.
- Given program settings are available, then referral rules and payout assumptions are clear.
- Given partner data is missing, then the product shows a useful empty state.

### 9.4 Enterprises

**Overview:** Enterprises tracks company accounts, enterprise relationships, and B2B account health.

**User Story:** As sales or operations, I want to inspect enterprise accounts so that I can support larger customers and understand account status.

**Acceptance Criteria:**

- Given an internal user opens Enterprises, then company account records are visible.
- Given an enterprise has plan, usage, seat, or contract data, then it is summarized clearly.
- Given an enterprise needs follow-up, then the status or next action is visible.
- Given sales needs account context, then the module supports high-level account review without requiring engineering support.

## 10. Analytics PRD

**Overview:** Analytics provides cross-product insight into adoption, retention, engagement, and conversion.

**User Story:** As a product manager, I want analytics by product and time period so that I can prioritize improvements.

**Acceptance Criteria:**

- Given Analytics opens, then product and business metrics are visible.
- Given a time period changes, then charts and KPIs update consistently.
- Given a metric belongs to a product area, then the product area is clearly labeled.
- Given data is unavailable, then the product explains what is missing.
- Given a stakeholder reviews analytics, then the metrics should support product, growth, or support decisions.

## 11. Funnels PRD

**Overview:** Funnels tracks visitor, signup, onboarding, checkout, and product activation conversion.

**User Story:** As a growth manager, I want funnel visibility so that I can identify where users drop off and improve conversion.

**Acceptance Criteria:**

- Given a stakeholder opens Funnels, then major acquisition and product funnel stages are visible.
- Given a funnel stage has conversion data, then counts and percentages are shown.
- Given filters are applied, then the funnel reflects the selected audience or period.
- Given conversion is weak, then the drop-off point is easy to identify.
- Given marketing or sales references funnel data, then the naming should be business-readable.

## 12. Product Operations PRD

### 12.1 Auto-Apply Operations

**Overview:** Auto-Apply Operations monitors application automation health, submissions, blockers, and product adoption.

**User Story:** As a product operator, I want to inspect Auto-Apply health so that I can ensure applications are being submitted correctly.

**Acceptance Criteria:**

- Given the module opens, then Auto-Apply usage, status, and operational health are visible.
- Given submissions fail, then failures are distinguishable from successful applications.
- Given blockers exist, then the reason and affected users or applications are identifiable.
- Given configuration settings are shown, then stakeholders can understand what controls automation behavior.

### 12.2 Interview Copilot Operations

**Overview:** Interview Copilot Operations monitors live-assistance usage, session quality, and product reliability.

**User Story:** As a product manager, I want to monitor copilot usage so that I can improve reliability and coaching quality.

**Acceptance Criteria:**

- Given the module opens, then copilot KPIs and session activity are visible.
- Given quality metrics exist, then latency, completion, transcript, or insight indicators are represented.
- Given issues are present, then affected sessions or users can be identified.
- Given stakeholders review the module, then they can understand whether live assistance is delivering value.

### 12.3 Interview Prep Operations

**Overview:** Interview Prep Operations monitors practice usage, content engagement, and preparation outcomes.

**User Story:** As a product manager, I want to see interview prep engagement so that I can improve practice content.

**Acceptance Criteria:**

- Given the module opens, then practice activity and usage are visible.
- Given content categories exist, then engagement can be segmented by category.
- Given usage is low, then the affected workflow is identifiable.
- Given users complete practice sessions, then completion and feedback indicators are visible where available.

### 12.4 Meeting Operations

**Overview:** Meeting Operations monitors meeting-support adoption and plan access.

**User Story:** As an operator, I want to monitor meeting support usage so that I know whether the module is valuable.

**Acceptance Criteria:**

- Given the module opens, then meeting-support status or usage is visible.
- Given meeting support is tied to plan access, then entitlement relationships are understandable.
- Given usage is low or error-prone, then stakeholders can identify the issue area.

### 12.5 Resume Builder Operations

**Overview:** Resume Builder Operations monitors resume creation, templates, ATS outcomes, exports, and product settings.

**User Story:** As a product manager, I want to monitor resume-builder activity so that I can improve template quality and conversion.

**Acceptance Criteria:**

- Given the module opens, then resume-builder metrics are visible.
- Given template or ATS quality data exists, then it is visible in relevant sections.
- Given scoring or export metrics exist, then trends are shown.
- Given feature settings are present, then enabled and disabled capabilities are clear.

## 13. Promotions PRD

**Overview:** Promotions manages discounts, offers, campaigns, eligibility, timing, and performance.

**User Story:** As a growth manager, I want to create and monitor promotions so that I can improve conversion without asking engineering to hardcode offers.

**Acceptance Criteria:**

- Given Promotions opens, then active and historical promotions are visible.
- Given a promotion is created or edited, then name, discount, timing, eligibility, and status are required where relevant.
- Given a promotion expires, then it is no longer treated as active.
- Given performance is shown, then redemptions and revenue impact are visible where available.
- Given a promotion could materially affect revenue, then confirmation is required before activation.

## 14. Broadcast PRD

**Overview:** Broadcast sends platform-wide or segmented messages to users.

**User Story:** As an operator, I want to notify users about important updates so that communication is centralized and traceable.

**Acceptance Criteria:**

- Given Broadcast opens, then message creation and message history are visible.
- Given a message is drafted, then audience, channel, title, and body are clear.
- Given a message is sent, then there is a confirmation step before delivery.
- Given message history exists, then delivery status, audience, and timing are visible.

## 15. Activity Logs PRD

**Overview:** Activity Logs provide audit visibility into important user, admin, and system actions.

**User Story:** As an operator, I want audit logs so that I can investigate issues and verify important changes.

**Acceptance Criteria:**

- Given Activity Logs opens, then chronological events are visible.
- Given filters are available, then logs can be filtered by actor, event type, or time period.
- Given a sensitive change occurs, then it appears as an audit event.
- Given no events match a filter, then an intentional empty state appears.
- Given support investigates an issue, then logs provide enough context to reconstruct what happened.

## 16. Support PRD

**Overview:** Support centralizes tickets, user issues, operational escalations, status, and resolution workflows.

**User Story:** As a support agent, I want to triage support requests so that users get timely help.

**Acceptance Criteria:**

- Given Support opens, then tickets or issue summaries are visible.
- Given tickets have status, priority, owner, and category, then those fields are visible and filterable.
- Given an agent selects a ticket, then details and next actions are clear.
- Given a ticket is resolved, then the status updates in the list.
- Given a ticket is urgent, then it is visually distinguishable.

## 17. Notifications PRD

**Overview:** Notifications manages templates, categories, delivery behavior, and system alert controls.

**User Story:** As an operator, I want to configure notifications so that users receive timely and useful messages.

**Acceptance Criteria:**

- Given Notifications opens, then notification settings or templates are visible.
- Given notification categories exist, then they are clearly labeled.
- Given a setting is changed, then the new state is confirmed.
- Given templates are editable, then required content fields are validated.
- Given notification changes affect many users, then confirmation or review is required.

## 18. Pricing Configuration PRD

**Overview:** Pricing Configuration manages plan features, add-ons, credit costs, billing settings, and entitlement rules.

**User Story:** As a business operator, I want pricing controlled through internal tools so that plan changes can be managed safely.

**Acceptance Criteria:**

- Given Pricing Configuration opens, then plans, add-ons, and settings are available as distinct areas.
- Given plans are reviewed, then plan names, prices, credit allocations, and feature access are visible.
- Given feature access is shown, then capabilities such as ATS Check, Resume Builder, Auto-Apply, Copilot, Interview Prep, Meeting, Export Downloads, Priority Support, API Access, Custom Domain, and Team Management are represented where applicable.
- Given add-ons are shown, then price and status are visible.
- Given billing settings are shown, then annual discount, activation offer terms, credit rollover, proration, grace period, refund window, currency, and tax treatment are clear.
- Given a plan is edited, then required fields are validated before save.
- Given a pricing change could affect active customers, then the product requires confirmation and audit logging.

## 19. Admin Settings PRD

**Overview:** Admin Settings stores operational configuration and internal preferences.

**User Story:** As an admin, I want central settings so that operational defaults are controlled in one place.

**Acceptance Criteria:**

- Given Settings opens, then platform settings are visible.
- Given settings are grouped, then each group has a clear purpose.
- Given a setting changes, then the user receives confirmation.
- Given a setting is dangerous, then confirmation is required before save.
- Given settings affect multiple teams, then labels must be clear enough for non-engineering stakeholders.

## 20. Career Specialist Console PRD

### 20.1 Career Specialist Overview

**Overview:** The Career Specialist Overview summarizes student outcomes, application progress, specialist workload, and operational priorities.

**User Story:** As a Student Success Manager, I want an operational dashboard so that I can prioritize students and applications.

**Acceptance Criteria:**

- Given a Student Success Manager opens the console, then overview metrics and operational summaries are visible.
- Given students or applications need attention, then they are highlighted.
- Given the manager selects an item, then they can move into the relevant student, specialist, job, or application detail.

### 20.2 Specialists

**Overview:** Specialists pages manage the internal team supporting students.

**User Story:** As a manager, I want to inspect specialists so that I can understand performance and workload.

**Acceptance Criteria:**

- Given the Specialists area opens, then all specialists are listed.
- Given a specialist is selected, then their profile and performance details are visible.
- Given specialist records include assigned students or outcomes, then they are shown.
- Given a specialist has high workload or low outcomes, then that status is easy to identify.

### 20.3 Students

**Overview:** Students pages manage student profiles, job preferences, applications, and agent activity.

**User Story:** As a Student Success Manager, I want to create and inspect students so that each student can receive personalized job-search support.

**Acceptance Criteria:**

- Given the Students area opens, then all students are listed.
- Given a new student must be added, then there is a clear creation workflow.
- Given a student profile opens, then overview, agent activity, and applications are accessible.
- Given profile or job preferences are edited, then changes are reflected in the student record.
- Given a student needs attention, then status or next action is visible.

### 20.4 Agents Monitoring

**Overview:** Agents Monitoring shows the AI job-application pipeline for each student: Scout, Filter, Tailor, and Driver.

**User Story:** As a Student Success Manager, I want to observe the AI agents so that I can explain what Lightforth is doing for a student.

**Acceptance Criteria:**

- Given a student profile is open, then agent activity is available.
- Given agent monitoring is active, then counters for Found, Matched, Tailored, and Applied are visible.
- Given agents are running, then each agent shows status and current task.
- Given activity events exist, then the feed shows agent name, timestamp, action summary, reasoning, and related documents or job links.
- Given the manager filters by agent, then only matching events appear.
- Given all agents are shown together, then downstream activity is visually connected to the original job discovery where applicable.

### 20.5 Applications

**Overview:** Applications pages show student applications and detailed application records.

**User Story:** As a Student Success Manager, I want to inspect applications so that I can track outcomes and intervene when needed.

**Acceptance Criteria:**

- Given Applications opens, then application records are listed.
- Given an application is selected, then detailed status and metadata are visible.
- Given an application has a failure or blocker, then the reason is visible.
- Given generated documents exist, then references are available.
- Given an application needs intervention, then the next action is clear.

### 20.6 Jobs

**Overview:** Jobs shows opportunities relevant to students and the application pipeline.

**User Story:** As a Student Success Manager, I want to inspect available jobs so that I can understand what opportunities the system is using.

**Acceptance Criteria:**

- Given Jobs opens, then job records are visible.
- Given filters or search are available, then the list updates to matching jobs.
- Given a job is associated with students or applications, then that relationship is visible.
- Given a job is no longer relevant, then status should make that clear where available.

### 20.7 Career Specialist Settings

**Overview:** Career Specialist Settings manages operational preferences for the specialist workspace.

**User Story:** As a Student Success Manager, I want settings for my workspace so that it matches operational needs.

**Acceptance Criteria:**

- Given Settings opens, then specialist-workspace settings are visible.
- Given a setting changes, then the user receives confirmation.
- Given a setting is not available, then disabled controls are clearly represented.

## 21. Non-Functional Requirements

- **Permissioning:** Internal admin and career specialist tools must be protected.
- **Auditability:** Changes to users, pricing, promotions, notifications, support status, settings, and sensitive operations must create audit events.
- **Data Integrity:** Admin summaries and tables must avoid contradictory totals.
- **Performance:** Tables, charts, and filters should remain responsive with large data sets.
- **Export Accuracy:** Exports must match active filters and visible scope.
- **Accessibility:** Internal controls, filters, tabs, tables, and modals must be keyboard accessible.
- **Operational Clarity:** Empty states must distinguish between no data, restricted access, loading, and error.
- **Plain Language:** Module names, metrics, and controls should be understandable to non-engineering stakeholders.

## 22. Success Metrics

- Weekly active usage by internal role.
- Median time to find a customer record.
- Support ticket resolution time.
- Revenue reconciliation discrepancy rate.
- Pricing or promotion configuration error rate.
- Funnel conversion improvement after campaign changes.
- Product issue detection time.
- Career specialist student follow-up completion rate.
- Application blocker resolution rate.
- Agent monitoring usage by Student Success Managers.
- Reduction in engineering requests for routine operational data.

## 23. Out of Scope

- Customer-facing product requirements, covered in the user product PRD.
- Detailed backend architecture.
- Vendor selection for analytics, billing, messaging, or AI systems.
- Full role-based permission matrix beyond the requirement that internal tools are protected.
- Low-level implementation details for real-time agent monitoring.
- Any separated product lines that are not part of the core Lightforth career platform.
