'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

type Lang = 'english' | 'hindi'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  english: {
    logoSub: "India's Personalized AI Tool Finder",
    heroDesc: 'Tell us your situation. We find the exact tools that work for you — in your budget, on your device.',
    pills: ['🇮🇳 Made for India', '💸 Budget-aware', '🧠 Beginner-friendly'],
    cta: 'Find My Tools →',
    freeNote: 'Free • No signup required • 2 minutes',
    langTitle: 'Choose your language',
    langSub: 'All questions and results will appear in this language.',
    problemTitle: "What problem are you trying to solve?",
    problemSub: 'Write freely — the more you share, the better your results.',
    problemPlaceholder: "E.g. I want to start earning money online but don't know where to begin. I only have a phone and no budget...",
    problemNext: 'Next →',
    charsLeft: (n: number) => `${n} more characters needed`,
    goodToGo: '✓ Looking good!',
    multiNote: (max: number) => `Select up to ${max} options`,
    multiDone: (n: number, max: number) => `${n} of ${max} selected`,
    nextBtn: 'Continue →',
    loadingMsgs: [
      '🔍 Reading your profile...',
      '🧠 Thinking like an expert...',
      '🇮🇳 Checking what works in India...',
      '💡 Matching tools to your needs...',
      '⚡ Almost ready...',
    ],
    loadingSub: 'Sahi AI is working for you...',
    resultsTitle: 'Your Toolkit is Ready!',
    resultsSub: 'Personalized just for you 🎯',
    yourProblem: 'Your problem',
    firstStep: '👉 First step',
    match: '% match',
    whyForYou: '✨ Why this is perfect for YOU',
    feedQ: 'Was this helpful? 🙏',
    feedYes: '👍 Yes, very helpful!',
    feedNo: '👎 Not really',
    feedYesMsg: '🎉 Awesome! Share Sahi AI with your friends!',
    feedNoMsg: "🙏 Thank you! We'll keep improving.",
    startOver: '← Start over',
    back: '← Back',
    done: '% done',
  },
  hindi: {
    logoSub: 'भारत का पर्सनलाइज़्ड AI टूल फाइंडर',
    heroDesc: 'हमें अपनी स्थिति बताएं। हम आपके लिए सबसे सही टूल्स खोजेंगे — आपके बजट में, आपके डिवाइस पर।',
    pills: ['🇮🇳 भारत के लिए', '💸 बजट-अनुकूल', '🧠 शुरुआती के लिए'],
    cta: 'मेरे टूल्स खोजें →',
    freeNote: 'मुफ्त • कोई साइनअप नहीं • 2 मिनट',
    langTitle: 'अपनी भाषा चुनें',
    langSub: 'सभी सवाल और नतीजे इसी भाषा में आएंगे।',
    problemTitle: 'आप किस समस्या का हल ढूंढ रहे हैं?',
    problemSub: 'हिंदी या अंग्रेजी में लिखें — जितना बताएंगे, उतने बेहतर नतीजे।',
    problemPlaceholder: 'जैसे — मैं ऑनलाइन पैसे कमाना चाहता हूं पर समझ नहीं आता कहां से शुरू करूं...',
    problemNext: 'आगे बढ़ें →',
    charsLeft: (n: number) => `${n} और अक्षर चाहिए`,
    goodToGo: '✓ बढ़िया है!',
    multiNote: (max: number) => `${max} तक विकल्प चुनें`,
    multiDone: (n: number, max: number) => `${max} में से ${n} चुने`,
    nextBtn: 'आगे →',
    loadingMsgs: [
      '🔍 आपकी प्रोफाइल पढ़ रहे हैं...',
      '🧠 एक्सपर्ट की तरह सोच रहे हैं...',
      '🇮🇳 भारत में क्या काम करता है देख रहे हैं...',
      '💡 आपके लिए टूल्स मिला रहे हैं...',
      '⚡ लगभग तैयार...',
    ],
    loadingSub: 'Sahi AI आपके लिए काम कर रहा है...',
    resultsTitle: 'आपका टूलकिट तैयार है!',
    resultsSub: 'सिर्फ आपके लिए बनाया गया 🎯',
    yourProblem: 'आपकी समस्या',
    firstStep: '👉 पहला कदम',
    match: '% मिलान',
    whyForYou: '✨ आपके लिए क्यों सही है',
    feedQ: 'क्या यह मददगार रहा? 🙏',
    feedYes: '👍 हां, बहुत मददगार!',
    feedNo: '👎 ज़्यादा नहीं',
    feedYesMsg: '🎉 बहुत बढ़िया! दोस्तों के साथ शेयर करें!',
    feedNoMsg: '🙏 शुक्रिया! हम और बेहतर बनाते रहेंगे।',
    startOver: '← फिर से शुरू करें',
    back: '← वापस',
    done: '% पूरा',
  },
}

