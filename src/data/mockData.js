// =====================================================================
// R Angle — AI Sales Monitoring Model :: MOCK DATA
// ---------------------------------------------------------------------
// 100% offline, deterministic dummy data driving the entire prototype.
// Numbers are kept internally consistent with the approved strategy:
//   • Founder = 100% conversion (escalation target)
//   • Sales team average ≈ 4% (the 25:1 gap the system is built to close)
//   • Design phase ≈ 99% conversion
//   • Expected impact: 30% productivity / 25% revenue growth
// =====================================================================

// ---------------------------------------------------------------------
// CONNECTED SYSTEMS (Section 4.A)
// ---------------------------------------------------------------------
export const connectedSystems = [
  { name: 'Dezylo', category: 'Project Management', status: 'Connected' },
  { name: 'Project Studio', category: 'Project Management', status: 'Connected' },
  { name: 'Privyr', category: 'Lead Management', status: 'Connected' },
  { name: 'AI Sensi / WhatsApp', category: 'Lead Management', status: 'Connected' },
  { name: 'Tranzact', category: 'Financial · API', status: 'Connected' },
]

// ---------------------------------------------------------------------
// 5-STAGE SALES WORKFLOW (Section 4.A)
// ---------------------------------------------------------------------
export const salesWorkflow = [
  {
    id: 1,
    name: 'Lead Generation',
    detail: 'Facebook · WhatsApp · LinkedIn → Privyr',
    count: 412,
  },
  {
    id: 2,
    name: 'Sales Team Follow-Up',
    detail: 'Qualification & first contact',
    count: 268,
  },
  {
    id: 3,
    name: 'Site-Visit Customers',
    detail: '₹500 collected → qualified → visit scheduled',
    count: 96,
    marker: '₹500 signal',
  },
  {
    id: 4,
    name: 'No-Site-Visit / Budget',
    detail: 'Budget-focused · 2–3 site options · budget calculator',
    count: 71,
  },
  {
    id: 5,
    name: 'Design Phase',
    detail: 'Budget approval → Design Team → advance collection',
    count: 58,
    marker: '99% conversion',
  },
]

// ---------------------------------------------------------------------
// ICP DEFINITION (Section 4.C)
// ---------------------------------------------------------------------
export const icpDefinition = {
  title: 'Hot Lead ICP',
  criteria: ['LinkedIn users', 'Semi-HNIs', 'Married couples aged 25–30+'],
  description:
    'Leads matching all three signals are flagged Hot and smart-routed to the Senior Team.',
}

// ---------------------------------------------------------------------
// SALES TEAM (Section 5)
// ---------------------------------------------------------------------
export const team = [
  {
    id: 'u-founder',
    name: 'Ar. Ratan Agarwal',
    role: 'Founder',
    ismScore: 99,
    complianceRate: 100,
    callsToday: 4,
    avgSentiment: 'positive',
    conversionRate: 100,
    tier: 'Top Performer',
    incentiveEarned: 0,
    avatar: 'RA',
  },
  {
    id: 'u-1',
    name: 'Sneha Mohanty',
    role: 'Team Leader',
    ismScore: 88,
    complianceRate: 92,
    callsToday: 11,
    avgSentiment: 'positive',
    conversionRate: 9.2,
    tier: 'Top Performer',
    incentiveEarned: 42000,
    avatar: 'SM',
  },
  {
    id: 'u-2',
    name: 'Debashish Patnaik',
    role: 'Team Leader',
    ismScore: 81,
    complianceRate: 86,
    callsToday: 9,
    avgSentiment: 'positive',
    conversionRate: 7.4,
    tier: 'On Track',
    incentiveEarned: 31500,
    avatar: 'DP',
  },
  {
    id: 'u-3',
    name: 'Priyanka Sahoo',
    role: 'Sales Rep',
    ismScore: 74,
    complianceRate: 78,
    callsToday: 14,
    avgSentiment: 'neutral',
    conversionRate: 5.1,
    tier: 'On Track',
    incentiveEarned: 18200,
    avatar: 'PS',
  },
  {
    id: 'u-4',
    name: 'Rakesh Behera',
    role: 'Sales Rep',
    ismScore: 61,
    complianceRate: 64,
    callsToday: 16,
    avgSentiment: 'neutral',
    conversionRate: 3.8,
    tier: 'Needs Coaching',
    incentiveEarned: 8400,
    avatar: 'RB',
  },
  {
    id: 'u-5',
    name: 'Anjali Das',
    role: 'Telecaller',
    ismScore: 55,
    complianceRate: 58,
    callsToday: 22,
    avgSentiment: 'neutral',
    conversionRate: 3.1,
    tier: 'Needs Coaching',
    incentiveEarned: 5600,
    avatar: 'AD',
  },
  {
    id: 'u-6',
    name: 'Manoj Swain',
    role: 'Telecaller',
    ismScore: 48,
    complianceRate: 51,
    callsToday: 25,
    avgSentiment: 'negative',
    conversionRate: 2.4,
    tier: 'Needs Coaching',
    incentiveEarned: 3200,
    avatar: 'MS',
  },
]

