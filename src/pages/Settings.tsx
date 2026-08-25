import { Copy, EyeOff, Search, Upload } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const tabs = ['profile', 'security', 'referral'] as const
type Tab = (typeof tabs)[number]

const referrals = [
  ['1', 'Jojo A', 'anyimjosh1995@gmail.com', '03/09/2026, 2:31 am'],
  ['2', 'Morayo Sanni', 'sannimoyo@yahoo.com', '02/18/2026, 9:29 am'],
  ['3', 'Jamal Yakubu', 'jamal.yakubu@yahoo.com', '02/17/2026, 2:58 pm'],
  ['4', 'Joseph Ayo', 'ayojoefemi925@gmail.com', '02/13/2026, 6:59 am'],
  ['5', 'Evans Hoyah', 'reghoyah@gmail.com', '02/12/2026, 9:40 pm'],
  ['6', 'Martins Obike', 'chiemezieobike@gmail.com', '02/12/2026, 8:53 pm'],
  ['7', 'Oluwadamilola Bello', 'foams-prodigy-0x@icloud.com', '02/12/2026, 3:19 pm'],
  ['8', 'Peter Osafo Adjei', 'pheewyn@gmail.com', '02/12/2026, 3:06 pm'],
  ['9', 'Saint Sunday', 'ssaintnoni@gmail.com', '02/11/2026, 4:09 pm'],
  ['10', 'Michael Awosika', 'michaelawosika01@gmail.com', '02/11/2026, 1:36 pm'],
]

function Field({ label, value, wide, disabled }: { label: string; value: string; wide?: boolean; disabled?: boolean }) {
  return (
    <label className={cn('block', wide && 'md:col-span-2')}>
      <span className="lf-label">{label}</span>
      <input
        className={cn(
          'lf-input font-medium',
          disabled && 'bg-muted text-muted-foreground',
        )}
        value={value}
        disabled={disabled}
        readOnly
      />
    </label>
  )
}

function ProfileTab() {
  return (
    <section className="lf-panel p-4 sm:p-8">
      <div className="mb-8 flex items-center justify-between gap-3">
        <h2 className="lf-section-title">Profile</h2>
        <Button>Update</Button>
      </div>
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-sm font-black">PROFI</div>
        <div>
          <Button variant="outline">
            <Upload className="h-4 w-4" />
            Upload Photo
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">JPG, PNG, GIF or WebP. Max 5MB.</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="First Name" value="Adedamola" />
        <Field label="Last Name" value="Adewale" />
        <Field label="Email" value="adewaledamola52@yahoo.com" />
        <Field label="Phone Number" value="🇳🇬  +234 810 367 400" />
        <Field label="Country" value="Nigeria" wide disabled />
        <Field label="City" value="Agege" />
        <Field label="Postal Code" value="100216" />
      </div>
    </section>
  )
}

function SecurityTab() {
  return (
    <div className="space-y-6">
      <section className="lf-panel p-4 sm:p-8">
        <div className="mb-8 flex items-center justify-between gap-3">
          <h2 className="lf-section-title">Password</h2>
          <Button>Update</Button>
        </div>
        <div className="space-y-6">
          {['Current Password', 'New Password', 'Confirm New Password'].map((label) => (
            <label key={label} className="block">
              <span className="lf-label">{label}</span>
              <div className="lf-input flex items-center">
                <input className="flex-1 bg-transparent text-sm outline-none" type="password" value="passwordpassword" readOnly />
                <EyeOff className="h-4 w-4 text-slate-400" />
              </div>
            </label>
          ))}
        </div>
      </section>
      <section className="lf-panel flex flex-col items-start justify-between gap-4 p-4 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h2 className="font-bold text-foreground">Two-step verification</h2>
          <p className="text-sm text-muted-foreground">We recommend 2FA for better security</p>
        </div>
        <span className="h-7 w-12 rounded-full bg-slate-300 p-1">
          <span className="block h-5 w-5 rounded-full bg-white" />
        </span>
      </section>
      <section className="lf-panel flex flex-col items-start justify-between gap-4 p-4 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h2 className="font-bold text-foreground">Delete Account</h2>
          <p className="text-sm text-muted-foreground">Permanently delete your Lightforth account.</p>
        </div>
        <Button variant="outline" className="border-red-300 text-red-500 hover:bg-red-50">Delete Account</Button>
      </section>
    </div>
  )
}

