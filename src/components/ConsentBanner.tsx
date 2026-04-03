'use client'
import { useState, useEffect } from 'react'

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .consent-overlay { animation: fadeIn 0.4s ease; }
  .consent-card { animation: slideUp 0.4s cubic-bezier(0.4,0,0.2,1); }
  @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
  @keyframes slideUp { from{opacity:0;transform:translateY(40px);} to{opacity:1;transform:translateY(0);} }
  .consent-btn { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); }
  .consent-btn:hover { transform: scale(1.03); }
  .consent-check { transition: all 0.2s; cursor: pointer; }
  .consent-check:hover { border-color: #a855f7 !important; }
`

export default function ConsentBanner() {
  const [show, setShow] = useState(false)
  const [checked, setChecked] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('sahi_consent_v1')
    if (!consent) setTimeout(() => setShow(true), 800)
  }, [])

  const accept = () => {
    if (!checked) return
    localStorage.setItem('sahi_consent_v1', JSON.stringify({ accepted: true, timestamp: new Date().toISOString(), version: '1.0' }))
    setShow(false)
  }

  const decline = () => {
    window.location.href = 'https://google.com'
  }

  if (!show) return null

  return (
    <>
      <style>{G}</style>
      {/* Overlay */}
      <div className="consent-overlay" style={{ position:'fixed', inset:0, background:'rgba(10,6,24,0.85)', backdropFilter:'blur(6px)', zIndex:99999, display:'flex', alignItems:'flex-end', justifyContent:'center', padding:'0 16px 24px', fontFamily:"'DM Sans',sans-serif" }}>

        <div className="consent-card" style={{ width:'100%', maxWidth:580, background:'#130d2e', border:'1px solid #3b1f8a', borderRadius:24, padding:'28px 28px 24px', boxShadow:'0 -8px 48px rgba(124,58,237,0.3)' }}>

          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#7c3aed,#d97706)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🔒</div>
            <div>
              <h2 style={{ fontSize:18, fontWeight:700, color:'#f5f3ff', fontFamily:"'Playfair Display',serif", lineHeight:1.2 }}>Your Privacy Matters</h2>
              <p style={{ fontSize:12, color:'#6b5fa0' }}>Sahi AI · India ka personalized AI guide</p>
            </div>
          </div>

          {/* Main text */}
          <p style={{ fontSize:13, color:'#9d8ec4', lineHeight:1.7, marginBottom:14 }}>
            Before you continue, we want to be completely transparent. Sahi AI collects your responses (goals, device, budget) to give you personalized AI tool recommendations. <span style={{ color:'#c084fc', fontWeight:600 }}>We never sell your data</span> to anyone.
          </p>

          {/* Expandable details */}
          <button onClick={() => setExpanded(e => !e)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, color:'#7c3aed', fontFamily:"'DM Sans',sans-serif", padding:0, marginBottom:10, display:'flex', alignItems:'center', gap:4 }}>
            {expanded ? '▲' : '▼'} {expanded ? 'Hide details' : 'See what we collect & why'}
          </button>

          {expanded && (
            <div style={{ background:'#0d0520', border:'1px solid #2a1f4a', borderRadius:12, padding:'14px 16px', marginBottom:14, fontSize:12, color:'#7c6fa0', lineHeight:1.8 }}>
              <p>✅ <strong style={{color:'#c4b5fd'}}>What we collect:</strong> Your answers to questions (goal, device, budget, skill, language), your problem statement, recommendation results, and usage timestamps.</p>
              <p style={{marginTop:6}}>✅ <strong style={{color:'#c4b5fd'}}>Why we collect it:</strong> To show you personalized results and improve our recommendations for all Indian users.</p>
              <p style={{marginTop:6}}>✅ <strong style={{color:'#c4b5fd'}}>What we DON'T do:</strong> We never sell, share, or expose your personal data to third parties. Your data is protected under India's DPDP Act 2023.</p>
              <p style={{marginTop:6}}>✅ <strong style={{color:'#c4b5fd'}}>Your rights:</strong> You can request deletion of your data anytime at privacy@sahiai.in</p>
            </div>
          )}

          {/* Checkbox */}
          <label style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer', marginBottom:18 }}>
            <div
              className="consent-check"
              onClick={() => setChecked(c => !c)}
              style={{ width:20, height:20, borderRadius:6, border:`2px solid ${checked ? '#7c3aed' : '#3b1f8a'}`, background: checked ? '#7c3aed' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}
            >
              {checked && <span style={{ color:'#fff', fontSize:12, fontWeight:700 }}>✓</span>}
            </div>
            <span style={{ fontSize:13, color:'#9d8ec4', lineHeight:1.6 }}>
              I have read and agree to Sahi AI's <a href="/privacy" style={{ color:'#a78bfa' }}>Privacy Policy</a> and <a href="/terms" style={{ color:'#a78bfa' }}>Terms of Service</a>. I consent to the collection and use of my data as described above.
            </span>
          </label>

          {/* Buttons */}
          <div style={{ display:'flex', gap:10 }}>
            <button
              onClick={accept}
              className="consent-btn"
              disabled={!checked}
              style={{ flex:1, padding:'13px', borderRadius:14, background: checked ? 'linear-gradient(135deg,#7c3aed,#d97706)' : '#1a1035', border: checked ? 'none' : '1px solid #2a1f4a', color: checked ? '#fff' : '#3b2f5a', fontSize:14, fontWeight:700, cursor: checked ? 'pointer' : 'not-allowed', fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s' }}
            >
              ✓ I Agree — Continue to Sahi AI
            </button>
            <button
              onClick={decline}
              className="consent-btn"
              style={{ padding:'13px 18px', borderRadius:14, background:'transparent', border:'1px solid #2a1f4a', color:'#4b3f72', fontSize:13, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}
            >
              Decline
            </button>
          </div>

          <p style={{ fontSize:10, color:'#2a1f4a', textAlign:'center', marginTop:12 }}>
            🇮🇳 Compliant with India's Digital Personal Data Protection Act 2023
          </p>
        </div>
      </div>
    </>
  )
}