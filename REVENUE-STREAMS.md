# Revenue Streams — How Jobwhisper Makes Money

**Revised 2026-09-23** — the subscription is one set of three unlimited plans now, and Starter bills weekly. See `PRICING.md` for the authoritative model.

## The streams

| Stream | How it works | Price |
|---|---|---|
| **Subscription** | Starter / Pro / Premium. Interviews unlimited on all three; Auto Apply is capped at 500 jobs/month on Pro and uncapped on Premium. No annual billing | **$47/week** · **$99/month** · **$497/month** |
| **Pay as you go** | Prepaid credits, for people **without** a plan only — all three are unlimited on a plan | $10 min → $0.10/interview minute · $5 min → $0.10/resume prompt · $10 min → $1/successful application |
| **Done For You** | One-time package, not a subscription — a success manager applies for the client until the guarantee is met | $497 (10 interviews guaranteed) / $997 (20 interviews guaranteed) |

> **The model below is stale and has not been recomputed.** Every subscription figure in it assumes the old monthly tiers ($47/$99/$197) and a monthly credit allowance that no longer exists. Two inputs have to be decided before it can be rebuilt honestly rather than guessed at: **how many weeks an average Starter subscriber stays** — a weekly plan's revenue per subscriber is retention, not price — and **how many of Pro's 500 monthly applications actually get used**, since that allowance is worth ~$500 at the pay-as-you-go rate against a $99 price, and Premium's uncapped version has no ceiling at all. The mid-session top-up line is already dead: subscribers have nothing to top up.

## Path to $20,000/month — self-sustaining

| Plan | Volume | Revenue |
|---|---|---|
| Done For You | 5 large + 3 small packages | $6,476 |
| Ace Your Interview | 90 Starter + 45 Pro + 15 Premium (60/30/10 mix) | $11,640 |
| Find Your Job | Auto Apply (3,000 credits, $3,000) + Resume Builder (800 credits, $80) | $3,080 |
| Mid-session top-ups | 15 subscribers, $10 average | $150 |
| **Total** | | **~$21,346** |

**Ace Your Interview is the largest line, not Done For You** — the subscription base is what actually clears the self-sustaining line here, comfortably past $20,000 even weighted toward the lower-priced Starter tier.

## Done For You — package mix

| Package | Price | Sales | Revenue |
|---|---|---|---|
| Large (20 interviews guaranteed) | $997 | 5 | $4,985 |
| Small (10 interviews guaranteed) | $497 | 3 | $1,491 |
| **Total** | | **8** | **$6,476** |

The floor to plan around: at least 5 large-package sales a month.

## Ace Your Interview — tier mix

| Tier | Price | Mix | Subscribers | Revenue |
|---|---|---|---|---|
| Starter | $47/mo | 60% | 90 | $4,230 |
| Pro | $99/mo | 30% | 45 | $4,455 |
| Premium | $197/mo | 10% | 15 | $2,955 |
| **Total** | | | **150** | **$11,640** |

Starter carries the volume, but Pro and Premium together still drive over 60% of subscription revenue from 40% of subscribers — the upgrade path from Starter is worth prioritizing.

## Find Your Job & credit top-ups

| Source | Volume | Revenue |
|---|---|---|
| Auto Apply credit purchases | 150 purchases, $20 average — 3,000 credits at $1 each, well over a 200 successful-applications floor | $3,000 |
| Resume Builder credit purchases | 10 purchases, $8 average — 800 credits (prompts) at $0.10 each | $80 |
| Mid-session top-ups — Interview Prep/Copilot, $10 minimum (≈60 extra min) | 15 subscribers | $150 |
| **Total** | | **$3,230** |

Auto Apply carries this table — people take job-hunting seriously enough to want to run it themselves rather than pay someone else, and it's likely to outgrow the estimate here faster than any other line. Resume Builder stays a small add-on, not a product to lean on. Top-ups are the cheapest revenue to capture regardless — subscribers who run out of credits mid-session and pay on the spot to finish, no acquisition cost since they're already paying customers.

## What's underneath the pricing

Every metered feature in Ace Your Interview and Find Your Job runs on one flat rate: **1 credit per minute or prompt, $0.10 per credit.** Find Your Job's Auto Apply and Done For You bill per successful application instead of per attempt — $1 self-serve, $10 done-for-you.

## Upsell layer

| Upsell | Where it happens | Offer |
|---|---|---|
| Materials + small Done For You | At checkout, on the VSL landing page | Marketplace items ($9–$29) and the $497 package, as selectable cart add-ons |
| Large Done For You | After checkout, nurture campaign | The $997 package, offered to everyone who came through the VSL funnel — not only $497 buyers |

## Acquisition & CAC

**Funnel:** a free tier (50 min/mo) brings people in, hits its usage ceiling, and converts to a paid plan — or a subscriber arrives directly via a $40-first-month offer that renews at $99/mo Pro. Every subscriber can refer others for 1,000 free credits, feeding new signups back into the same funnel at close to zero acquisition cost.

**Target CAC:** payback inside the first month means CAC under $99 (Pro's price) per paid conversion; a 3-month payback allows up to roughly $250–300, factoring in the $40 first-month discount. Only Done For You's own CAC can approach its $497–$997 price — that ceiling doesn't apply to the base subscription.

**Ad budget:** size monthly spend as a multiple of realized CAC × target new-subscriber volume, not a fixed number — scale up only while paid channels stay under the payback ceiling above, and lean on referral (near-zero CAC) to fill the rest. No live ad-spend or conversion data exists yet to set a real number; this is the framework to apply once that data starts coming in.
