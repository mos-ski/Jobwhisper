# Shared Public Navigation and Footer Design

## Goal

Use one consistent public navigation and footer treatment across the landing page and every product education page.

## Navigation

Product pages use the same dark pill navigation hierarchy as the landing page: Jobwhisper logo, Features, Pricing, FAQ, text-only Download dropdown, and an outlined Log in action. Mobile retains the logo, Download control, Log in action, and menu affordance without horizontal overflow.

## Footer

Product pages end with the same dark Jobwhisper footer used by the landing page. It includes product, download, company, and social links plus visible Privacy Policy and Terms links in the footer meta row.

## Architecture

The shared public shell components live in `src/features/marketing/` and stay router-independent by using anchors and callback props. The landing page and `MarketingProductView` compose those components rather than maintaining separate copies.

## Verification

Component tests assert the shared navigation hierarchy and the footer's Privacy Policy and Terms links. Existing landing-page coverage continues to verify its CTA and navigation behavior. The full test suite and production build must pass.
