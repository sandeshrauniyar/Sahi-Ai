import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const steps = [
  { num: '01', emoji: '🗣️', title: 'Choose your language', desc: 'Start in English or Hindi — your whole experience adapts instantly.', color: '#7c3aed' },
  { num: '02', emoji: '💬', title: 'Describe your problem', desc: 'Tell us what you\'re trying to solve in your own words. No tech jargon needed.', color: '#d97706' },
  { num: '03', emoji: '❓', title: 'Answer 6 quick questions', desc: 'Who you are, your goals, struggles, device, budget, and skill level. Takes 2 minutes.', color: '#7c3aed' },
  { num: '04', emoji: '🧠', title: 'AI analyses your profile', desc: 'Our AI reads your exact situation and matches it against thousands of tools used across India.', color: '#d97706' },
  { num: '05', emoji: '🎯', title: 'Get 4 personalized picks', desc: 'Best for you, best free option, most popular in India, and a custom pick — all with reasons.', color: '#7c3aed' },
  { num: '06', emoji: '🚀', title: 'Start in 5 minutes', desc: 'Each recommendation comes with an exact first step you can take right now.', color: '#d97706' },
]

const faqs = [
  { q: 'Is Sahi AI completely free?', a: 'Yes! Using Sahi AI to get recommendations is 100% free. We recommend both free and paid tools based on your budget.' },
  { q: 'Does it work in Hindi?', a: 'Absolutely! Sahi AI fully supports Hindi. Choose Hindi at the start and every question, recommendation, and result will be in Hindi.' },
  { q: 'I only have a phone — will it work?', a: 'Yes! Sahi AI is mobile-first and works perfectly on any Android or iPhone browser. No app download needed.' },
  { q: 'How is this different from just Googling?', a: 'Google gives you generic results. Sahi AI gives you personalized picks based on YOUR budget, device, skill level, and goals — tailored for the Indian market.' },
  { q: 'Is my data safe?', a: 'Yes. All your data is encrypted and stored securely using Supabase Row Level Security. Only you can see your profile and results. We never sell your data.' },
  { q: 'Can I use it for my business?', a: 'Yes! Whether you run a chai stall, a clothing shop, or a startup — Sahi AI has picks for every type of Indian business owner.' },
]

export default function HowItWorks() {
  return (
    <main style={{ background: '#0a0618', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#e2d9f3' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .step-card:hover { border-color: #7c3aed !important; transform: translateY(-2px); }
        .faq-item:hover { border-color: #3b1f8a !important; }
      `}</style>

      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: 120, paddingBottom: 80, textAlign: 'center', padding: '120px 24px 80px', background: 'radial-gradient(ellipse at 50% 0%, #1e0a4a 0%, #0a0618 60%)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, color: '#7c3aed', background: '#1e0a4a', border: '1px solid #3b1f8a', borderRadius: 100, padding: '4px 16px', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>How it works</div>
          <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 700, fontFamily: "'Playfair Display', serif", background: 'linear-gradient(135deg, #c084fc, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 20, lineHeight: 1.15 }}>
            From confused to confident in 2 minutes
          </h1>
          <p style={{ fontSize: 17, color: '#9d8ec4', lineHeight: 1.8, marginBottom: 36 }}>
            No complicated forms. No tech jargon. Just tell us who you are and what you need — we'll find the perfect AI tools for you.
          </p>
          <a href="/" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #7c3aed, #d97706)', color: '#fff', padding: '14px 32px', borderRadius: 14, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
            Try it now — it's free →
          </a>
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {steps.map((step, i) => (
            <div key={i} className="step-card" style={{ background: '#130d2e', border: '1px solid #2a1f4a', borderRadius: 20, padding: '28px 24px', transition: 'all 0.2s', cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <span style={{ fontSize: 36 }}>{step.emoji}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: step.color, opacity: 0.5, letterSpacing: 1 }}>{step.num}</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f5f3ff', marginBottom: 10, fontFamily: "'Playfair Display', serif" }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: '#7c6fa0', lineHeight: 1.7 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '60px 24px 100px', maxWidth: 760, margin: '0 auto' }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, fontFamily: "'Playfair Display', serif", textAlign: 'center', background: 'linear-gradient(135deg, #c084fc, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 48 }}>
          Frequently asked questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item" style={{ background: '#130d2e', border: '1px solid #2a1f4a', borderRadius: 16, padding: '20px 22px', transition: 'border-color 0.2s' }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#f5f3ff', marginBottom: 8 }}>Q: {faq.q}</p>
              <p style={{ fontSize: 14, color: '#7c6fa0', lineHeight: 1.7 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}