// ── QUESTIONS ─────────────────────────────────────────────────────────────────
const getQuestions = (lang: Lang) => [
  {
    id: 'who', emoji: '👤', type: 'single' as const,
    question: lang === 'hindi' ? 'आप कौन हैं?' : 'Who are you?',
    subtitle: lang === 'hindi' ? 'जो सबसे सही लगे वो चुनें।' : 'Pick the one that fits you best.',
    options: lang === 'hindi' ? [
      { label: '🎒 स्कूल स्टूडेंट', sub: 'कक्षा 8–12' },
      { label: '🎓 कॉलेज स्टूडेंट', sub: 'यूनिवर्सिटी या डिप्लोमा' },
      { label: '💼 नौकरीपेशा', sub: 'जॉब करता/करती हूं' },
      { label: '🏪 बिज़नेस/दुकान मालिक', sub: 'छोटा बिज़नेस चलाता/चलाती हूं' },
      { label: '📱 कंटेंट क्रिएटर', sub: 'Reels, YouTube, ब्लॉग' },
      { label: '🏠 गृहिणी', sub: 'घर से कमाना या सीखना चाहती हूं' },
      { label: '🔍 नौकरी ढूंढ रहा/रही हूं', sub: 'फ्रेशर या करियर बदलना' },
      { label: '🚀 स्टार्टअप फाउंडर', sub: 'कुछ नया बना रहा/रही हूं' },
      { label: '💻 फ्रीलांसर', sub: 'साइड हसल या फ्रीलांस काम' },
    ] : [
      { label: '🎒 School Student', sub: 'Class 8–12, boards or exams' },
      { label: '🎓 College Student', sub: 'University or diploma' },
      { label: '💼 Working Professional', sub: 'Job holder, want to grow' },
      { label: '🏪 Business / Shop Owner', sub: 'Running a small business' },
      { label: '📱 Content Creator', sub: 'Reels, YouTube, blogs' },
      { label: '🏠 Homemaker', sub: 'Want to earn or learn from home' },
      { label: '🔍 Job Seeker / Fresher', sub: 'First job or career switch' },
      { label: '🚀 Startup Founder', sub: 'Building something new' },
      { label: '💻 Freelancer', sub: 'Side hustle or full-time freelance' },
    ],
  },
  {
    id: 'goal', emoji: '🎯', type: 'multi' as const, maxSelect: 3,
    question: lang === 'hindi' ? 'आप क्या हासिल करना चाहते हैं?' : 'What do you want to achieve?',
    subtitle: lang === 'hindi' ? '3 तक चुनें।' : 'Pick up to 3.',
    options: lang === 'hindi' ? [
      { label: '📚 स्मार्ट तरीके से पढ़ना', sub: 'बेहतर नोट्स, ज़्यादा नंबर' },
      { label: '💰 ऑनलाइन पैसे कमाना', sub: 'पहली कमाई या साइड इनकम' },
      { label: '🎨 वायरल कंटेंट बनाना', sub: 'Reels, वीडियो, पोस्ट' },
      { label: '📈 बिज़नेस बढ़ाना', sub: 'ज़्यादा कस्टमर, ज़्यादा बिक्री' },
      { label: '⚡ ज़्यादा ऑर्गेनाइज़्ड बनना', sub: 'समय बचाना, बेहतर प्लानिंग' },
      { label: '🛠️ नई स्किल सीखना', sub: 'जॉब या करियर के लिए' },
      { label: '🤖 AI टूल्स समझना', sub: 'AI क्या कर सकता है' },
      { label: '📊 रिसर्च या रिपोर्ट बनाना', sub: 'प्रोजेक्ट, एनालिसिस' },
    ] : [
      { label: '📚 Study smarter', sub: 'Better notes, higher marks' },
      { label: '💰 Start earning online', sub: 'First income or side hustle' },
      { label: '🎨 Create viral content', sub: 'Reels, videos, posts' },
      { label: '📈 Grow my business', sub: 'More customers, more sales' },
      { label: '⚡ Get more organized', sub: 'Save time, plan better' },
      { label: '🛠️ Learn a new skill', sub: 'Upskill for job or career' },
      { label: '🤖 Understand AI tools', sub: 'Know what AI can do' },
      { label: '📊 Research or make a report', sub: 'Projects, analysis' },
    ],
  },
  {
    id: 'struggle', emoji: '😤', type: 'multi' as const, maxSelect: 2,
    question: lang === 'hindi' ? 'सबसे बड़ी दिक्कत क्या है?' : "What's holding you back?",
    subtitle: lang === 'hindi' ? 'जो सबसे ज़्यादा लागू हो — 2 तक।' : 'Pick the biggest ones — up to 2.',
    options: lang === 'hindi' ? [
      { label: '😵 कहां से शुरू करूं पता नहीं', sub: 'बहुत सारे ऑप्शन, भ्रम होता है' },
      { label: '💸 अच्छे टूल्स महंगे हैं', sub: 'फ्री या सस्ता चाहिए' },
      { label: '📵 सिर्फ फोन है', sub: 'मोबाइल पर काम करना होगा' },
      { label: '🕐 समय नहीं है', sub: 'कुछ तेज़ और आसान चाहिए' },
      { label: '🌐 अंग्रेज़ी में दिक्कत', sub: 'हिंदी में टूल चाहिए' },
      { label: '😕 कोशिश करके छोड़ देता/देती हूं', sub: 'टूल्स जटिल लगते हैं' },
      { label: '📶 इंटरनेट धीमा है', sub: 'हल्के टूल्स चाहिए' },
      { label: '🔒 ऑनलाइन टूल्स पर भरोसा नहीं', sub: 'प्राइवेसी की चिंता है' },
    ] : [
      { label: "😵 Don't know where to start", sub: 'Too many options, feels overwhelming' },
      { label: '💸 Good tools cost too much', sub: 'Need free or cheap options' },
      { label: '📵 I only have a phone', sub: 'No laptop, must work on mobile' },
      { label: '🕐 I have no time', sub: 'Need something fast and simple' },
      { label: '🌐 English is a barrier', sub: 'Need Hindi-friendly tools' },
      { label: '😕 I try but give up', sub: 'Tools feel too complicated' },
      { label: '📶 Slow internet', sub: 'Need lightweight tools on 4G' },
      { label: "🔒 Don't trust online tools", sub: 'Worried about privacy' },
    ],
  },
  {
    id: 'device', emoji: '📱', type: 'single' as const,
    question: lang === 'hindi' ? 'कौन सा डिवाइस इस्तेमाल करते हैं?' : 'What device do you mainly use?',
    subtitle: lang === 'hindi' ? 'हम सिर्फ वही सुझाएंगे जो आपके डिवाइस पर चले।' : "We'll only show tools that work on your device.",
    options: lang === 'hindi' ? [
      { label: '📱 सिर्फ Android फोन', sub: 'सब कुछ स्मार्टफोन से' },
      { label: '🍎 सिर्फ iPhone', sub: 'iOS ऐप्स और ब्राउज़र' },
      { label: '💻 सिर्फ लैपटॉप या PC', sub: 'Windows, Mac या Linux' },
      { label: '📱💻 फोन और लैपटॉप दोनों', sub: 'दोनों डिवाइस इस्तेमाल करता/करती हूं' },
    ] : [
      { label: '📱 Android phone only', sub: 'Everything through smartphone' },
      { label: '🍎 iPhone only', sub: 'iOS apps and browser' },
      { label: '💻 Laptop or PC only', sub: 'Windows, Mac, or Linux' },
      { label: '📱💻 Both phone and laptop', sub: 'I switch between devices' },
    ],
  },
  {
    id: 'budget', emoji: '💰', type: 'single' as const,
    question: lang === 'hindi' ? 'टूल्स के लिए महीने का बजट?' : "Monthly budget for tools?",
    subtitle: lang === 'hindi' ? 'सच बताएं — हम आपके बजट का पूरा सम्मान करेंगे।' : "Be honest — we'll fully respect your budget.",
    options: lang === 'hindi' ? [
      { label: '🆓 ₹0 — बिल्कुल मुफ्त', sub: 'अभी कुछ खर्च नहीं कर सकता/सकती' },
      { label: '🪙 ₹200 तक', sub: 'बहुत कम बजट' },
      { label: '💵 ₹200 – ₹500', sub: 'एक अच्छे टूल के लिए ठीक है' },
      { label: '💳 ₹500 – ₹2,000', sub: 'सही टूल के लिए इन्वेस्ट करने को तैयार' },
      { label: '🚀 ₹2,000+', sub: 'बजट मुख्य चिंता नहीं' },
    ] : [
      { label: '🆓 ₹0 — Free only', sub: 'Cannot spend anything right now' },
      { label: '🪙 Up to ₹200', sub: 'Very limited, essentials only' },
      { label: '💵 ₹200 – ₹500', sub: 'Small budget, okay for one good tool' },
      { label: '💳 ₹500 – ₹2,000', sub: 'Willing to invest for the right tool' },
      { label: '🚀 ₹2,000+', sub: 'Budget is not the main concern' },
    ],
  },
  {
    id: 'skill', emoji: '🧠', type: 'single' as const,
    question: lang === 'hindi' ? 'टेक्नोलॉजी में कितने सहज हैं?' : 'How comfortable are you with technology?',
    subtitle: lang === 'hindi' ? 'कोई जज नहीं करेगा — सही टूल चुनने के लिए पूछ रहे हैं।' : 'No judgment — just helps us pick the right tools.',
    options: lang === 'hindi' ? [
      { label: '😅 बिल्कुल शुरुआती', sub: 'जल्दी कंफ्यूज़ हो जाता/जाती हूं' },
      { label: '🙂 निर्देश फॉलो कर सकता/सकती हूं', sub: 'समझाया जाए तो कर लेता/लेती हूं' },
      { label: '😎 इंटरमीडिएट', sub: 'ज़्यादातर चीज़ें खुद सीख लेता/लेती हूं' },
      { label: '🔥 एडवांस्ड', sub: 'टूल्स और ऐप्स में माहिर हूं' },
    ] : [
      { label: '😅 Total beginner', sub: 'I get confused easily' },
      { label: '🙂 Can follow instructions', sub: 'If explained clearly, I can manage' },
      { label: '😎 Intermediate', sub: 'I figure most things out myself' },
      { label: '🔥 Advanced / Tech-savvy', sub: 'I know my way around apps' },
    ],
  },
]