export const teamAverageConversion = 4.0 // ≈ 25:1 lead-to-conversion ratio
export const founderConversion = 100

// ---------------------------------------------------------------------
// LEADS (~40) (Section 5)
// ---------------------------------------------------------------------
const firstNames = [
  'Aarav', 'Ananya', 'Subham', 'Ipsita', 'Soumya', 'Rohit', 'Lipsa', 'Bibhu',
  'Sasmita', 'Akash', 'Sanjana', 'Tapas', 'Madhusmita', 'Pratik', 'Jyoti',
  'Abinash', 'Snigdha', 'Rashmi', 'Chinmay', 'Ritika', 'Sourav', 'Pallavi',
  'Deepak', 'Arpita', 'Nibedita', 'Saswat', 'Trupti', 'Bikash', 'Smruti',
  'Aditya', 'Pragyan', 'Suchitra', 'Hrushikesh', 'Bhabani', 'Manish', 'Sweta',
  'Kunal', 'Monalisa', 'Rudra', 'Sangram',
]
const lastNames = [
  'Mohanty', 'Patnaik', 'Sahoo', 'Behera', 'Das', 'Swain', 'Pradhan', 'Nayak',
  'Mishra', 'Rout', 'Panda', 'Jena', 'Tripathy', 'Mahapatra', 'Dash',
]

const sources = ['LinkedIn', 'WhatsApp', 'Facebook']
const stages = ['Lead Gen', 'Follow-Up', 'Site Visit', 'No-Visit/Budget', 'Design Phase']
const budgets = ['₹8–12 L', '₹12–18 L', '₹18–25 L', '₹25–40 L', '₹40 L+']

// Deterministic pseudo-random so the demo is identical every run.
function seeded(i, salt = 1) {
  const x = Math.sin(i * 99.13 + salt * 17.77) * 10000
  return x - Math.floor(x)
}

function pick(arr, r) {
  return arr[Math.floor(r * arr.length) % arr.length]
}

function icpFor(score, source, r) {
  if (source === 'LinkedIn' && score >= 6.5) {
    const age = 25 + Math.floor(r * 8)
    return { tier: 'Hot', reason: `LinkedIn user · Semi-HNI · married couple ${age}` }
  }
  if (score >= 4.5) {
    return { tier: 'Warm', reason: 'Engaged · mid-budget · single contact' }
  }
  return { tier: 'Cold', reason: 'Low engagement · price-sensitive enquiry' }
}

