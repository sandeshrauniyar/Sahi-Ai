import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const stats = [
  { number: '13+', label: 'Indian languages coming', emoji: '🗣️' },
  { number: '50+', label: 'AI tools evaluated', emoji: '🤖' },
  { number: '₹0', label: 'Cost to use Sahi AI', emoji: '💸' },
  { number: '1.4B', label: 'Indians we build for', emoji: '🇮🇳' },
]

const values = [
  { emoji: '🇮🇳', title: 'India first', desc: 'Every recommendation is filtered for Indian budgets, Indian devices, Indian internet speeds, and Indian languages.' },
  { emoji: '💸', title: 'Budget respect', desc: 'We never recommend a paid tool when a free one works just as well. Your rupee matters to us.' },
  { emoji: '🔒', title: 'Privacy always', desc: 'Your data is yours. We use bank-level encryption and never sell your information to anyone.' },
  { emoji: '🧠', title: 'No jargon', desc: 'Tech should not be scary. We explain every tool in simple, friendly language anyone can understand.' },
]

export default function About() {
  return (
    <main style={{ background: '#0a0618', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#e2d9f3' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .value-card:hover { border-color: #7c3aed !important; }
      `}</style>

      <Navbar />

      {/* Hero */}
      <section style={{ padding: '120px 24px 80px', textAlign: 'center', background: 'radial-gradient(ellipse at 50% 0%, #1e0a4a 0%, #0a0618 60%)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, color: '#7c3aed', background: '#1e0a4a', border: '1px solid #3b1f8a', borderRadius: 100, padding: '4px 16px', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Our story</div>
          <h1 style={{ fontSize: 'clamp(32px, 6vw, 52px)', fontWeight: 700, fontFamily: "'Playfair Display', serif", background: 'linear-gradient(135deg, #c084fc, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 24, lineHeight: 1.15 }}>
            Built for every Indian who felt left behind by tech
          </h1>
          <p style={{ fontSize: 16, color: '#9d8ec4', lineHeight: 1.9, marginBottom: 16 }}>
            There are thousands of AI tools out there. But most of them are built for Silicon Valley — not for a student in Patna, a homemaker in Jaipur, or a shopkeeper in Surat.
          </p>
          <p style={{ fontSize: 16, color: '#9d8ec4', lineHeight: 1.9 }}>
            Sahi AI was built to change that. We believe every Indian — regardless of their budget, device, language, or tech skills — deserves to know which AI tools can actually help them.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ background: '#130d2e', border: '1px solid #2a1f4a', borderRadius: 18, padding: '24px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 28 }}>{stat.emoji}</div>
              <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "'Playfair Display', serif", background: 'linear-gradient(135deg, #c084fc, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginTop: 8 }}>{stat.number}</div>
              <div style={{ fontSize: 12, color: '#6b5fa0', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '40px 24px', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e0a4a, #130d2e)', border: '1px solid #7c3aed', borderRadius: 24, padding: '40px 36px', textAlign: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Our mission</p>
          <p style={{ fontSize: 22, fontFamily: "'Playfair Display', serif", color: '#f5f3ff', lineHeight: 1.6 }}>
            "To make AI accessible to every Indian — in their language, within their budget, on their device."
          </p>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '60px 24px 100px', maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, fontFamily: "'Playfair Display', serif", textAlign: 'center', color: '#f5f3ff', marginBottom: 48 }}>What we stand for</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
          {values.map((v, i) => (
            <div key={i} className="value-card" style={{ background: '#130d2e', border: '1px solid #2a1f4a', borderRadius: 18, padding: '24px 20px', transition: 'border-color 0.2s' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{v.emoji}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f5f3ff', marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>{v.title}</h3>
              <p style={{ fontSize: 13, color: '#7c6fa0', lineHeight: 1.7 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}