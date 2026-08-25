import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FilePlus,
  Upload,
  Link2,
  MoreHorizontal,
  Search,
  LayoutList,
  LayoutGrid,
  FileText,
  ArrowDownUp,
  X,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const mockResumes = [
  {
    id: '1',
    title: 'Darnell_Smith_Design_Engineer.pdf',
    atsScore: 38,
    modified: 'Apr 30, 2026 at 05:47 PM',
    created: 'Apr 30, 2026 at 05:47 PM',
    preview: '/templates/t01.png',
  },
  {
    id: '2',
    title: 'Darnell_Smith_Product_Manager_&_Design_Engineer.pdf',
    atsScore: 86,
    modified: 'Apr 20, 2026 at 05:29 PM',
    created: 'Apr 20, 2026 at 05:27 PM',
    preview: '/templates/t02.png',
  },
  {
    id: '3',
    title: 'Darnell_Smith_Product_Manager_Design_Engineer_AI_Builder.pdf',
    atsScore: 58,
    modified: 'Apr 20, 2026 at 05:26 PM',
    created: 'Apr 20, 2026 at 05:25 PM',
    preview: '/templates/t13.png',
  },
  {
    id: '4',
    title: 'Smith_Darnell_Design_Engineer.pdf',
    atsScore: 0,
    modified: 'Apr 3, 2026 at 12:57 AM',
    created: 'Apr 3, 2026 at 12:57 AM',
    preview: '/templates/t05.png',
  },
]

function atsColor(score: number) {
  if (score === 0) return 'bg-gray-200 text-gray-500'
  if (score >= 70) return 'bg-green-500 text-white'
  if (score >= 40) return 'bg-yellow-500 text-white'
  return 'bg-red-400 text-white'
}