export const leads = Array.from({ length: 40 }).map((_, idx) => {
  const i = idx + 1
  const r1 = seeded(i, 1)
  const r2 = seeded(i, 2)
  const r3 = seeded(i, 3)
  const r4 = seeded(i, 4)
  const r5 = seeded(i, 5)

  const name = `${pick(firstNames, seeded(i, 6))} ${pick(lastNames, seeded(i, 7))}`
  const source = pick(sources, r1)
  const interestScore = Math.round((1.5 + r2 * 8.3) * 10) / 10 // 1.5 – 9.8
  const icp = icpFor(interestScore, source, r3)
  const sentimentTrend =
    interestScore >= 6.5 ? 'positive' : interestScore >= 4 ? 'neutral' : 'negative'
  const stage = pick(stages, r4)
  const sitePaid = interestScore >= 5.5 && r5 > 0.35
  const routedTo = interestScore > 5 ? 'Senior Team' : 'Sales Rep'
  const assignedTo =
    routedTo === 'Senior Team'
      ? pick(['Sneha Mohanty', 'Debashish Patnaik'], r1)
      : pick(['Priyanka Sahoo', 'Rakesh Behera', 'Anjali Das', 'Manoj Swain'], r2)
  const lastCallDuration = Math.round(60 + r3 * 540) // 1–10 min
  const conversionProbability = Math.min(
    98,
    Math.round(interestScore * 9 + (sitePaid ? 12 : 0) + r4 * 6)
  )

  // Score-contribution breakdown (drives the Intent Scoring engine view).
  // Weighted blend of sentiment / duration / ₹500 signal / interest level.
  const sentimentPts = Math.round((sentimentTrend === 'positive' ? 3 : sentimentTrend === 'neutral' ? 1.8 : 0.7) * 10) / 10
  const durationPts = Math.round(Math.min(2.5, lastCallDuration / 240) * 10) / 10
  const paymentPts = sitePaid ? 2.2 : 0.3
  const interestPts = Math.max(0, Math.round((interestScore - sentimentPts - durationPts - paymentPts) * 10) / 10)

  return {
    id: `L-${1000 + i}`,
    name,
    source,
    icpTier: icp.tier,
    icpReason: icp.reason,
    interestScore,
    sentimentTrend,
    stage,
    sitePaid,
    budget: pick(budgets, r5),
    assignedTo,
    routedTo,
    lastCallDuration,
    conversionProbability,
    scoreBreakdown: {
      sentiment: sentimentPts,
      duration: durationPts,
      payment: paymentPts,
      interest: interestPts,
    },
    timeline: [
      { label: 'First touch', detail: `Inbound via ${source}`, sentiment: 'neutral' },
      { label: 'Qualification call', detail: `${Math.round(lastCallDuration / 60)} min · ${sentimentTrend}`, sentiment: sentimentTrend },
      sitePaid
        ? { label: '₹500 site-visit booked', detail: 'Strong commitment signal', sentiment: 'positive' }
        : { label: 'Budget discussion', detail: 'Price sensitivity flagged', sentiment: 'neutral' },
    ],
  }
})

// Derived counts for dashboards
export const leadStats = {
  total: leads.length,
  hot: leads.filter((l) => l.icpTier === 'Hot').length,
  warm: leads.filter((l) => l.icpTier === 'Warm').length,
  cold: leads.filter((l) => l.icpTier === 'Cold').length,
  avgScore:
    Math.round((leads.reduce((s, l) => s + l.interestScore, 0) / leads.length) * 10) / 10,
  seniorRouted: leads.filter((l) => l.routedTo === 'Senior Team').length,
  repRouted: leads.filter((l) => l.routedTo === 'Sales Rep').length,
  sitePaid: leads.filter((l) => l.sitePaid).length,
}

// ---------------------------------------------------------------------
// CHART DATA (Section 5)
// ---------------------------------------------------------------------
export const sentimentByDay = [
  { day: 'Mon', positive: 42, neutral: 31, negative: 14 },
  { day: 'Tue', positive: 48, neutral: 28, negative: 12 },
  { day: 'Wed', positive: 51, neutral: 26, negative: 16 },
  { day: 'Thu', positive: 46, neutral: 33, negative: 11 },
  { day: 'Fri', positive: 58, neutral: 24, negative: 9 },
  { day: 'Sat', positive: 63, neutral: 21, negative: 8 },
  { day: 'Sun', positive: 39, neutral: 18, negative: 6 },
]

export const todaySentiment = [
  { name: 'Positive', value: 58, color: '#16A34A' },
  { name: 'Neutral', value: 27, color: '#F59E0B' },
  { name: 'Negative', value: 15, color: '#DC2626' },
]

