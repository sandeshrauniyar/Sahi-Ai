'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', type: 'feedback', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setSent(true)
    setLoading(false)
  }

  return (
    <main style={{ background: '#0a0618', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#e2d9f3' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .sahi-input:focus { border-color: #7c3aed !important; box-shadow: 0 0 0 3px #7c3aed22; }
        .submit-btn:hover { transform: scale(1.02); box-shadow: 0 0 24px #7c3aed44; }
        .contact-card:hover { border-color: #3b1f8a !important; }
      `}</style>

      <Navbar />

      <section style={{ padding: '120px 24px 100px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, color: '#7c3aed', background: '#1e0a4a', border: '1px solid #3b1f8a', borderRadius: 100, padding: '4px 16px', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Get in touch</div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, fontFamily: "'Playfair Display', serif", background: 'linear-gradient(135deg, #c084fc, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 16 }}>We'd love to hear from you</h1>
          <p style={{ fontSize: 15, color: '#7c6fa0', maxWidth: 500, margin: '0 auto' }}>Got feedback, a suggestion, or just want to say hi? We read every message.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 32, alignItems: 'start' }}>

          {/* Left side info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { emoji: '📧', title: 'Email us', desc: 'sahiailabs@gmail.com', sub: 'We reply within 24 hours' },
              { emoji: '🐦', title: 'Twitter / X', desc: '@sahiai_in', sub: 'Quick updates and announcements' },
              { emoji: '💬', title: 'WhatsApp', desc: 'Coming soon', sub: 'Direct support in Hindi & English' },
            ].map((item, i) => (
              <div key={i} className="contact-card" style={{ background: '#130d2e', border: '1px solid #2a1f4a', borderRadius: 16, padding: '18px 20px', transition: 'border-color 0.2s' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 24 }}>{item.emoji}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#c4b5fd', marginBottom: 2 }}>{item.title}</p>
                    <p style={{ fontSize: 14, color: '#f5f3ff', marginBottom: 2 }}>{item.desc}</p>
                    <p style={{ fontSize: 12, color: '#4b3f72' }}>{item.sub}</p>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ background: '#052e16', border: '1px solid #16a34a', borderRadius: 16, padding: '16px 18px' }}>
              <p style={{ fontSize: 13, color: '#4ade80', fontWeight: 600, marginBottom: 4 }}>🇮🇳 Hindi support</p>
              <p style={{ fontSize: 12, color: '#86efac', lineHeight: 1.6 }}>हिंदी में भी लिख सकते हैं — हम जवाब देंगे!</p>
            </div>
          </div>

          {/* Form */}
          {sent ? (
            <div style={{ background: '#130d2e', border: '1px solid #7c3aed', borderRadius: 24, padding: '48px 36px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
              <h2 style={{ fontSize: 24, fontFamily: "'Playfair Display', serif", color: '#f5f3ff', marginBottom: 12 }}>Message sent!</h2>
              <p style={{ fontSize: 14, color: '#7c6fa0', lineHeight: 1.7 }}>Thank you for reaching out. We'll get back to you within 24 hours. 🙏</p>
            </div>
          ) : (
            <div style={{ background: '#130d2e', border: '1px solid #2a1f4a', borderRadius: 24, padding: '32px 28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#7c6fa0', display: 'block', marginBottom: 6, fontWeight: 600 }}>Your name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Rahul Sharma" className="sahi-input"
                    style={{ width: '100%', background: '#0d0520', border: '1px solid #2a1f4a', borderRadius: 10, padding: '11px 13px', fontSize: 14, color: '#e2d9f3', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#7c6fa0', display: 'block', marginBottom: 6, fontWeight: 600 }}>Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@gmail.com" className="sahi-input"
                    style={{ width: '100%', background: '#0d0520', border: '1px solid #2a1f4a', borderRadius: 10, padding: '11px 13px', fontSize: 14, color: '#e2d9f3', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: '#7c6fa0', display: 'block', marginBottom: 6, fontWeight: 600 }}>Type of message</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[['feedback', '💬 Feedback'], ['bug', '🐛 Bug report'], ['suggestion', '💡 Suggestion'], ['other', '📩 Other']].map(([val, label]) => (
                    <button key={val} onClick={() => setForm({ ...form, type: val })}
                      style={{ padding: '6px 14px', borderRadius: 100, border: `1px solid ${form.type === val ? '#7c3aed' : '#2a1f4a'}`, background: form.type === val ? '#1e0a4a' : '#0d0520', color: form.type === val ? '#c084fc' : '#6b5fa0', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: '#7c6fa0', display: 'block', marginBottom: 6, fontWeight: 600 }}>Message *</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us anything — in English or Hindi..." rows={5} className="sahi-input"
                  style={{ width: '100%', background: '#0d0520', border: '1px solid #2a1f4a', borderRadius: 10, padding: '12px 13px', fontSize: 14, color: '#e2d9f3', outline: 'none', resize: 'none', transition: 'all 0.2s', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif" }} />
              </div>

              <button onClick={handleSubmit} disabled={loading || !form.name || !form.email || !form.message}
                className="submit-btn"
                style={{ width: '100%', background: 'linear-gradient(135deg, #7c3aed, #d97706)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 600, cursor: loading ? 'wait' : 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s', opacity: (!form.name || !form.email || !form.message) ? 0.4 : 1 }}>
                {loading ? 'Sending...' : 'Send message →'}
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}