import { Briefcase, GraduationCap, MapPin, Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const skills = ['Product strategy', 'User research', 'Roadmapping', 'SQL', 'Stakeholder management']

export default function JobProfile() {
  return (
    <div className="lf-page-stack">
      <div className="lf-page-header">
        <h1 className="lf-page-title">Job Profile</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Keep your target role, preferences, and background ready for better resume and auto-apply results.
        </p>
      </div>

      <section className="lf-panel p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:gap-6">
          <div>
            <h2 className="lf-section-title">Target role</h2>
            <p className="mt-2 text-sm text-muted-foreground">Lightforth uses this to personalize applications and interview prep.</p>
          </div>
          <Button>
            <Sparkles className="h-4 w-4" />
            Optimize Profile
          </Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="lf-panel p-4">
            <Briefcase className="h-5 w-5 text-primary" />
            <p className="mt-3 text-xs text-muted-foreground">Desired role</p>
            <p className="font-bold text-foreground">Product Manager</p>
          </div>
          <div className="lf-panel p-4">
            <MapPin className="h-5 w-5 text-primary" />
            <p className="mt-3 text-xs text-muted-foreground">Location</p>
            <p className="font-bold text-foreground">Remote · Lagos</p>
          </div>
          <div className="lf-panel p-4">
            <GraduationCap className="h-5 w-5 text-primary" />
            <p className="mt-3 text-xs text-muted-foreground">Experience</p>
            <p className="font-bold text-foreground">3-5 years</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="lf-panel p-6">
          <h2 className="lf-section-title">Profile details</h2>
          <div className="mt-5 space-y-4">
            {[
              ['Preferred industries', 'Fintech, SaaS, Consumer products'],
              ['Work authorization', 'Authorized to work in Nigeria'],
              ['Salary target', '₦20,000,000+ annually'],
              ['Notice period', '2 weeks'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border px-4 py-3">
                <p className="text-xs font-semibold text-muted-foreground">{label}</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lf-panel p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="lf-section-title">Skills</h2>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span key={skill} className="rounded-full bg-blue-50 px-3 py-2 text-sm font-semibold text-primary">
                {skill}
              </span>
            ))}
          </div>
          <div className="mt-8 rounded-lg bg-orange-50 p-4 text-sm leading-6 text-orange-700">
            Add measurable wins to improve resume tailoring and interview answers.
          </div>
        </div>
      </section>
    </div>
  )
}