export const leadsBySource = [
  { name: 'LinkedIn', value: leads.filter((l) => l.source === 'LinkedIn').length, color: '#1E2761' },
  { name: 'WhatsApp', value: leads.filter((l) => l.source === 'WhatsApp').length, color: '#02C39A' },
  { name: 'Facebook', value: leads.filter((l) => l.source === 'Facebook').length, color: '#3B82F6' },
]

export const leadsByTier = [
  { name: 'Hot', value: leadStats.hot, color: '#DC2626' },
  { name: 'Warm', value: leadStats.warm, color: '#F59E0B' },
  { name: 'Cold', value: leadStats.cold, color: '#3B82F6' },
]

// Score-distribution histogram (buckets 0–10)
export const scoreHistogram = (() => {
  const buckets = Array.from({ length: 10 }).map((_, b) => ({
    bucket: `${b}-${b + 1}`,
    low: b,
    count: 0,
  }))
  leads.forEach((l) => {
    const b = Math.min(9, Math.floor(l.interestScore))
    buckets[b].count += 1
  })
  return buckets
})()

// ISM trend (for selected rep, improvement after coaching)
export const ismTrend = [
  { week: 'W1', 'Rakesh Behera': 44, 'Team Avg': 62, 'Best Performer': 86 },
  { week: 'W2', 'Rakesh Behera': 49, 'Team Avg': 63, 'Best Performer': 87 },
  { week: 'W3', 'Rakesh Behera': 53, 'Team Avg': 64, 'Best Performer': 88 },
  { week: 'W4', 'Rakesh Behera': 58, 'Team Avg': 66, 'Best Performer': 88 },
  { week: 'W5', 'Rakesh Behera': 61, 'Team Avg': 67, 'Best Performer': 89 },
]

export const ismBenchmark = team
  .filter((t) => t.role !== 'Founder')
  .map((t) => ({ name: t.name.split(' ')[0], ISM: t.ismScore }))

// ---------------------------------------------------------------------
// PITCH LIBRARY (Section 9 / component F)
// ---------------------------------------------------------------------
export const pitchLibrary = [
  {
    id: 'p1',
    trigger: 'Opening / rapport',
    phrase: 'Our in-house design team guarantees on-time delivery — that\'s our core USP.',
    usp: 'In-house team · on-time delivery',
    impact: '+0.5',
  },
  {
    id: 'p2',
    trigger: 'Price objection',
    phrase: 'Let me show you our flexible budget calculator so we tailor the scope to your range.',
    usp: 'Flexible budgeting · transparency',
    impact: '+0.6',
  },
  {
    id: 'p3',
    trigger: 'Quality concern',
    phrase: 'Every project is monitored on Dezylo so you get real-time progress visibility.',
    usp: 'Tech-enabled tracking',
    impact: '+0.4',
  },
  {
    id: 'p4',
    trigger: 'Closing / commitment',
    phrase: 'A refundable ₹500 site visit lets you experience our material quality first-hand.',
    usp: '₹500 site-visit signal',
    impact: '+0.7',
  },
  {
    id: 'p5',
    trigger: 'Upsell',
    phrase: 'For couples your age we often add a smart-home package — shall I include an estimate?',
    usp: 'Upsell · lifestyle fit',
    impact: '+0.3',
  },
]

// Recent guidance events (per-call log)
export const guidanceEvents = [
  { id: 'g1', rep: 'Priyanka Sahoo', lead: 'Soumya Das', phrase: 'In-house design team USP', used: true, delta: '+0.5' },
  { id: 'g2', rep: 'Rakesh Behera', lead: 'Tapas Jena', phrase: 'Flexible budget calculator', used: false, delta: '−0.0' },
  { id: 'g3', rep: 'Sneha Mohanty', lead: 'Ananya Mishra', phrase: '₹500 site-visit offer', used: true, delta: '+0.7' },
  { id: 'g4', rep: 'Manoj Swain', lead: 'Bikash Rout', phrase: 'Real-time Dezylo tracking', used: false, delta: '−0.0' },
  { id: 'g5', rep: 'Debashish Patnaik', lead: 'Ritika Panda', phrase: 'Smart-home upsell', used: true, delta: '+0.3' },
  { id: 'g6', rep: 'Priyanka Sahoo', lead: 'Aditya Nayak', phrase: 'On-time delivery guarantee', used: true, delta: '+0.5' },
]

