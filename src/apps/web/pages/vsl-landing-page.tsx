import { useState, type MouseEvent } from 'react'

import './vsl-landing-page.css'
import { VslCheckoutModal } from './vsl-checkout-modal'

function PlayIcon() {
  return (
    <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
      <path d="M1 1L19 11L1 21V1Z" fill="#1c1d20" />
    </svg>
  )
}

export function VslLandingPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [demoPanel, setDemoPanel] = useState<'without' | 'with'>('without')
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  function openCheckout(e: MouseEvent) {
    e.preventDefault()
    setIsCheckoutOpen(true)
  }

  return (
    <div className="vsl-page">
      {/* ============ SECTION 01 — HERO ============ */}
      <section className="vsl-hero">
        <div className="vsl-wrap">
          <div className="vsl-hero-load">
            <span className="vsl-eyebrow">AI Interview Copilot</span>
          </div>
          <h1 className="vsl-hero-load vsl-d2">
            You Already Got the Interview.
            <span className="vsl-sub-h1">
              Don't lose the job because the right answer came to you five minutes too late.
            </span>
          </h1>
          <p className="vsl-hero-copy vsl-hero-load vsl-d3">
            You were qualified enough to get shortlisted. Your resume worked. They wanted to speak to you. Now it
            depends on how well you communicate when the questions start coming.{' '}
            <strong>
              Jobwhisper Interview Copilot helps you understand questions, organize your experience, and structure
              stronger answers in real time.
            </strong>
          </p>

          <div className="vsl-hero-load vsl-d4">
            <p className="vsl-eyebrow" style={{ justifyContent: 'center' }}>
              Watch this before your next interview
            </p>
            <div className={`vsl-video-frame${isPlaying ? ' vsl-is-playing' : ''}`}>
              <div className="vsl-video-stage">
                <span className="vsl-video-label">Jobwhisper VSL</span>
                <button className="vsl-play-btn" aria-label="Play video" onClick={() => setIsPlaying(true)}>
                  <PlayIcon />
                </button>
                <div className="vsl-video-quote">
                  "The interviewer can only judge the answer you gave. Not the better answer you thought of later."
                </div>
              </div>
            </div>
            <a href="#" className="vsl-btn vsl-btn-primary" onClick={openCheckout}>
              Get Jobwhisper Copilot
            </a>
            <p className="vsl-cta-note">Set it up with your resume, job description and role before your next interview.</p>
          </div>
        </div>
      </section>

      {/* ============ SECTION 02 — THE PROBLEM ============ */}
      <section>
        <div className="vsl-wrap">
          <h2>Being Qualified Is Not the Same as Interviewing Well.</h2>
          <div className="vsl-stack vsl-muted-light">
            <p>You know your experience. You know what you've done. You know what you're capable of.</p>
            <p>But then somebody asks:</p>
          </div>

          <div className="vsl-caption">
            <div className="vsl-caption-tag">
              <span className="vsl-dot"></span>Live — interviewer
            </div>
            <p>"Tell me about a time you handled conflict."</p>
          </div>

          <div className="vsl-stack vsl-muted-light">
            <p>And suddenly you have thirty seconds to turn five years of experience into a clear answer. Or:</p>
          </div>

          <div className="vsl-caption">
            <div className="vsl-caption-tag">
              <span className="vsl-dot"></span>Live — interviewer
            </div>
            <p>
              "Why should we hire you?" · "Tell me about yourself." · "What is your biggest weakness?" · "Tell me
              about a difficult project you handled."
            </p>
          </div>

          <div className="vsl-stack vsl-muted-light">
            <p>
              You know the answer. The problem is getting it out clearly while someone is sitting there waiting. And
              unfortunately, the interviewer cannot judge the answer you meant to give.
            </p>
          </div>
          <p className="vsl-punch">They can only judge the answer you actually gave.</p>
        </div>
      </section>

      {/* ============ SECTION 03 — THE REAL COST ============ */}
      <section className="vsl-on-paper-soft">
        <div className="vsl-wrap">
          <h2>One Bad Interview Can Cost More Than Forty-Five Minutes.</h2>
          <p className="vsl-muted-light">Maybe the opportunity pays:</p>

          <div>
            <div className="vsl-stat-row">
              <span className="vsl-tag">/ year</span> $60,000
            </div>
            <div className="vsl-stat-row">
              <span className="vsl-tag">/ year</span> $100,000
            </div>
            <div className="vsl-stat-row">
              <span className="vsl-tag">/ year</span> $150,000
            </div>
          </div>

          <div className="vsl-stack vsl-muted-light" style={{ marginTop: 34 }}>
            <p>
              Maybe it's your first international role. Your first remote job. Your chance to relocate. Your move
              into management. Your opportunity to finally leave a company you've outgrown.
            </p>
            <p>
              You already found the vacancy, applied, got through screening, beat other applicants, and got invited
              to the interview. Then one poorly answered question can change everything.
            </p>
          </div>

          <h3 style={{ marginTop: '2em' }}>
            The most frustrating interviews are not the ones you were completely unqualified for.
          </h3>
          <p className="vsl-punch" style={{ marginTop: '0.2em' }}>
            They are the ones you knew you could have won.
          </p>
        </div>
      </section>

      {/* ============ SECTION 04 — PATTERN RECOGNITION ============ */}
      <section>
        <div className="vsl-wrap">
          <h2>Does This Keep Happening?</h2>
          <p className="vsl-muted-light">You finish an interview and immediately think:</p>
          <div className="vsl-caption">
            <div className="vsl-caption-tag" style={{ color: '#ffffff' }}>
              <span className="vsl-dot" style={{ background: '#ffffff', animation: 'none' }}></span>You, afterward
            </div>
            <p>"I should have said this instead."</p>
          </div>

          <ul className="vsl-checklist vsl-muted-light" style={{ marginTop: 28 }}>
            <li>You ramble because you cannot structure an answer quickly.</li>
            <li>You know the experience but struggle to explain it.</li>
            <li>You get nervous when they ask an unexpected question.</li>
            <li>You forget important examples from your own career.</li>
            <li>You spend hours preparing and they still ask something you never practiced.</li>
            <li>You get interviews consistently but struggle to turn them into offers.</li>
          </ul>

          <p className="vsl-muted-light">If that sounds familiar, the problem may not be getting more interviews.</p>
          <h3 style={{ marginBottom: 0 }}>The problem may be what happens inside them.</h3>
        </div>
      </section>

      {/* ============ SECTION 05 — DISCREDIT OLD SOLUTION ============ */}
      <section className="vsl-on-paper-soft">
        <div className="vsl-wrap">
          <h2>You Cannot Prepare for Every Question They Might Ask.</h2>
          <ul className="vsl-checklist vsl-muted-light">
            <li>Research the company.</li>
            <li>Read the job description.</li>
            <li>Practice STAR answers.</li>
            <li>Watch interview videos.</li>
            <li>Write down common questions.</li>
            <li>Ask ChatGPT to generate practice questions.</li>
            <li>Do mock interviews.</li>
          </ul>
          <p className="vsl-muted-light">All of that helps. But there is one limitation:</p>
          <h3>Preparation happens before the interview. The unexpected question happens during it.</h3>
          <p className="vsl-muted-light">
            You cannot memorize an answer for every possible question. And even when you've prepared the answer
            before, pressure can make it difficult to remember when you actually need it. So we approached
            interviews differently.
          </p>
          <p className="vsl-divider-quote" style={{ textAlign: 'left', margin: '1.4em 0 0' }}>
            What if intelligent assistance could prepare with you — and support you while the conversation is
            happening?
          </p>
        </div>
      </section>

      {/* ============ SECTION 06 — INTRODUCING JOBWHISPER ============ */}
      <section>
        <div className="vsl-wrap">
          <span className="vsl-eyebrow" style={{ color: 'var(--vsl-accent)' }}>
            Introducing Jobwhisper
          </span>
          <h2>Meet Your AI Interview Copilot.</h2>
          <div className="vsl-stack vsl-muted-light">
            <p>
              Before the interview, give Jobwhisper the context it needs: your resume, the role, the job
              description, your professional experience.
            </p>
            <p>
              Then start Interview Copilot. When the interviewer asks a question, Jobwhisper understands what they
              asked, what role you're interviewing for, what the company is looking for, and what's relevant from
              your background — and helps you structure a response in real time.
            </p>
          </div>
          <h3>Not random answers from the internet.</h3>
          <p className="vsl-muted-light">Responses informed by your own career context and the opportunity you're interviewing for.</p>
          <a href="#" className="vsl-btn vsl-btn-primary" style={{ marginTop: 12 }} onClick={openCheckout}>
            Get Jobwhisper Copilot
          </a>
        </div>
      </section>

      {/* ============ SECTION 07 — PRODUCT DEMO ============ */}
      <section className="vsl-on-paper-soft">
        <div className="vsl-wrap-wide">
          <div className="vsl-center" style={{ marginBottom: 36 }}>
            <h2>See What Happens When the Question Comes.</h2>
          </div>

          <div className="vsl-wrap">
            <div className="vsl-caption">
              <div className="vsl-caption-tag">
                <span className="vsl-dot"></span>Live — interviewer
              </div>
              <p>
                "Tell me about a time a product launch didn't go according to plan, and how you handled it."
              </p>
            </div>

            <div className="vsl-center">
              <div className="vsl-demo-toggle" role="tablist" aria-label="Compare with and without Jobwhisper">
                <button
                  className={demoPanel === 'without' ? 'vsl-active' : ''}
                  onClick={() => setDemoPanel('without')}
                >
                  Without Jobwhisper
                </button>
                <button className={demoPanel === 'with' ? 'vsl-active' : ''} onClick={() => setDemoPanel('with')}>
                  With Jobwhisper
                </button>
              </div>
            </div>

            {demoPanel === 'without' ? (
              <div className="vsl-demo-box vsl-without">"Ummm&hellip; there was this one project&hellip; I'm trying to remember&hellip;"</div>
            ) : (
              <div className="vsl-demo-box">
                <span className="vsl-marker">&gt;</span> Detecting question type: behavioral / launch failure
                <br />
                <span className="vsl-marker">&gt;</span> Matching experience: Q3 pricing rollout, Product Manager role
                <br />
                <span className="vsl-marker">&gt;</span> Suggested structure: what shipped → what broke → what you
                changed → outcome
              </div>
            )}

            <p className="vsl-muted-light vsl-center" style={{ marginTop: 28 }}>
              Now, instead of searching, you know where your answer should go.
            </p>
            <h3 className="vsl-center">Jobwhisper doesn't replace your experience.</h3>
            <p className="vsl-punch vsl-center">It helps you access and communicate that experience when it matters.</p>
          </div>
        </div>
      </section>

      {/* ============ SECTION 08 — WHAT JOBWHISPER HELPS WITH ============ */}
      <section>
        <div className="vsl-wrap-wide">
          <div className="vsl-center" style={{ marginBottom: 8 }}>
            <h2>One Copilot. Different Interview Moments.</h2>
          </div>
          <div className="vsl-grid">
            <div>
              <div className="vsl-glyph">BH</div>
              <h3>Behavioural Questions</h3>
              <p>Structure your experience into clearer responses.</p>
            </div>
            <div>
              <div className="vsl-glyph">UX</div>
              <h3>Unexpected Questions</h3>
              <p>Get direction when something catches you off guard.</p>
            </div>
            <div>
              <div className="vsl-glyph">TC</div>
              <h3>Technical Questions</h3>
              <p>Organize your thinking around the question being asked.</p>
            </div>
            <div>
              <div className="vsl-glyph">FU</div>
              <h3>Follow-up Questions</h3>
              <p>Stay composed when the interviewer pushes deeper.</p>
            </div>
            <div>
              <div className="vsl-glyph">CX</div>
              <h3>Career Experience</h3>
              <p>Surface relevant information from your professional background.</p>
            </div>
            <div>
              <div className="vsl-glyph">JS</div>
              <h3>Job-Specific Questions</h3>
              <p>Answer with the actual job and requirements in context.</p>
            </div>
            <div>
              <div className="vsl-glyph">CO</div>
              <h3>Communication</h3>
              <p>Get help expressing something you already understand more clearly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 09 — CATEGORY CONTRAST ============ */}
      <section>
        <div className="vsl-wrap">
          <h2>"Why Not Just Open ChatGPT During My Interview?"</h2>
          <p className="vsl-muted-light">
            You can absolutely use ChatGPT to prepare. But imagine doing this while somebody is interviewing you:
          </p>

          <div className="vsl-caption">
            <div className="vsl-caption-tag" style={{ color: '#ffffff' }}>
              <span className="vsl-dot" style={{ background: '#ffffff', animation: 'none' }}></span>You, typing
              mid-interview
            </div>
            <p>
              "Here's my resume. I'm interviewing for a Product Manager role at this company. Here's the job
              description. They just asked me this question. What should I say?"
            </p>
          </div>
          <p className="vsl-muted-light">Then doing it again for the next question. And again.</p>

          <p className="vsl-muted-light">Jobwhisper is designed around the actual interview workflow.</p>
          <ul className="vsl-checklist vsl-muted-light">
            <li>Your context is already there.</li>
            <li>Your resume is already there.</li>
            <li>The job is already there.</li>
            <li>Interview Copilot is already listening to the conversation.</li>
          </ul>
          <h3>You focus on the interview.</h3>
          <p className="vsl-punch">Jobwhisper focuses on helping you respond.</p>
        </div>
      </section>

      {/* ============ SECTION 10 — FUTURE PACE ============ */}
      <section>
        <div className="vsl-wrap">
          <h2>Imagine Your Next Interview Feeling Different.</h2>
          <div className="vsl-stack vsl-muted-light">
            <p>They ask something unexpected. You don't panic.</p>
            <p>They ask about an experience from three years ago. You have direction.</p>
            <p>They ask a difficult follow-up. You stay composed.</p>
            <p>
              Instead of desperately trying to invent the perfect answer, you're focused on the conversation.
              Listening. Thinking. Communicating. Being present.
            </p>
          </div>
          <h3>Your resume got you into the room.</h3>
          <p className="vsl-punch" style={{ color: 'var(--vsl-text-light)' }}>
            Jobwhisper helps you show them why you belong there.
          </p>
        </div>
      </section>

      {/* ============ SECTION 11 — SOCIAL PROOF ============ */}
      <section className="vsl-on-paper-soft">
        <div className="vsl-wrap-wide">
          <div className="vsl-center" style={{ marginBottom: 8 }}>
            <h2>Don't Just Take Our Word for It.</h2>
            <p className="vsl-muted-light">
              This section carries verified user experiences and outcomes only — no placeholder claims go live.
            </p>
          </div>
          <div className="vsl-proof-grid">
            <div className="vsl-proof-card">
              <span className="vsl-kicker">Verified testimonial</span>
              <p>Space reserved for a real, verified user quote.</p>
            </div>
            <div className="vsl-proof-card">
              <span className="vsl-kicker">Interview Copilot screenshot</span>
              <p>Space reserved for an in-product screenshot.</p>
            </div>
            <div className="vsl-proof-card">
              <span className="vsl-kicker">Verified user result</span>
              <p>Space reserved for a documented, verified outcome.</p>
            </div>
            <div className="vsl-proof-card">
              <span className="vsl-kicker">Video testimonial</span>
              <p>Space reserved for a recorded user story.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 12 — WHO IT'S FOR ============ */}
      <section>
        <div className="vsl-wrap">
          <div className="vsl-center">
            <h2>Jobwhisper Is Built for You If&hellip;</h2>
          </div>
          <div className="vsl-who-grid vsl-muted-light">
            <p>You're actively interviewing for jobs.</p>
            <p>You're getting interviews but not enough offers.</p>
            <p>You struggle with nerves.</p>
            <p>You sometimes ramble or lose your train of thought.</p>
            <p>You find it difficult to structure answers quickly.</p>
            <p>You're interviewing for a highly competitive position.</p>
            <p>You're moving into a more senior role.</p>
            <p>English isn't your strongest communication language.</p>
            <p>You have an important interview you don't want to leave entirely to chance.</p>
          </div>
          <p className="vsl-center vsl-muted-light" style={{ marginTop: 24 }}>
            Or you're simply tired of leaving interviews thinking:
          </p>
          <p className="vsl-divider-quote">"I could have answered that better."</p>
        </div>
      </section>

      {/* ============ SECTION 13 — THE OFFER ============ */}
      <section className="vsl-on-paper-soft">
        <div className="vsl-wrap vsl-center">
          <h2>Your Next Interview Could Change Your Career.</h2>
          <div className="vsl-stack vsl-muted-light vsl-center" style={{ textAlign: 'left' }}>
            <p>
              You have already done too much work to get the interview. Don't leave everything that happens next to
              memory, nerves and luck.
            </p>
          </div>
          <ul className="vsl-checklist vsl-muted-light" style={{ textAlign: 'left', maxWidth: 400, margin: '0 auto 1.4em' }}>
            <li>Set up Jobwhisper before the call.</li>
            <li>Add your resume.</li>
            <li>Add the role.</li>
            <li>Add the job description.</li>
            <li>Choose how you want Jobwhisper to assist you.</li>
          </ul>
          <p className="vsl-muted-light">Then take your Interview Copilot with you.</p>
          <a href="#" className="vsl-btn vsl-btn-primary" style={{ marginTop: 10 }} onClick={openCheckout}>
            Get Jobwhisper Interview Copilot
          </a>
        </div>
      </section>

      {/* ============ SECTION 15 — OBJECTION HANDLING ============ */}
      <section>
        <div className="vsl-faq">
          <div className="vsl-center" style={{ marginBottom: 10 }}>
            <h2>Before You Go In</h2>
          </div>
          <details>
            <summary>Will Jobwhisper answer everything for me?</summary>
            <p className="vsl-a">
              No. Jobwhisper is designed to assist your thinking and communication using your professional context.
              Your experience still matters.
            </p>
          </details>
          <details>
            <summary>Do I need to prepare?</summary>
            <p className="vsl-a">
              Yes. Jobwhisper works best when you provide good context and understand the role you're interviewing
              for.
            </p>
          </details>
          <details>
            <summary>Can I use it for technical interviews?</summary>
            <p className="vsl-a">
              Jobwhisper can assist across different interview questions, including technical and role-specific
              discussions, depending on the context provided.
            </p>
          </details>
          <details>
            <summary>Do I need to type every question?</summary>
            <p className="vsl-a">
              No. Interview Copilot is designed around listening to the interview conversation and providing
              assistance from that context.
            </p>
          </details>
          <details>
            <summary>Is this just ChatGPT?</summary>
            <p className="vsl-a">
              No. General AI tools can help you prepare. Jobwhisper is specifically built around your resume, job
              description, role and live interview workflow.
            </p>
          </details>
        </div>
      </section>

      {/* ============ SECTION 16 — FINAL CLOSE ============ */}
      <section className="vsl-center">
        <div className="vsl-wrap">
          <h2>You've Already Earned the Interview.</h2>
          <div className="vsl-stack vsl-muted-light vsl-center" style={{ textAlign: 'left' }}>
            <p>
              Your resume worked. They saw something they liked. They invited you into the conversation. Now your
              job is to show them why they made the right decision.
            </p>
            <p>
              You can walk into your next interview hoping you've prepared for every possible question. Or you can
              prepare properly and bring an intelligent copilot with you.
            </p>
          </div>
          <h3 style={{ marginTop: '0.6em' }}>
            Don't lose an opportunity because the right answer came to you five minutes too late.
          </h3>
          <a href="#" className="vsl-btn vsl-btn-primary" style={{ marginTop: 14 }} onClick={openCheckout}>
            Get Jobwhisper Copilot
          </a>
          <p className="vsl-cta-note">Set it up before your next interview.</p>
        </div>
      </section>

      <footer className="vsl-footer">Jobwhisper — AI Interview Copilot</footer>

      <VslCheckoutModal open={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  )
}
