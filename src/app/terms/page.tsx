import Link from 'next/link'

export default function TermsPage() {
  const S: Record<string, React.CSSProperties> = {
    page: { minHeight:'100vh', background:'radial-gradient(ellipse at 80% 20%, #1e0a4a 0%, #0a0618 50%, #0d0520 100%)', fontFamily:"'DM Sans',sans-serif", color:'#e2d9f3', padding:'60px 16px 80px' },
    wrap: { maxWidth:720, margin:'0 auto' },
    badge: { display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:2, color:'#d97706', textTransform:'uppercase' as const, marginBottom:12 },
    h1: { fontSize:40, fontWeight:700, fontFamily:"'Playfair Display',serif", background:'linear-gradient(135deg,#fbbf24,#c084fc)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:8, lineHeight:1.2 },
    sub: { fontSize:14, color:'#6b5fa0', marginBottom:40 },
    section: { marginBottom:36 },
    h2: { fontSize:18, fontWeight:700, color:'#c4b5fd', marginBottom:12, paddingBottom:8, borderBottom:'1px solid #1a1035' },
    p: { fontSize:14, color:'#9d8ec4', lineHeight:1.8, marginBottom:10 },
    card: { background:'#130d2e', border:'1px solid #2a1f4a', borderRadius:16, padding:'20px 22px', marginBottom:16 },
    highlight: { background:'#2d1a00', border:'1px solid #d97706', borderRadius:12, padding:'16px 20px', marginBottom:24 },
  }

  return (
    <main style={S.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;}`}</style>

      <div style={S.wrap}>
        <Link href="/" style={{ fontSize:13, color:'#d97706', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:4, marginBottom:32 }}>← Back to Sahi AI</Link>

        <div style={S.badge}>Legal · Terms</div>
        <h1 style={S.h1}>Terms of Service</h1>
        <p style={S.sub}>Last updated: March 2025 · By using Sahi AI, you agree to these terms.</p>

        <div style={S.highlight}>
          <p style={{ fontSize:14, color:'#fbbf24', fontWeight:600, marginBottom:6 }}>📋 The short version</p>
          <p style={{ fontSize:14, color:'#fcd34d', lineHeight:1.7 }}>
            Use Sahi AI to find tools and learn. Don't misuse it. Don't try to hack it or figure out how it works internally. Be respectful. We provide recommendations in good faith — always verify before spending money.
          </p>
        </div>

        <div style={S.section}>
          <h2 style={S.h2}>1. Acceptance of Terms</h2>
          <p style={S.p}>By accessing or using Sahi AI (sahiai.in), you confirm that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, please discontinue use immediately.</p>
          <p style={S.p}>These terms apply to all users including visitors, registered users, and anyone who accesses the platform.</p>
        </div>

        <div style={S.section}>
          <h2 style={S.h2}>2. What Sahi AI Is</h2>
          <p style={S.p}>Sahi AI is an AI-powered recommendation platform that suggests tools and applications based on your profile and goals. Our recommendations are generated based on your inputs and are intended as guidance only.</p>
          <p style={S.p}>We do not guarantee that any recommended tool will meet your specific needs. Always research tools independently before making purchasing decisions.</p>
        </div>

        <div style={S.section}>
          <h2 style={S.h2}>3. Permitted Use</h2>
          <div style={S.card}>
            <p style={{ fontSize:13, color:'#4ade80', fontWeight:600, marginBottom:10 }}>✅ You MAY:</p>
            {['Use Sahi AI to get personalized tool recommendations', 'Create an account to save your recommendations', 'Share Sahi AI with friends and colleagues', 'Provide feedback to help us improve', 'Use recommendations for personal and professional decisions'].map(item => (
              <p key={item} style={{ fontSize:13, color:'#86efac', marginBottom:6 }}>• {item}</p>
            ))}
          </div>
          <div style={{ background:'#2d0a1e', border:'1px solid #9f1239', borderRadius:14, padding:'18px 20px' }}>
            <p style={{ fontSize:13, color:'#f472b6', fontWeight:600, marginBottom:10 }}>✗ You MAY NOT:</p>
            {['Attempt to reverse-engineer, scrape, or extract our recommendation engine or API', 'Use automated bots or scripts to query the platform', 'Attempt to discover or misuse our API keys or backend services', 'Impersonate Sahi AI or claim to be affiliated with us', 'Use the platform for any illegal activity under Indian law', 'Attempt to bypass security measures or access others\' data'].map(item => (
              <p key={item} style={{ fontSize:13, color:'#fda4af', marginBottom:6 }}>• {item}</p>
            ))}
          </div>
        </div>

        <div style={S.section}>
          <h2 style={S.h2}>4. Intellectual Property & Confidentiality</h2>
          <p style={S.p}>The Sahi AI recommendation engine, including its algorithms, prompts, logic, and methodology, is proprietary and confidential. Any attempt to discover, replicate, or expose the internal workings of the platform is strictly prohibited and may result in legal action.</p>
          <p style={S.p}>All content on sahiai.in including design, text, graphics, and code is owned by Sahi AI and protected under Indian intellectual property law.</p>
        </div>

        <div style={S.section}>
          <h2 style={S.h2}>5. Disclaimer of Warranties</h2>
          <p style={S.p}>Sahi AI's recommendations are provided "as is" for informational purposes. We make no warranties that:</p>
          {['Any recommended tool will be suitable for your specific needs', 'The platform will be available without interruption', 'Recommendations will always be current or up-to-date', 'Any tool we recommend will remain free or at the same price'].map(item => (
            <p key={item} style={{ fontSize:14, color:'#9d8ec4', marginBottom:6, paddingLeft:20 }}>• {item}</p>
          ))}
        </div>

        <div style={S.section}>
          <h2 style={S.h2}>6. Limitation of Liability</h2>
          <p style={S.p}>Sahi AI shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform or any tool you choose based on our recommendations. You use all recommended tools at your own risk and discretion.</p>
        </div>

        <div style={S.section}>
          <h2 style={S.h2}>7. Account Termination</h2>
          <p style={S.p}>We reserve the right to suspend or terminate accounts that violate these terms, engage in abusive behavior, or attempt to compromise platform security.</p>
        </div>

        <div style={S.section}>
          <h2 style={S.h2}>8. Governing Law</h2>
          <p style={S.p}>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.</p>
        </div>

        <div style={S.section}>
          <h2 style={S.h2}>9. Changes to Terms</h2>
          <p style={S.p}>We may update these terms periodically. Continued use of Sahi AI after changes constitutes acceptance of the new terms. We will notify registered users of significant changes via email.</p>
        </div>

        <div style={S.section}>
          <h2 style={S.h2}>10. Contact</h2>
          <p style={S.p}>For any questions about these terms, contact us at <span style={{color:'#a78bfa'}}>legal@sahiai.in</span></p>
        </div>

        <div style={{ ...S.card, background:'linear-gradient(135deg,#2d1a00,#1a1035)', borderColor:'#d97706', textAlign:'center' as const }}>
          <p style={{ fontSize:14, color:'#fbbf24', marginBottom:4, fontWeight:600 }}>Questions about these terms?</p>
          <p style={{ fontSize:13, color:'#6b5fa0' }}>Email us at <span style={{color:'#fbbf24'}}>legal@sahiai.in</span></p>
        </div>

        <div style={{ marginTop:32, display:'flex', gap:16, justifyContent:'center' }}>
          <Link href="/privacy" style={{ fontSize:13, color:'#7c3aed', textDecoration:'none' }}>Privacy Policy →</Link>
          <Link href="/" style={{ fontSize:13, color:'#7c3aed', textDecoration:'none' }}>Back to Sahi AI →</Link>
        </div>
      </div>
    </main>
  )
}