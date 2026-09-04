import type { AdminActivityEvent, AdminActivityFeed } from '@/contracts/admin-activity.draft'

const events: readonly AdminActivityEvent[] = [
  { id: 'act_001', kind: 'login', actorName: 'Marcus Bell', actorEmail: 'marcus.bell@example.com', detail: 'Signed in from Atlanta, GA', timeAgo: 'Just now', href: '/admin/accounts/acct_marcus_bell' },
  { id: 'act_002', kind: 'signup', actorName: 'Priya Okonkwo', actorEmail: 'priya.okonkwo@example.com', detail: 'Created an account via referral link', timeAgo: '2 minutes ago', href: '/admin/accounts/acct_darnell_smith' },
  { id: 'act_003', kind: 'payment', actorName: 'Sofia Marchetti', actorEmail: 'sofia.marchetti@example.com', detail: 'Pro subscription renewal', amountCents: 9_900, timeAgo: '4 minutes ago', href: '/admin/transactions/txn_9F2K4M' },
  { id: 'act_004', kind: 'login', actorName: 'Wei Zhang', actorEmail: 'wei.zhang@example.com', detail: 'Signed in from Toronto, ON', timeAgo: '6 minutes ago', href: '/admin/accounts/acct_wei_zhang' },
  { id: 'act_005', kind: 'signup', actorName: 'Tobiloba Adewale', actorEmail: 'tobiloba.adewale@example.com', detail: 'Created an account, started Pro trial', timeAgo: '9 minutes ago', href: '/admin/accounts/acct_tobiloba_adewale' },
  { id: 'act_006', kind: 'payment', actorName: 'Hannah Kirsch', actorEmail: 'hannah.kirsch@example.com', detail: 'Credit top-up · 500 credits', amountCents: 5_000, timeAgo: '12 minutes ago', href: '/admin/transactions/txn_7T3XQP' },
  { id: 'act_007', kind: 'login', actorName: 'Diego Restrepo', actorEmail: 'diego.restrepo@example.com', detail: 'Signed in from Bogotá, CO', timeAgo: '15 minutes ago', href: '/admin/accounts/acct_diego_restrepo' },
  { id: 'act_008', kind: 'refund', actorName: 'Amara Nwosu', actorEmail: 'amara.nwosu@example.com', detail: 'Refund approved by Daniel Okoye', amountCents: 4_700, timeAgo: '18 minutes ago', href: '/admin/transactions/txn_4QH7ZB' },
  { id: 'act_009', kind: 'signup', actorName: 'Fatima Al-Mansouri', actorEmail: 'fatima.almansouri@example.com', detail: 'Created an account via Google', timeAgo: '22 minutes ago', href: '/admin/accounts/acct_fatima_al_mansouri' },
  { id: 'act_010', kind: 'login', actorName: 'Jonathan Okafor', actorEmail: 'jonathan.okafor@example.com', detail: 'Signed in from Lagos, NG', timeAgo: '27 minutes ago', href: '/admin/accounts/acct_jonathan_okafor' },
  { id: 'act_011', kind: 'payment', actorName: 'Elena Kovalenko', actorEmail: 'elena.kovalenko@example.com', detail: 'Marketplace purchase · Resume Templates', amountCents: 2_900, timeAgo: '31 minutes ago', href: '/admin/transactions/txn_5N1DKR' },
  { id: 'act_012', kind: 'payment', actorName: 'Samuel Boateng', actorEmail: 'samuel.boateng@example.com', detail: 'Done-For-You package · 50 jobs', amountCents: 49_700, timeAgo: '38 minutes ago', href: '/admin/transactions/txn_8C6VJT' },
  { id: 'act_013', kind: 'login', actorName: 'Aisha Rahman', actorEmail: 'aisha.rahman@example.com', detail: 'Signed in from Dhaka, BD', timeAgo: '44 minutes ago', href: '/admin/accounts/acct_aisha_rahman' },
  { id: 'act_014', kind: 'signup', actorName: 'Christopher Vandenberg', actorEmail: 'christopher.vandenberg@example.com', detail: 'Created an account, no plan yet', timeAgo: '51 minutes ago', href: '/admin/accounts/acct_christopher_vandenberg' },
  { id: 'act_015', kind: 'payout', actorName: 'Jobwhisper payouts', actorEmail: 'payouts@jobwhisper.com', detail: 'Weekly success-manager payout batch', amountCents: 312_000, timeAgo: '1 hour ago', href: '/admin/transactions/txn_2B8WLC' },
  { id: 'act_016', kind: 'login', actorName: 'Yuki Tanaka', actorEmail: 'yuki.tanaka@example.com', detail: 'Signed in from Osaka, JP', timeAgo: '1 hour ago', href: '/admin/accounts/acct_yuki_tanaka' },
  { id: 'act_017', kind: 'payment', actorName: 'Nkechi Obiora', actorEmail: 'nkechi.obiora@example.com', detail: 'Premium subscription renewal', amountCents: 19_900, timeAgo: '2 hours ago', href: '/admin/transactions/txn_3K9YHD' },
  { id: 'act_018', kind: 'signup', actorName: 'Liam O’Sullivan', actorEmail: 'liam.osullivan@example.com', detail: 'Created an account via LinkedIn', timeAgo: '2 hours ago', href: '/admin/accounts/acct_liam_osullivan' },
  { id: 'act_019', kind: 'login', actorName: 'Renata Gonçalves', actorEmail: 'renata.goncalves@example.com', detail: 'Signed in from São Paulo, BR', timeAgo: '3 hours ago', href: '/admin/accounts/acct_renata_goncalves' },
  { id: 'act_020', kind: 'refund', actorName: 'Karim Haddad', actorEmail: 'karim.haddad@example.com', detail: 'Refund approved by Priya Raghunathan', amountCents: 9_900, timeAgo: '3 hours ago', href: '/admin/transactions/txn_6W4RNF' },
  { id: 'act_021', kind: 'payment', actorName: 'Darnell Smith', actorEmail: 'darnell.smith@example.com', detail: 'Credit top-up · 1,000 credits', amountCents: 9_500, timeAgo: '4 hours ago', href: '/admin/transactions/txn_1M7GPS' },
  { id: 'act_022', kind: 'login', actorName: 'Priyanka Venkataraman', actorEmail: 'priyanka.venkataraman@example.com', detail: 'Signed in from San Francisco, CA', timeAgo: '5 hours ago', href: '/admin/accounts/acct_priyanka_venkataraman' },
  { id: 'act_023', kind: 'signup', actorName: 'Ryan Delacroix', actorEmail: 'ryan.delacroix@example.com', detail: 'Created an account, started Starter trial', timeAgo: '6 hours ago', href: '/admin/accounts/acct_marcus_bell' },
  { id: 'act_024', kind: 'payment', actorName: 'Grace Mutiso', actorEmail: 'grace.mutiso@example.com', detail: 'Pro subscription renewal', amountCents: 9_900, timeAgo: '7 hours ago', href: '/admin/transactions/txn_0X5ZTV' },
  { id: 'act_025', kind: 'login', actorName: 'Andre dos Santos', actorEmail: 'andre.dossantos@example.com', detail: 'Signed in from Lisbon, PT', timeAgo: '8 hours ago', href: '/admin/accounts/acct_hannah_kirsch' },
  { id: 'act_026', kind: 'payment', actorName: 'Meredith Ashcombe', actorEmail: 'meredith.ashcombe@example.com', detail: 'Marketplace purchase · Salary Scripts', amountCents: 1_500, timeAgo: '9 hours ago', href: '/admin/transactions/txn_4H2LQW' },
  { id: 'act_027', kind: 'signup', actorName: 'Chloe Beaumont', actorEmail: 'chloe.beaumont@example.com', detail: 'Created an account via Google', timeAgo: '11 hours ago', href: '/admin/accounts/acct_sofia_marchetti' },
  { id: 'act_028', kind: 'login', actorName: 'Gregory Whitfield', actorEmail: 'gregory.whitfield@example.com', detail: 'Signed in from Manchester, UK', timeAgo: '13 hours ago', href: '/admin/accounts/acct_nkechi_obiora' },
  { id: 'act_029', kind: 'refund', actorName: 'Olga Vasilenko', actorEmail: 'olga.vasilenko@example.com', detail: 'Refund approved by Daniel Okoye', amountCents: 15_000, timeAgo: '15 hours ago', href: '/admin/transactions/txn_9D6TNE' },
  { id: 'act_030', kind: 'payment', actorName: 'Zainab Al-Rashid', actorEmail: 'zainab.alrashid@example.com', detail: 'Done-For-You package · 100 jobs', amountCents: 99_700, timeAgo: '18 hours ago', href: '/admin/transactions/txn_7P3VBK' },
  { id: 'act_031', kind: 'login', actorName: 'Nikhil Ramanathan', actorEmail: 'nikhil.ramanathan@example.com', detail: 'Signed in from Bengaluru, IN', timeAgo: '20 hours ago', href: '/admin/accounts/acct_elena_kovalenko' },
  { id: 'act_032', kind: 'signup', actorName: 'Lena Hoffmann', actorEmail: 'lena.hoffmann@example.com', detail: 'Created an account via referral link', timeAgo: '22 hours ago', href: '/admin/accounts/acct_amara_nwosu' },
  { id: 'act_033', kind: 'payment', actorName: 'Jonas Lindberg', actorEmail: 'jonas.lindberg@example.com', detail: 'Premium subscription renewal', amountCents: 19_900, timeAgo: 'Yesterday', href: '/admin/transactions/txn_2S8FMA' },
  { id: 'act_034', kind: 'login', actorName: 'Grace Abernathy', actorEmail: 'grace.abernathy@example.com', detail: 'Signed in from Denver, CO', timeAgo: 'Yesterday', href: '/admin/accounts/acct_christopher_vandenberg' },
  { id: 'act_035', kind: 'payout', actorName: 'Jobwhisper payouts', actorEmail: 'payouts@jobwhisper.com', detail: 'Referral reward batch, 41 accounts', amountCents: 41_000, timeAgo: 'Yesterday', href: '/admin/transactions/txn_5R1WZX' },
  { id: 'act_036', kind: 'signup', actorName: 'Ibrahim Suleiman', actorEmail: 'ibrahim.suleiman@example.com', detail: 'Created an account, no plan yet', timeAgo: 'Yesterday', href: '/admin/accounts/acct_diego_restrepo' },
]

export const adminActivityFeed: AdminActivityFeed = {
  events,
  signupsToday: events.filter((event) => event.kind === 'signup' && !event.timeAgo.includes('Yesterday')).length,
  loginsToday: events.filter((event) => event.kind === 'login' && !event.timeAgo.includes('Yesterday')).length,
  incomeTodayCents: events
    .filter((event) => event.kind === 'payment' && !event.timeAgo.includes('Yesterday'))
    .reduce((sum, event) => sum + (event.amountCents ?? 0), 0),
}
