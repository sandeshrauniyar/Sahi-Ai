import Link from 'next/link'

export default function PrivacyPage() {
  const S: Record<string, React.CSSProperties> = {
    page: { minHeight:'100vh', background:'radial-gradient(ellipse at 20% 20%, #1e0a4a 0%, #0a0618 50%, #0d0520 100%)', fontFamily:"'DM Sans',sans-serif", color:'#e2d9f3', padding:'60px 16px 80px' },
    wrap: { maxWidth:720, margin:'0 auto' },
    badge: { display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:2, color:'#7c3aed', textTransform:'uppercase' as const, marginBottom:12 },
    h1: { fontSize:40, fontWeight:700, fontFamily:"'Playfair Display',serif", background:'linear-gradient(135deg,#c084fc,#fbbf24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:8, lineHeight:1.2 },
    sub: { fontSize:14, color:'#6b5fa0', marginBottom:40 },
    section: { marginBottom:36 },
    h2: { fontSize:18, fontWeight:700, color:'#c4b5fd', marginBottom:12, paddingBottom:8, borderBottom:'1px solid #1a1035' },
    p: { fontSize:14, color:'#9d8ec4', lineHeight:1.8, marginBottom:10 },
    card: { background:'#130d2e', border:'1px solid #2a1f4a', borderRadius:16, padding:'20px 22px', marginBottom:16 },
    li: { fontSize:14, color:'#9d8ec4', lineHeight:1.8, marginBottom:6, paddingLeft:20, position:'relative' as const },
    highlight: { background:'#1e0a4a', border:'1px solid #3b1f8a', borderRadius:12, padding:'16px 20px', marginBottom:20 },
  }

  return (
    <main style={S.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;}`}</style>

      <div style={S.wrap}>
        <Link href="/" style={{ fontSize:13, color:'#7c3aed', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:4, marginBottom:32 }}>← Back to Sahi AI</Link>

        <div style={S.badge}>Legal · Privacy</div>
        <h1 style={S.h1}>Privacy Policy</h1>
        <p style={S.sub}>Last updated: March 2025 · Version 1.0 · Effective immediately</p>

        {/* Highlight */}
        <div style={S.highlight}>
          <p style={{ fontSize:14, color:'#c084fc', fontWeight:600, marginBottom:6 }}>🔒 The short version</p>
          <p style={{ fontSize:14, color:'#a78bfa', lineHeight:1.7 }}>
            Sahi AI collects your answers to give you personalized recommendations. We never sell your data. We never share it with advertisers. You can delete your data anytime. That's it.
          </p>
        </div>

        <div style={S.section}>
          <h2 style={S.h2}>1. Who We Are</h2>
          <p style={S.p}>Sahi AI (sahiai.in) is an AI-powered tool recommendation platform built for Indian users. We are based in India and operate under India's Digital Personal Data Protection (DPDP) Act, 2023.</p>
          <p style={S.p}>For privacy-related queries, contact us at: <span style={{color:'#a78bfa'}}>privacy@sahiai.in</span></p>
        </div>

        <div style={S.section}>
          <h2 style={S.h2}>2. What We Collect</h2>
          <div style={S.card}>
            {[
              ['Your answers', 'Goals, device type, budget, skill level, language preference — to give you relevant recommendations.'],
              ['Your problem statement', 'The free-text description you type to help us understand your situation.'],
              ['Recommendation results', 'The tools we suggested and your feedback on them.'],
              ['Account information', 'Email address and name if you create a profile (optional).'],
              ['Usage data', 'Which pages you visit and how you interact with the site — to improve performance.'],
            ].map(([label, desc]) => (
              <div key={label} style={{ display:'flex', gap:12, marginBottom:12 }}>
                <span style={{ fontSize:16, flexShrink:0 }}>✅</span>
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:'#c4b5fd', marginBottom:2 }}>{label}</p>
                  <p style={{ fontSize:13, color:'#7c6fa0', lineHeight:1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={S.section}>
          <h2 style={S.h2}>3. What We DON'T Do</h2>
          <div style={{ background:'#052e16', border:'1px solid #16a34a', borderRadius:14, padding:'18px 20px' }}>
            {['Sell your data to any third party', 'Share your personal information with advertisers', 'Use your data to show you targeted ads', 'Store your data longer than necessary', 'Access data you haven\'t explicitly provided'].map(item => (
              <div key={item} style={{ display:'flex', gap:10, marginBottom:8, alignItems:'center' }}>
                <span style={{ color:'#4ade80', fontSize:14 }}>✗</span>
                <p style={{ fontSize:13, color:'#86efac' }}>We do NOT {item}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={S.section}>
          <h2 style={S.h2}>4. How We Use Your Data</h2>
          <p style={S.p}>Your data is used exclusively to:</p>
          {['Generate personalized AI tool recommendations for you', 'Improve the quality of recommendations over time using anonymized, aggregated insights', 'Send you updates about better tools if you opt in to notifications', 'Maintain the security and performance of the platform'].map(item => (
            <p key={item} style={{ ...S.li }}>• {item}</p>
          ))}
        </div>

        <div style={S.section}>
          <h2 style={S.h2}>5. Data Storage & Security</h2>
          <p style={S.p}>Your data is stored securely using Supabase, a trusted infrastructure provider. We implement Row Level Security (RLS) which means only you can access your own data. All connections are encrypted using HTTPS/TLS.</p>
          <p style={S.p}>We retain your data for as long as your account is active. You can request deletion at any time.</p>
        </div>

        <div style={S.section}>
          <h2 style={S.h2}>6. Your Rights (DPDP Act 2023)</h2>
          <p style={S.p}>Under India's Digital Personal Data Protection Act 2023, you have the right to:</p>
          {['Access your personal data that we hold', 'Correct inaccurate personal data', 'Request deletion of your personal data', 'Withdraw consent at any time', 'Nominate a person to exercise rights on your behalf'].map(item => (
            <p key={item} style={{ ...S.li }}>• {item}</p>
          ))}
          <p style={{ ...S.p, marginTop:12 }}>To exercise any of these rights, email us at <span style={{color:'#a78bfa'}}>privacy@sahiai.in</span>. We will respond within 30 days.</p>
        </div>

        <div style={S.section}>
          <h2 style={S.h2}>7. Cookies</h2>
          <p style={S.p}>We use minimal cookies — only what's necessary for the platform to function (e.g., keeping you logged in). We do not use advertising or tracking cookies.</p>
        </div>

        <div style={S.section}>
          <h2 style={S.h2}>8. Children's Privacy</h2>
          <p style={S.p}>Sahi AI is accessible to students from Class 8 onwards (approximately 13+ years). We do not knowingly collect data from children under 13. If you believe a child under 13 has provided us data, contact privacy@sahiai.in immediately.</p>
        </div>

        <div style={S.section}>
          <h2 style={S.h2}>9. Changes to This Policy</h2>
          <p style={S.p}>We may update this policy periodically. When we do, we will update the "Last updated" date above and notify registered users via email if changes are significant.</p>
        </div>

        <div style={{ ...S.card, background:'linear-gradient(135deg,#1e0a4a,#130d2e)', borderColor:'#3b1f8a', textAlign:'center' as const }}>
          <p style={{ fontSize:14, color:'#a78bfa', marginBottom:4, fontWeight:600 }}>Questions about your privacy?</p>
          <p style={{ fontSize:13, color:'#6b5fa0' }}>Email us at <span style={{color:'#c084fc'}}>privacy@sahiai.in</span></p>
          <p style={{ fontSize:11, color:'#3b2f5a', marginTop:8 }}>Grievance Officer: Sandesh Rauniyar · Response time: within 30 days</p>
        </div>

        <div style={{ marginTop:32, display:'flex', gap:16, justifyContent:'center' }}>
          <Link href="/terms" style={{ fontSize:13, color:'#7c3aed', textDecoration:'none' }}>Terms of Service →</Link>
          <Link href="/" style={{ fontSize:13, color:'#7c3aed', textDecoration:'none' }}>Back to Sahi AI →</Link>
        </div>
      </div>
    </main>
  )
}