// Escalation triggers (component F)
export const escalationRules = [
  'Rep repeatedly ignores AI recommendations',
  'Customer objection remains unresolved',
  'Premium / high-value (Hot ICP) opportunity at risk',
]

// ---------------------------------------------------------------------
// LIVE SALESPERSON TRACKING (Dashboard hero — fleet snapshot)
// Every rep on a call is monitored in real time. Consistent with
// otherCalls + team compliance numbers.
// ---------------------------------------------------------------------
export const liveTracking = [
  {
    rep: 'Priyanka Sahoo',
    avatar: 'PS',
    customer: 'Ananya & Subham Mishra',
    sentiment: 'positive',
    score: 6.4,
    compliance: 78,
    lastGuidance: 'green',
    duration: '06:20',
  },
  {
    rep: 'Debashish Patnaik',
    avatar: 'DP',
    customer: 'Rohit Pradhan',
    sentiment: 'positive',
    score: 6.8,
    compliance: 86,
    lastGuidance: 'green',
    duration: '07:12',
  },
  {
    rep: 'Manoj Swain',
    avatar: 'MS',
    customer: 'Sasmita Nayak',
    sentiment: 'negative',
    score: 3.1,
    compliance: 51,
    lastGuidance: 'red',
    duration: '02:48',
  },
]

// ---------------------------------------------------------------------
// INTERACTIVE PITCH-TRACKER DEMO (presenter-controlled, Section 8/9 · F)
// A click-through demo: for each recommended phrase the presenter marks
// whether the rep SPOKE it (GREEN, score +delta) or SKIPPED it (RED).
// Two+ skips trigger an escalation to the founder.
// ---------------------------------------------------------------------
export const pitchTrackerDemo = {
  customer: {
    name: 'Ananya & Subham Mishra',
    note: 'Hot ICP · LinkedIn · married couple, 28 · ₹18–25 L · 3BHK Bhubaneswar',
  },
  rep: { name: 'Priyanka Sahoo', avatar: 'PS', role: 'Sales Rep' },
  startScore: 4.0,
  escalateAfterMisses: 2,
  steps: [
    {
      id: 's1',
      cue: 'Call opens — build rapport & state the core USP.',
      trigger: 'Opening / rapport',
      phrase: 'Our in-house design team guarantees on-time delivery — that\'s our core USP.',
      usp: 'In-house team · on-time delivery',
      delta: 0.5,
    },
    {
      id: 's2',
      cue: 'Customer worried about price — handle the objection.',
      trigger: 'Price objection',
      phrase: 'Let me show you our flexible budget calculator so we tailor the scope to your range.',
      usp: 'Flexible budgeting · transparency',
      delta: 0.6,
    },
    {
      id: 's3',
      cue: 'Customer asks how they\'ll see progress — build trust.',
      trigger: 'Quality concern',
      phrase: 'Every project is monitored on Dezylo so you get real-time progress visibility.',
      usp: 'Tech-enabled tracking',
      delta: 0.4,
    },
    {
      id: 's4',
      cue: 'Buying signals rising — move to commitment.',
      trigger: 'Closing / commitment',
      phrase: 'A refundable ₹500 site visit lets you experience our material quality first-hand.',
      usp: '₹500 site-visit signal',
      delta: 0.7,
    },
    {
      id: 's5',
      cue: 'Good fit for an upsell — propose the add-on.',
      trigger: 'Upsell',
      phrase: 'For couples your age we often add a smart-home package — shall I include an estimate?',
      usp: 'Upsell · lifestyle fit',
      delta: 0.3,
    },
  ],
}

