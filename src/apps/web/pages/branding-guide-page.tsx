import { useEffect, useMemo, useState } from 'react'

type BrandGuideSlide = {
  id: string
  pageNumber: number
  title: string
  chapter: string
}

const slides: BrandGuideSlide[] = [
  { id: 'page-01', pageNumber: 1, title: 'Cover', chapter: 'Start' },
  { id: 'page-02', pageNumber: 2, title: 'Introduction', chapter: 'Start' },
  { id: 'page-03', pageNumber: 3, title: 'The Logo', chapter: 'Logo' },
  { id: 'page-04', pageNumber: 4, title: 'Logo Clear Space', chapter: 'Logo' },
  { id: 'page-05', pageNumber: 5, title: 'Dos and Donts', chapter: 'Logo' },
  { id: 'page-06', pageNumber: 6, title: 'Logo Lockups', chapter: 'Logo' },
  { id: 'page-07', pageNumber: 7, title: 'The Monogram', chapter: 'Identity' },
  { id: 'page-08', pageNumber: 8, title: 'Display Icons', chapter: 'Identity' },
  { id: 'page-09', pageNumber: 9, title: 'App Icon and Avatar', chapter: 'Identity' },
  { id: 'page-10', pageNumber: 10, title: 'Colors', chapter: 'Visual System' },
  { id: 'page-11', pageNumber: 11, title: 'Primary Colors', chapter: 'Visual System' },
  { id: 'page-12', pageNumber: 12, title: 'Secondary Colors', chapter: 'Visual System' },
  { id: 'page-13', pageNumber: 13, title: 'Gradients', chapter: 'Visual System' },
  { id: 'page-14', pageNumber: 14, title: 'Blue Shades', chapter: 'Visual System' },
  { id: 'page-15', pageNumber: 15, title: 'Type Set', chapter: 'Typography' },
  { id: 'page-16', pageNumber: 16, title: 'Gowun Batang', chapter: 'Typography' },
  { id: 'page-17', pageNumber: 17, title: 'Rethink Sans', chapter: 'Typography' },
  { id: 'page-18', pageNumber: 18, title: 'Type Specimen', chapter: 'Typography' },
  { id: 'page-19', pageNumber: 19, title: 'Type in Use', chapter: 'Typography' },
  { id: 'page-20', pageNumber: 20, title: 'Icons and Illustrations', chapter: 'Assets' },
  { id: 'page-21', pageNumber: 21, title: 'Icon System', chapter: 'Assets' },
  { id: 'page-22', pageNumber: 22, title: 'Illustration Style', chapter: 'Assets' },
  { id: 'page-23', pageNumber: 23, title: 'Imagery', chapter: 'Imagery' },
  { id: 'page-24', pageNumber: 24, title: 'Qualified and Searching', chapter: 'Imagery' },
  { id: 'page-25', pageNumber: 25, title: 'Career Ambition', chapter: 'Imagery' },
  { id: 'page-26', pageNumber: 26, title: 'Outcome Imagery', chapter: 'Imagery' },
  { id: 'page-27', pageNumber: 27, title: 'Brand Tone', chapter: 'Copy System' },
  { id: 'page-28', pageNumber: 28, title: 'Culturally Sound', chapter: 'Copy System' },
  { id: 'page-29', pageNumber: 29, title: 'Audience Portrait', chapter: 'Copy System' },
  { id: 'page-30', pageNumber: 30, title: 'Emotional Core', chapter: 'Copy System' },
  { id: 'page-31', pageNumber: 31, title: 'Messaging Pillars', chapter: 'Copy System' },
  { id: 'page-32', pageNumber: 32, title: 'Tone of Voice', chapter: 'Copy System' },
  { id: 'page-33', pageNumber: 33, title: 'Core Messaging Bank', chapter: 'Copy System' },
  { id: 'page-34', pageNumber: 34, title: 'Mood Boards', chapter: 'Mood' },
  { id: 'page-35', pageNumber: 35, title: 'Mood Board One', chapter: 'Mood' },
  { id: 'page-36', pageNumber: 36, title: 'Mood Board Two', chapter: 'Mood' },
  { id: 'page-37', pageNumber: 37, title: 'Thanks', chapter: 'Close' },
]

function slidePath(slide: BrandGuideSlide) {
  return `/brand-guide/svg-slides-v2/slide-${String(slide.pageNumber).padStart(2, '0')}.svg`
}

export function BrandingGuidePage() {
  const [activeSlideId, setActiveSlideId] = useState(slides[0].id)

  const groupedSlides = useMemo(() => {
    return slides.reduce<Array<{ chapter: string; items: BrandGuideSlide[] }>>((groups, slide) => {
      const lastGroup = groups[groups.length - 1]
      if (lastGroup?.chapter === slide.chapter) {
        lastGroup.items.push(slide)
        return groups
      }
      groups.push({ chapter: slide.chapter, items: [slide] })
      return groups
    }, [])
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visibleEntry?.target.id) {
          setActiveSlideId(visibleEntry.target.id)
        }
      },
      { rootMargin: '-36% 0px -52% 0px', threshold: [0.2, 0.45, 0.7] },
    )

    slides.forEach((slide) => {
      const element = document.getElementById(slide.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <aside className="fixed inset-y-0 left-0 z-sticky hidden w-64 border-r border-border bg-surface px-4 py-5 lg:flex lg:flex-col">
        <nav aria-label="Brand guide sections" className="min-h-0 flex-1 overflow-y-auto pr-1">
          {groupedSlides.map((group) => (
            <div key={group.chapter} className="mb-4">
              <p className="mb-1 text-xs font-semibold tracking-normal text-ink-muted">{group.chapter}</p>
              {group.items.map((slide) => {
                const isActive = slide.id === activeSlideId

                return (
                  <a
                    key={slide.id}
                    href={`#${slide.id}`}
                    className={[
                      'block rounded-soft px-2 py-1.5 text-sm transition-colors',
                      isActive
                        ? 'bg-accent text-on-accent'
                        : 'text-ink-muted hover:bg-surface-subtle hover:text-ink',
                    ].join(' ')}
                  >
                    {slide.title}
                  </a>
                )
              })}
            </div>
          ))}
        </nav>
      </aside>

      <header className="sticky top-0 z-sticky border-b border-border bg-surface px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <p className="font-gowun text-2xl leading-tight text-ink">Brand Guide</p>
          <a className="lf-btn-outline" href="/brand-guide/jobwhisper-1.0.pdf" download>
            PDF
          </a>
        </div>
      </header>

      <section className="lg:pl-64">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-3 py-2 sm:px-4 lg:px-6">
          {slides.map((slide, index) => (
            <article key={slide.id} id={slide.id} className="scroll-mt-3" aria-label={`Page ${index + 1}: ${slide.title}`}>
              <div className="overflow-hidden rounded-soft bg-surface">
                <img
                  src={slidePath(slide)}
                  alt={`Jobwhisper brand guide page ${index + 1}: ${slide.title}`}
                  className="block aspect-video w-full bg-surface object-contain"
                  loading={index < 3 ? 'eager' : 'lazy'}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