// ── BADGE + DIFFICULTY ────────────────────────────────────────────────────────
const BADGES: Record<string, { bg: string; text: string; border: string }> = {
  'Best for You':            { bg: '#1e0a4a', text: '#c084fc', border: '#7c3aed' },
  'Best Free Option':        { bg: '#052e16', text: '#4ade80', border: '#16a34a' },
  'Most Popular in India':   { bg: '#1c1003', text: '#fbbf24', border: '#d97706' },
  'Custom Pick':             { bg: '#2d0a1e', text: '#f472b6', border: '#db2777' },
  'आपके लिए सबसे अच्छा':     { bg: '#1e0a4a', text: '#c084fc', border: '#7c3aed' },
  'सबसे अच्छा मुफ्त विकल्प':  { bg: '#052e16', text: '#4ade80', border: '#16a34a' },
  'भारत में सबसे लोकप्रिय':   { bg: '#1c1003', text: '#fbbf24', border: '#d97706' },
  'कस्टम पिक':                { bg: '#2d0a1e', text: '#f472b6', border: '#db2777' },
}
const DIFF: Record<string, string> = {
  Easy: '#4ade80', Medium: '#fbbf24', Hard: '#f87171',
  आसान: '#4ade80', मध्यम: '#fbbf24', कठिन: '#f87171',
}