function ReferralTab() {
  return (
    <div className="space-y-8">
      <section className="lf-panel p-4 sm:p-8">
        <h2 className="lf-section-title">Referral</h2>
        <div className="mt-8 rounded-2xl bg-blue-50 p-4 sm:rounded-3xl sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
            <div>
              <h3 className="text-2xl font-black leading-tight text-foreground">Earn 5 bonus credits</h3>
              <p className="mt-4 text-sm text-muted-foreground">You get 5 bonus credits when your invite signs up and subscribes.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {['https://lifeforth-app-v2-dev-fronten...', 'Adedamolaios...'].map((value, index) => (
                  <div key={value} className="min-w-0 flex-1 rounded-md border border-violet-400 bg-white px-4 py-3 sm:min-w-52">
                    <p className="text-xs text-muted-foreground">{index === 0 ? 'Referral Link' : 'Referral Code'}</p>
                    <div className="flex items-center gap-3">
                      <p className="truncate text-sm font-bold text-violet-500">{value}</p>
                      <Copy className="h-4 w-4 text-violet-500" />
                    </div>
                  </div>
                ))}
              </div>
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                <li>Invite a friend using your link</li>
                <li>They sign up {'->'} you earn 5 bonus credits</li>
                <li>Refer 5 friends {'->'} unlock 25 credits + bonus tools</li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-48 w-48 rounded-full bg-rose-100">
                <div className="absolute left-8 top-10 h-24 w-20 rounded-full bg-orange-200" />
                <div className="absolute right-8 top-12 h-24 w-20 rounded-full bg-amber-900" />
                <div className="absolute left-16 top-8 h-12 w-24 rounded-full bg-amber-950" />
              </div>
            </div>
          </div>
        </div>
        <h3 className="lf-section-title mt-8">Why Share?</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {['Know someone job hunting?', 'Got friends frustrated with job boards?', 'Have a WhatsApp group filled with job seekers?'].map((title) => (
            <div key={title} className="lf-panel p-5">
              <h4 className="text-lg font-bold text-foreground">{title}</h4>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">Share Lightforth and help others discover a better way to get hired while you accumulate credits.</p>
              <button className="mt-6 text-sm font-bold text-primary">Share your referral link</button>
            </div>
          ))}
        </div>
      </section>

      <section className="lf-panel p-4 sm:p-8">
        <h2 className="lf-section-title">Previous Referrals</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ['Total Referrals', '19'],
            ['Subscribed Referrals', '0'],
            ['Credit Earned', '0'],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-lg border px-5 py-4">
              <span className="text-sm text-muted-foreground">{label}</span>
              <strong className="text-2xl">{value}</strong>
            </div>
          ))}
        </div>
        <div className="lf-input mt-6 flex max-w-xs items-center gap-2">
          <Search className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-400">Search</span>
        </div>
        <div className="lf-table-wrap mt-6">
          <table className="lf-table">
            <thead className="lf-table-head">
              <tr>
                <th className="lf-table-th">S/N</th>
                <th className="lf-table-th">Name</th>
                <th className="lf-table-th">Email</th>
                <th className="lf-table-th">Date & Time</th>
                <th className="lf-table-th">Status</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map(([sn, name, email, date]) => (
                <tr key={sn} className="lf-table-row">
                  <td className="lf-table-cell text-muted-foreground">{sn}</td>
                  <td className="lf-table-cell font-semibold text-foreground">{name}</td>
                  <td className="lf-table-cell text-muted-foreground">{email}</td>
                  <td className="lf-table-cell text-muted-foreground">{date}</td>
                  <td className="lf-table-cell">
                    <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-500">
                      Not-Subscribe
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default function Settings() {
  const [params] = useSearchParams()
  const activeTab = (tabs.includes(params.get('tab') as Tab) ? params.get('tab') : 'profile') as Tab

  return (
    <div className="lf-page-shell">
      <div className="lf-page-header">
        <h1 className="lf-page-title">Settings</h1>
      </div>
      <div className="lf-tabs">
        {tabs.map((tab) => (
          <Link
            key={tab}
            to={tab === 'profile' ? '/settings' : `/settings?tab=${tab}`}
            className={cn(
              'lf-tab capitalize',
              activeTab === tab && 'lf-tab-active',
            )}
          >
            {tab}
          </Link>
        ))}
      </div>
      <div className="mt-7">
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'security' && <SecurityTab />}
{activeTab === 'referral' && <ReferralTab />}
      </div>
    </div>
  )
}