// ---------------------------------------------------------------------
// FOUNDER CONTROL LAYER (Section 11 / component H)
// ---------------------------------------------------------------------
export const founderControls = [
  {
    id: 'fc1',
    title: 'Pitch Structure',
    rule:
      'Open with the in-house design + on-time delivery USP. State 3 USPs before any price discussion. Always anchor value before number.',
    enforcedAcross: 9,
    active: true,
  },
  {
    id: 'fc2',
    title: 'Problem-Solving Logic',
    rule:
      'On any price objection → pivot to the flexible budget calculator and the refundable ₹500 site visit before negotiating discount.',
    enforcedAcross: 9,
    active: true,
  },
  {
    id: 'fc3',
    title: 'Upselling Strategy',
    rule:
      'For married couples 25–35 in the ₹18 L+ band, propose the smart-home + modular wardrobe package after design approval.',
    enforcedAcross: 9,
    active: true,
  },
]

export const expectedImpact = [
  { label: 'Productivity Gains', value: 30, suffix: '%', note: 'across sales, design & ops teams' },
  { label: 'Revenue Growth', value: 25, suffix: '%', note: 'via AI-driven insights & routing' },
]

// ---------------------------------------------------------------------
// LIVE CALL SIMULATION — scripted transcript (Section 8 ⭐)
// ---------------------------------------------------------------------
// Each turn advances the live cockpit on a timer. Fields:
//   speaker     : 'rep' | 'customer'
//   text        : the spoken line
//   sentiment   : 'positive' | 'neutral' | 'negative'  (drives the meter)
//   scoreDelta  : applied to the live Interest Score
//   guidance    : optional AI pitch-guidance event
//                 { type:'green'|'red'|'corrective', phrase, note }
//   escalation  : optional boolean -> fires escalation-to-founder flow
// The story: neutral start → price objection (negative + corrective) →
// rep uses recommended phrase (green, score rises) → rep misses one (red) →
// customer warms up (positive, score crosses 5 → routing flips) → escalation.
export const liveCall = {
  customer: {
    name: 'Ananya & Subham Mishra',
    icpTier: 'Hot',
    source: 'LinkedIn',
    budget: '₹18–25 L',
    stage: 'Site Visit',
    note: 'Married couple, 28 · Semi-HNI · 3BHK in Bhubaneswar',
  },
  rep: {
    name: 'Priyanka Sahoo',
    role: 'Sales Rep',
    complianceToday: 78,
  },
  startScore: 4.2,
  transcript: [
    {
      id: 1,
      speaker: 'rep',
      text: 'Good afternoon! Thank you for booking time with R Angle. How can we help design your new home?',
      sentiment: 'neutral',
      scoreDelta: 0,
    },
    {
      id: 2,
      speaker: 'customer',
      text: 'Hi, yes — we just moved into a 3BHK and want a full interior. But honestly we are still comparing a few firms.',
      sentiment: 'neutral',
      scoreDelta: 0.1,
    },
    {
      id: 3,
      speaker: 'rep',
      text: 'Absolutely understandable. Our in-house design team guarantees on-time delivery — that\'s our core USP.',
      sentiment: 'positive',
      scoreDelta: 0.5,
      guidance: {
        type: 'green',
        phrase: 'Our in-house design team guarantees on-time delivery — that\'s our core USP.',
        note: 'Recommended opening USP spoken correctly.',
      },
    },
    {
      id: 4,
      speaker: 'customer',
      text: 'That sounds good. What about cost though? We have heard full interiors can get very expensive.',
      sentiment: 'neutral',
      scoreDelta: 0,
    },
    {
      id: 5,
      speaker: 'customer',
      text: 'Frankly the last quote we got was way above our budget. I am a bit worried about the price.',
      sentiment: 'negative',
      scoreDelta: -0.6,
      guidance: {
        type: 'corrective',
        phrase: 'Let me show you our flexible budget calculator so we tailor the scope to your range.',
        note: 'Negative sentiment on price → surface budget-calculator response now.',
      },
    },
    {
      id: 6,
      speaker: 'rep',
      text: 'I completely understand. Let me show you our flexible budget calculator so we tailor the scope to your range.',
      sentiment: 'positive',
      scoreDelta: 0.6,
      guidance: {
        type: 'green',
        phrase: 'Let me show you our flexible budget calculator so we tailor the scope to your range.',
        note: 'Corrective phrase used — objection handled. Score +0.6.',
      },
    },
    {
      id: 7,
      speaker: 'customer',
      text: 'Oh nice, so we can control where the money goes. That feels much more comfortable.',
      sentiment: 'positive',
      scoreDelta: 0.5,
    },
    {
      id: 8,
      speaker: 'rep',
      text: 'Exactly. And our turnaround is quick, you will love the catalogue.',
      sentiment: 'neutral',
      scoreDelta: 0,
      guidance: {
        type: 'red',
        phrase: 'Every project is monitored on Dezylo so you get real-time progress visibility.',
        note: 'Suggested quality-assurance phrase NOT used — missed trust-builder.',
      },
    },
    {
      id: 9,
      speaker: 'customer',
      text: 'We really like that you have your own team. How do we actually see the work happening?',
      sentiment: 'neutral',
      scoreDelta: 0.2,
    },
    {
      id: 10,
      speaker: 'rep',
      text: 'Great question — every project is monitored on Dezylo so you get real-time progress visibility.',
      sentiment: 'positive',
      scoreDelta: 0.5,
      guidance: {
        type: 'green',
        phrase: 'Every project is monitored on Dezylo so you get real-time progress visibility.',
        note: 'Trust-builder recovered. Score +0.5.',
      },
    },
    {
      id: 11,
      speaker: 'customer',
      text: 'That is reassuring. We are getting genuinely interested now.',
      sentiment: 'positive',
      scoreDelta: 0.6,
    },
    {
      id: 12,
      speaker: 'rep',
      text: 'Wonderful! A refundable ₹500 site visit lets you experience our material quality first-hand.',
      sentiment: 'positive',
      scoreDelta: 0.7,
      guidance: {
        type: 'green',
        phrase: 'A refundable ₹500 site visit lets you experience our material quality first-hand.',
        note: 'Closing signal offered. ₹500 commitment trigger. Score +0.7.',
      },
    },
    {
      id: 13,
      speaker: 'customer',
      text: 'Yes! Let us book the site visit. And can you also tell us about smart-home options?',
      sentiment: 'positive',
      scoreDelta: 0.6,
    },
    {
      id: 14,
      speaker: 'customer',
      text: 'Actually — this is a fairly premium project for us, can a senior designer personally handle it?',
      sentiment: 'positive',
      scoreDelta: 0.4,
      escalation: true,
    },
    {
      id: 15,
      speaker: 'rep',
      text: 'Of course — given the scope I am bringing in our senior team so you get our very best.',
      sentiment: 'positive',
      scoreDelta: 0.3,
    },
  ],
}

// Other active calls (fleet-wide monitoring, Section 8.4)
export const otherCalls = [
  {
    id: 'c2',
    customer: 'Rohit Pradhan',
    rep: 'Debashish Patnaik',
    sentiment: 'positive',
    score: 6.8,
    duration: '07:12',
  },
  {
    id: 'c3',
    customer: 'Sasmita Nayak',
    rep: 'Manoj Swain',
    sentiment: 'negative',
    score: 3.1,
    duration: '02:48',
  },
]

// ---------------------------------------------------------------------
// DASHBOARD KPIs (Section 6)
// ---------------------------------------------------------------------
export const dashboardKpis = {
  activeLeads: leadStats.total,
  hotLeads: leadStats.hot,
  avgInterestScore: leadStats.avgScore,
  todayConversion: 6.2,
  activeLiveCalls: 3,
  escalationsToday: 2,
}

// Founder vs team gap (Section 6.3 / component B)
export const founderVsTeam = {
  founder: { label: 'Founder', value: 100, name: 'Ar. Ratan Agarwal' },
  team: { label: 'Sales Team', value: 4, ratio: '25 : 1' },
}