type Rec = {
  type: string; tool: string; tagline?: string
  reason: string; detailedReason: string
  price: string; difficulty: string; confidence: number; firstStep: string
}
type Screen = 'welcome' | 'lang' | 'problem' | 'questions' | 'loading' | 'results'

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function Home() {
  const [screen, setScreen]         = useState<Screen>('welcome')
  const [lang, setLang]             = useState<Lang>('english')
  const [problem, setProblem]       = useState('')
  const [step, setStep]             = useState(0)
  const [answers, setAnswers]       = useState<Record<string, string | string[]>>({})
  const [multiSel, setMultiSel]     = useState<string[]>([])
  const [loadIdx, setLoadIdx]       = useState(0)
  const [results, setResults]       = useState<Rec[] | null>(null)
  const [error, setError]           = useState('')
  const [feedback, setFeedback]     = useState<null | 'yes' | 'no'>(null)
  const [selected, setSelected]     = useState<string | null>(null)
  const [mounted, setMounted]       = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const tx = T[lang]
  const qs = getQuestions(lang)
  const current = qs[step]

  const chooseLang = (l: Lang) => { setLang(l); setScreen('problem') }

  const toggleMulti = useCallback((label: string) => {
    const max = (current as any).maxSelect || 3
    setMultiSel(prev =>
      prev.includes(label)
        ? prev.filter(x => x !== label)
        : prev.length < max ? [...prev, label] : prev
    )
  }, [current])

  const advance = useCallback(async (value: string | string[]) => {
    const updated = { ...answers, [current.id]: value }
    setAnswers(updated)
    setMultiSel([])
    setSelected(null)

    if (step + 1 < qs.length) {
      setStep(s => s + 1)
      return
    }

    // All questions done — call API
    setScreen('loading')
    let i = 0
    const iv = setInterval(() => {
      i = (i + 1) % tx.loadingMsgs.length
      setLoadIdx(i)
    }, 1400)

    try {
      const res = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      {
        role: "user",
        content: `User problem: ${problem}
Answers: ${JSON.stringify(updated)}
Language: ${lang}`
      }
    ]
  }),
})
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      clearInterval(iv)

      // Save to Supabase if logged in
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase.from('recommendations').insert({
            user_id: user.id, problem, answers: updated, results: data.recommendations,
          })
          await supabase.from('profiles').update({
            who: updated.who, device: updated.device, budget: updated.budget,
            skill: updated.skill, language: lang,
            goals: Array.isArray(updated.goal) ? updated.goal : [updated.goal],
            struggles: Array.isArray(updated.struggle) ? updated.struggle : [updated.struggle],
          }).eq('id', user.id)
        }
      } catch { /* silent — saving is optional */ }

      setResults(data.recommendations)
      setScreen('results')
    } catch (e) {
      clearInterval(iv)
      setError('Something went wrong. Please try again.')
      setScreen('questions')
    }
  }, [answers, current, step, qs.length, lang, problem, tx.loadingMsgs.length])

  const handleSingle = useCallback((label: string) => {
    setSelected(label)
    setTimeout(() => advance(label), 260)
  }, [advance])

  const goBack = useCallback(() => {
    setMultiSel([]); setSelected([null] as any)
    if (step === 0) setScreen('problem')
    else setStep(s => s - 1)
  }, [step])

  const restart = useCallback(() => {
    setScreen('welcome'); setLang('english'); setProblem('')
    setStep(0); setAnswers({}); setMultiSel([])
    setResults(null); setError(''); setFeedback(null); setSelected(null)
  }, [])

  if (!mounted) return null

  // ── WELCOME ───────────────────────────────────────────────────────────────
  if (screen === 'welcome') return (
    <main style={S.page}><style>{G}</style>
      <div style={S.center}>
        <div style={S.logoMark}>सही AI</div>
        <h1 style={S.heroTitle}>Sahi AI</h1>
        <p style={S.heroSub}>{tx.logoSub}</p>
        <p style={S.heroDesc}>{tx.heroDesc}</p>
        <div style={S.pillRow}>
          {tx.pills.map(p => (
            <div key={p} style={S.pill}><span style={{ fontSize: 12, color: '#a78bfa' }}>{p}</span></div>
          ))}
        </div>
        <button style={S.cta} className="cta-btn" onClick={() => setScreen('lang')}>{tx.cta}</button>
        <p style={{ fontSize: 11, color: '#4b3f72', marginTop: 14 }}>{tx.freeNote}</p>
      </div>
    </main>
  )

  // ── LANGUAGE ──────────────────────────────────────────────────────────────
  if (screen === 'lang') return (
    <main style={S.page}><style>{G}</style>
      <div style={S.form}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={S.logoMark}>सही AI</div>
          <h2 style={S.qTitle}>
            Choose your language
            <br /><span style={{ fontSize: 20, color: '#7c6fa0' }}>/ अपनी भाषा चुनें</span>
          </h2>
          <p style={S.qSub}>Your entire experience will be in this language.<br />/ आपका पूरा अनुभव इसी भाषा में होगा।</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {([
            { lang: 'english' as Lang, label: '🇬🇧 English', sub: 'Questions and results in English' },
            { lang: 'hindi' as Lang, label: '🇮🇳 हिंदी', sub: 'सभी सवाल और नतीजे हिंदी में' },
          ]).map(opt => (
            <button key={opt.lang} onClick={() => chooseLang(opt.lang)}
              style={{ ...S.optBtn, padding: '20px 22px' }} className="option-btn">
              <span style={{ fontSize: 18, fontWeight: 700, color: '#f5f3ff', display: 'block', marginBottom: 4 }}>{opt.label}</span>
              <span style={{ fontSize: 13, color: '#6b5fa0', display: 'block' }}>{opt.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  )

  // ── PROBLEM ───────────────────────────────────────────────────────────────
  if (screen === 'problem') return (
    <main style={S.page}><style>{G}</style>
      <div style={S.form}>
        <button style={S.backBtn} className="back-btn" onClick={() => setScreen('lang')}>{tx.back}</button>
        <div style={{ textAlign: 'center', margin: '20px 0 8px' }}><span style={{ fontSize: 36 }}>💬</span></div>
        <h2 style={S.qTitle}>{tx.problemTitle}</h2>
        <p style={S.qSub}>{tx.problemSub}</p>
        <textarea
          value={problem}
          onChange={e => setProblem(e.target.value)}
          placeholder={tx.problemPlaceholder}
          style={S.textarea}
          className="sahi-textarea"
          rows={5}
        />
        <p style={{ fontSize: 12, color: problem.trim().length > 10 ? '#4ade80' : '#4b3f72', marginBottom: 24 }}>
          {problem.trim().length > 10 ? tx.goodToGo : tx.charsLeft(Math.max(0, 10 - problem.trim().length))}
        </p>
        <button
          style={{ ...S.cta, width: '100%', opacity: problem.trim().length > 10 ? 1 : 0.4, cursor: problem.trim().length > 10 ? 'pointer' : 'not-allowed' }}
          className={problem.trim().length > 10 ? 'cta-btn' : ''}
          onClick={() => problem.trim().length > 10 && setScreen('questions')}>
          {tx.problemNext}
        </button>
      </div>
    </main>
  )

  // ── LOADING ───────────────────────────────────────────────────────────────
  if (screen === 'loading') return (
    <main style={S.page}><style>{G}</style>
      <div style={{ textAlign: 'center' }}>
        <div style={S.orb} className="pulse-orb" />
        <p style={{ ...S.heroTitle, fontSize: 20, marginTop: 32 }}>{tx.loadingMsgs[loadIdx]}</p>
        <p style={{ color: '#4b3f72', fontSize: 13, marginTop: 8 }}>{tx.loadingSub}</p>
      </div>
    </main>
  )

  // ── RESULTS ───────────────────────────────────────────────────────────────
  if (screen === 'results' && results) return (
    <main style={{ ...S.page, alignItems: 'flex-start', padding: '48px 16px' }}><style>{G}</style>
      <div style={S.resultsWrap}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={S.logoMark}>सही AI</div>
          <h1 style={{ ...S.heroTitle, fontSize: 28 }}>{tx.resultsTitle}</h1>
          <p style={{ color: '#7c6fa0', fontSize: 14 }}>{tx.resultsSub}</p>
        </div>

        {/* Problem recap */}
        <div style={S.problemCard}>
          <p style={{ fontSize: 11, color: '#4b3f72', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>{tx.yourProblem}</p>
          <p style={{ fontSize: 14, color: '#c4b5fd', fontStyle: 'italic', lineHeight: 1.6 }}>"{problem}"</p>
        </div>

        {/* Profile tags */}
        <div style={S.tagRow}>
          {Object.values(answers).flat().map((val, i) => (
            <span key={i} style={S.tag}>{val as string}</span>
          ))}
        </div>

        {/* Result cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {results.map((rec, i) => {
            const badge = BADGES[rec.type] || { bg: '#1a1035', text: '#c084fc', border: '#7c3aed' }
            return (
              <div key={i} style={{ ...S.card, borderColor: i === 0 ? '#7c3aed' : '#2a1f4a' }} className="result-card">

                {/* Badge + difficulty */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 100, background: badge.bg, color: badge.text, border: `1px solid ${badge.border}` }}>
                    {rec.type}
                  </span>
                  <span style={{ fontSize: 12, color: DIFF[rec.difficulty] || '#a78bfa', fontWeight: 600 }}>
                    {rec.difficulty}
                  </span>
                </div>

                {/* Tool name + confidence */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f5f3ff', fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2 }}>
                    {rec.tool}
                  </h2>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24', whiteSpace: 'nowrap', marginLeft: 10 }}>
                    {rec.confidence}{tx.match}
                  </span>
                </div>

                {/* Tagline */}
                {rec.tagline && (
                  <p style={{ fontSize: 13, color: '#fbbf24', marginBottom: 10, fontStyle: 'italic' }}>"{rec.tagline}"</p>
                )}

                {/* Confidence bar */}
                <div style={S.track}>
                  <div style={{ ...S.bar, width: `${rec.confidence}%` }} />
                </div>

                {/* Why for YOU */}
                <div style={{ background: '#1a0e3a', border: '1px solid #2d1b69', borderRadius: 12, padding: '12px 14px', margin: '14px 0' }}>
                  <p style={{ fontSize: 11, color: '#7c3aed', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                    {tx.whyForYou}
                  </p>
                  <p style={{ fontSize: 14, color: '#c4b5fd', lineHeight: 1.7 }}>{rec.reason}</p>
                  {rec.detailedReason && (
                    <p style={{ fontSize: 13, color: '#6b5fa0', lineHeight: 1.7, marginTop: 6, paddingTop: 8, borderTop: '1px solid #2d1b69' }}>
                      {rec.detailedReason}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div style={{ marginBottom: 14 }}>
                  <span style={{ ...S.tag, color: '#a78bfa', borderColor: '#3b1f8a' }}>{rec.price}</span>
                </div>

                {/* First step */}
                <div style={S.stepBox}>
                  <p style={{ fontSize: 11, color: '#fbbf24', marginBottom: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {tx.firstStep}
                  </p>
                  <p style={{ fontSize: 13, color: '#e2d9f3', lineHeight: 1.6 }}>{rec.firstStep}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Feedback */}
        {!feedback ? (
          <div style={S.fbBox}>
            <p style={{ fontSize: 14, color: '#a78bfa', marginBottom: 16, textAlign: 'center' }}>{tx.feedQ}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button style={S.fbYes} className="feed-btn" onClick={() => setFeedback('yes')}>{tx.feedYes}</button>
              <button style={S.fbNo} className="feed-btn" onClick={() => setFeedback('no')}>{tx.feedNo}</button>
            </div>
          </div>
        ) : (
          <div style={S.fbBox}>
            <p style={{ textAlign: 'center', fontSize: 14, color: feedback === 'yes' ? '#4ade80' : '#fbbf24' }}>
              {feedback === 'yes' ? tx.feedYesMsg : tx.feedNoMsg}
            </p>
          </div>
        )}

        <button style={S.restart} className="restart-btn" onClick={restart}>{tx.startOver}</button>
      </div>
    </main>
  )

  // ── QUESTIONS ─────────────────────────────────────────────────────────────
  const progress = (step / qs.length) * 100
  const isMulti = current.type === 'multi'
  const maxSel = (current as any).maxSelect || 3

  return (
    <main style={S.page}><style>{G}</style>
      <div style={S.form}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <button style={S.backBtn} className="back-btn" onClick={goBack}>{tx.back}</button>
          <span style={{ fontSize: 12, color: '#4b3f72' }}>{Math.round(progress)}{tx.done}</span>
        </div>

        {/* Progress bar */}
        <div style={S.track}>
          <div style={{ ...S.bar, width: `${progress}%`, transition: 'width 0.5s ease' }} />
        </div>

        {/* Step badge */}
        <div style={{ margin: '16px 0 4px' }}>
          <div style={S.stepBadge}>
            {lang === 'hindi' ? `सवाल ${step + 1} / ${qs.length}` : `Question ${step + 1} of ${qs.length}`}
          </div>
        </div>

        {/* Question */}
        <div style={{ textAlign: 'center', margin: '14px 0 6px' }}>
          <span style={{ fontSize: 36 }}>{current.emoji}</span>
        </div>
        <h2 style={S.qTitle}>{current.question}</h2>
        <p style={S.qSub}>{current.subtitle}</p>

        {/* Multi-select note */}
        {isMulti && (
          <div style={S.multiNote}>
            <span style={{ fontSize: 13 }}>
              {multiSel.length === 0 ? tx.multiNote(maxSel) : tx.multiDone(multiSel.length, maxSel)}
            </span>
            <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
              {Array.from({ length: maxSel }).map((_, i) => (
                <div key={i} style={{ width: 28, height: 4, borderRadius: 100, background: i < multiSel.length ? '#7c3aed' : '#2a1f4a', transition: 'background 0.2s' }} />
              ))}
            </div>
          </div>
        )}

        {error && <p style={{ color: '#f87171', fontSize: 13, marginBottom: 12 }}>{error}</p>}

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {current.options.map(option => {
            const isChosen = isMulti ? multiSel.includes(option.label) : selected === option.label
            const isDisabled = isMulti && !isChosen && multiSel.length >= maxSel
            return (
              <button
                key={option.label}
                onClick={() => isMulti ? toggleMulti(option.label) : handleSingle(option.label)}
                disabled={isDisabled}
                style={{
                  ...S.optBtn,
                  borderColor: isChosen ? '#7c3aed' : '#2a1f4a',
                  background: isChosen ? '#2d1b69' : '#130d2e',
                  opacity: isDisabled ? 0.35 : 1,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                }}
                className={isDisabled ? '' : 'option-btn'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#e2d9f3', display: 'block' }}>{option.label}</span>
                    <span style={{ fontSize: 12, color: '#6b5fa0', marginTop: 2, display: 'block' }}>{option.sub}</span>
                  </div>
                  {isMulti && (
                    <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${isChosen ? '#7c3aed' : '#2a1f4a'}`, background: isChosen ? '#7c3aed' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 12, transition: 'all 0.2s' }}>
                      {isChosen && <span style={{ fontSize: 12, color: '#fff', lineHeight: 1 }}>✓</span>}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Multi next button */}
        {isMulti && (
          <button
            onClick={() => multiSel.length > 0 && advance(multiSel)}
            disabled={multiSel.length === 0}
            style={{ ...S.cta, width: '100%', marginTop: 16, opacity: multiSel.length > 0 ? 1 : 0.3, cursor: multiSel.length > 0 ? 'pointer' : 'not-allowed' }}
            className={multiSel.length > 0 ? 'cta-btn' : ''}>
            {tx.nextBtn}{multiSel.length > 0 ? ` (${multiSel.length} selected)` : ''}
          </button>
        )}
      </div>
    </main>
  )
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  page:        { minHeight: '100vh', background: 'radial-gradient(ellipse at 20% 20%, #1e0a4a 0%, #0a0618 50%, #0d0520 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", padding: '32px 16px', color: '#e2d9f3' },
  center:      { maxWidth: 480, width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  logoMark:    { fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#7c3aed', textTransform: 'uppercase', marginBottom: 12 },
  heroTitle:   { fontSize: 52, fontWeight: 700, fontFamily: "'Cormorant Garamond', serif", background: 'linear-gradient(135deg, #c084fc 0%, #fbbf24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 8, lineHeight: 1.1 },
  heroSub:     { fontSize: 15, color: '#7c6fa0', marginBottom: 14, letterSpacing: 0.4 },
  heroDesc:    { fontSize: 14, color: '#9d8ec4', lineHeight: 1.8, marginBottom: 28, maxWidth: 380 },
  pillRow:     { display: 'flex', flexWrap: 'wrap' as const, gap: 8, justifyContent: 'center', marginBottom: 32 },
  pill:        { display: 'flex', alignItems: 'center', gap: 6, background: '#1a0e3a', border: '1px solid #2a1f4a', borderRadius: 100, padding: '6px 14px' },
  cta:         { background: 'linear-gradient(135deg, #7c3aed 0%, #d97706 100%)', color: '#fff', border: 'none', borderRadius: 14, padding: '15px 30px', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.3, transition: 'all 0.2s' },
  form:        { maxWidth: 520, width: '100%' },
  backBtn:     { background: 'transparent', border: 'none', color: '#4b3f72', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", padding: '4px 0', transition: 'color 0.2s' },
  stepBadge:   { display: 'inline-block', fontSize: 12, color: '#7c3aed', background: '#1e0a4a', border: '1px solid #3b1f8a', borderRadius: 100, padding: '4px 12px', fontWeight: 600 },
  qTitle:      { fontSize: 22, fontWeight: 700, fontFamily: "'Cormorant Garamond', serif", color: '#f5f3ff', marginBottom: 8, lineHeight: 1.4, textAlign: 'center' },
  qSub:        { fontSize: 13, color: '#6b5fa0', marginBottom: 16, textAlign: 'center', lineHeight: 1.6 },
  multiNote:   { background: '#1a0e3a', border: '1px solid #3b1f8a', borderRadius: 12, padding: '10px 14px', marginBottom: 16, textAlign: 'center' as const, color: '#a78bfa', display: 'flex', flexDirection: 'column' as const, alignItems: 'center' },
  textarea:    { width: '100%', background: '#130d2e', border: '1px solid #2a1f4a', borderRadius: 14, padding: '14px', fontSize: 14, color: '#e2d9f3', fontFamily: "'DM Sans', sans-serif", outline: 'none', lineHeight: 1.7, resize: 'none' as const, boxSizing: 'border-box' as const, marginBottom: 8 },
  optBtn:      { width: '100%', textAlign: 'left' as const, padding: '14px 16px', borderRadius: 14, border: '1px solid #2a1f4a', background: '#130d2e', cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" },
  track:       { width: '100%', height: 3, background: '#1a1035', borderRadius: 100, overflow: 'hidden', marginBottom: 8 },
  bar:         { height: '100%', background: 'linear-gradient(90deg, #7c3aed, #fbbf24)', borderRadius: 100 },
  orb:         { width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #fbbf24)', margin: '0 auto' },
  resultsWrap: { maxWidth: 580, width: '100%', margin: '0 auto' },
  problemCard: { background: '#130d2e', border: '1px solid #2a1f4a', borderRadius: 14, padding: '14px 18px', marginBottom: 18 },
  tagRow:      { display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 24 },
  tag:         { fontSize: 12, padding: '4px 12px', background: '#1a1035', border: '1px solid #2a1f4a', borderRadius: 100, color: '#7c6fa0' },
  card:        { background: '#130d2e', border: '1px solid #2a1f4a', borderRadius: 18, padding: '22px', transition: 'border-color 0.2s' },
  stepBox:     { background: '#0d0520', border: '1px solid #2a1f4a', borderRadius: 12, padding: '12px 14px' },
  fbBox:       { marginTop: 24, background: '#130d2e', border: '1px solid #2a1f4a', borderRadius: 14, padding: '18px 22px' },
  fbYes:       { padding: '10px 18px', borderRadius: 12, border: '1px solid #16a34a', background: '#052e16', color: '#4ade80', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' },
  fbNo:        { padding: '10px 18px', borderRadius: 12, border: '1px solid #9f1239', background: '#2d0a1e', color: '#f472b6', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' },
  restart:     { marginTop: 14, width: '100%', padding: '13px', borderRadius: 14, border: '1px solid #2a1f4a', background: 'transparent', color: '#4b3f72', fontSize: 14, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' },
}

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;600;700&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0a0618; }
  .cta-btn:hover { transform: scale(1.03); box-shadow: 0 0 32px #7c3aed66; }
  .option-btn:hover { border-color: #7c3aed !important; background: #1e0a4a !important; }
  .result-card:hover { border-color: #4c1d95 !important; }
  .sahi-textarea:focus { border-color: #7c3aed !important; box-shadow: 0 0 0 3px #7c3aed22; }
  .feed-btn:hover { opacity: 0.85; transform: scale(0.98); }
  .back-btn:hover { color: #a78bfa !important; }
  .restart-btn:hover { color: #7c6fa0 !important; border-color: #3b1f8a !important; }
  @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:0.7} }
  .pulse-orb { animation: pulse 1.5s ease-in-out infinite; }
`