export default function MyDocuments() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'yours' | 'ai'>('yours')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')
  const [search, setSearch] = useState('')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  const filteredResumes = mockResumes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="lf-page-shell">
      <div className="lf-page-header">
        <h1 className="lf-page-title">Resumes</h1>
      </div>

      {/* Create a new resume section */}
      <p className="text-sm font-semibold text-foreground mb-1">Create a new resume</p>
      <p className="text-xs text-muted-foreground mb-4">Choose a starting point for your resume</p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Create from scratch */}
        <div
          className="lf-panel cursor-pointer p-5 transition-all hover:border-violet-300 hover:shadow-sm"
          onClick={() => navigate('/resume-builder?mode=scratch')}
        >
          <div className="rounded-lg bg-violet-100 p-2.5 mb-3 w-fit">
            <FilePlus className="h-5 w-5 text-violet-600" />
          </div>
          <p className="text-sm font-semibold text-violet-600">Create from scratch</p>
          <p className="text-xs text-muted-foreground mt-1">Use AI to build your resume</p>
        </div>

        {/* Card 2: Create from a resume */}
        <div
          className="lf-panel cursor-pointer p-5 transition-all hover:border-green-300 hover:shadow-sm"
          onClick={() => setUploadModalOpen(true)}
        >
          <div className="rounded-lg bg-green-100 p-2.5 mb-3 w-fit">
            <Upload className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-sm font-semibold text-green-600">Create from a resume</p>
          <p className="text-xs text-muted-foreground mt-1">Click to upload PDF or DOCX. (max. 5MB)</p>
        </div>

        {/* Card 3: From a Link */}
        <div className="lf-panel relative cursor-not-allowed p-5 opacity-60">
          <span className="absolute top-3 right-3 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 font-medium">
            Coming soon
          </span>
          <div className="rounded-lg bg-gray-100 p-2.5 mb-3 w-fit">
            <Link2 className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-400">From a Link</p>
          <p className="text-xs text-muted-foreground mt-1">Upload a google docs or LinkedIn profile link.</p>
        </div>
      </div>

      {/* History section */}
      <h2 className="text-base font-semibold text-foreground mt-8 mb-4">History</h2>

      {/* Tabs */}
      <div className="lf-tabs mb-4">
        <button
          className={cn(
            'lf-tab',
            activeTab === 'yours' && 'lf-tab-active'
          )}
          onClick={() => setActiveTab('yours')}
        >
          Created by you
        </button>
        <button
          className={cn(
            'lf-tab',
            activeTab === 'ai' && 'lf-tab-active'
          )}
          onClick={() => setActiveTab('ai')}
        >
          Created by AI
        </button>
      </div>

      {/* Search + view toggle row */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, job title, location..."
            className="lf-input pl-9"
          />
        </div>
        <div className="flex items-center gap-1 sm:ml-4">
          <button
            className={cn(
              'p-1.5 rounded transition-colors',
              viewMode === 'list' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setViewMode('list')}
          >
            <LayoutList className="h-4 w-4" />
          </button>
          <button
            className={cn(
              'p-1.5 rounded transition-colors',
              viewMode === 'grid' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredResumes.map((resume) => (
            <article key={resume.id} className="group">
              <button className="w-full rounded-lg border border-border bg-white p-4 transition hover:border-primary/50 hover:shadow-sm">
                <div className="flex aspect-[3/4] max-h-[420px] items-start justify-center overflow-hidden rounded-md bg-slate-50 p-4">
                  <img src={resume.preview} alt={`${resume.title} preview`} className="h-full w-full object-contain object-top shadow-sm" />
                </div>
              </button>
              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-foreground">{resume.title.replace(/[_-]/g, ' ').replace(/\.pdf$/i, '')}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Last edited: {resume.modified}</p>
                </div>
                <button aria-label="Resume actions" className="shrink-0 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
      <div className="lf-table-wrap">
        <table className="lf-table">
          <thead className="lf-table-head">
          <tr>
            <th className="lf-table-th">
              <span className="flex items-center gap-1">
                Title <ArrowDownUp className="h-3 w-3" />
              </span>
            </th>
            <th className="lf-table-th">
              <span className="flex items-center gap-1">
                ATS Score <ArrowDownUp className="h-3 w-3" />
              </span>
            </th>
            <th className="lf-table-th">
              <span className="flex items-center gap-1">
                Modified <ArrowDownUp className="h-3 w-3" />
              </span>
            </th>
            <th className="lf-table-th">
              <span className="flex items-center gap-1">
                Created <ArrowDownUp className="h-3 w-3" />
              </span>
            </th>
            <th className="lf-table-th">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredResumes.map((resume) => (
            <tr
              key={resume.id}
              className="lf-table-row"
            >
              <td className="lf-table-cell">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground truncate max-w-xs">{resume.title}</span>
                </span>
              </td>
              <td className="lf-table-cell">
                <span
                  className={cn(
                    'rounded-full h-7 w-7 flex items-center justify-center text-xs font-bold',
                    atsColor(resume.atsScore)
                  )}
                >
                  {resume.atsScore}
                </span>
              </td>
              <td className="lf-table-cell text-muted-foreground">{resume.modified}</td>
              <td className="lf-table-cell text-muted-foreground">{resume.created}</td>
              <td className="lf-table-cell">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      )}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="lf-panel w-full max-w-[560px] p-0 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-bold text-foreground">Create from a resume</h2>
              <button onClick={() => setUploadModalOpen(false)} aria-label="Close create from resume modal">
                <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <div className="space-y-5 p-6">
              <section>
                <p className="lf-label mb-3">Quick Select</p>
                <button className="flex w-full items-center gap-3 rounded-lg border border-border bg-white px-3 py-3 text-left transition hover:border-primary/60">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-red-100">
                    <FileText className="h-5 w-5 fill-red-500 text-red-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">Adedamola_Adewale_Product_Manager.pdf</p>
                    <p className="mt-1 text-xs text-muted-foreground">120 KB · Product Manager</p>
                  </div>
                  <span className="rounded-full border border-primary bg-primary/5 px-2 py-0.5 text-[10px] font-bold text-primary">LAST USED</span>
                </button>
              </section>

              <section>
                <p className="lf-label mb-3">Or choose another resume</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-white text-sm font-semibold text-foreground transition hover:bg-muted">
                    <Upload className="h-4 w-4" />
                    Upload a Resume
                  </button>
                  <button className="relative inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-primary bg-primary/5 text-sm font-semibold text-primary transition hover:bg-primary/10">
                    <span className="absolute -top-4 rounded-full border border-primary bg-white px-2 py-0.5 text-[9px] font-bold text-primary">RECOMMENDED</span>
                    <Sparkles className="h-4 w-4" />
                    Use Lightforth Resume
                  </button>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">PDF files only · Max size: 10MB</p>
              </section>

              <div className="grid gap-3 border-t border-border pt-4 md:grid-cols-2">
                <button onClick={() => setUploadModalOpen(false)} className="h-11 rounded-lg border border-border bg-white text-sm font-semibold text-foreground transition hover:bg-muted">
                  Cancel
                </button>
                <button onClick={() => navigate('/resume-builder?mode=tailor')} className="h-11 rounded-lg bg-primary text-sm font-semibold text-white transition hover:bg-primary/90">
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
