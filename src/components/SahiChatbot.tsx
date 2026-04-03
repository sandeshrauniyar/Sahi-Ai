'use client'
import { useState, useRef, useEffect } from 'react'

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .sahi-btn { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); }
  .sahi-btn:hover { transform: scale(1.04); }
  .sahi-input:focus { border-color: #a855f7 !important; box-shadow: 0 0 0 3px rgba(168,85,247,0.18); outline: none; }
  .chat-msg { animation: msgIn 0.3s cubic-bezier(0.4,0,0.2,1); }
  @keyframes msgIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(168,85,247,0.4);} 50%{transform:scale(1.05);box-shadow:0 0 0 8px rgba(168,85,247,0);} }
  @keyframes dot { 0%,80%,100%{transform:scale(0.6);opacity:0.4;} 40%{transform:scale(1);opacity:1;} }
  .dot1{animation:dot 1.2s 0s infinite;}
  .dot2{animation:dot 1.2s 0.2s infinite;}
  .dot3{animation:dot 1.2s 0.4s infinite;}
  ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:#3b1f8a;border-radius:4px;}
`

const QUICK = ['What is Sahi AI?', 'How does it work?', 'Is it free?', 'Help me find tools']
const QUICK_HI = ['Sahi AI kya hai?', 'Kaise kaam karta hai?', 'Kya ye free hai?', 'Mujhe tools dhundho']

const SYSTEM = `You are Sahi AI's helpful assistant — warm, friendly, like a knowledgeable didi or bhaiya.
You help Indian users find the right AI tools based on their budget, device, and goals.
Keep replies SHORT (2-4 lines max). Be conversational, not corporate.
If user writes in Hindi, reply in Hindi. If English, reply in English.
Never mention Claude, Anthropic, or any underlying AI. You are Sahi AI.
If asked about recommendations, guide them to take the quiz at sahiai.in.
Key facts: Sahi AI is free, works in Hindi and English, made for India, recommends 4 tools per query.`

type Msg = { role: 'user' | 'assistant'; text: string }

export default function SahiChatbot() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', text: '👋 Namaste! I\'m Sahi AI\'s assistant.\n\nAsk me anything — which tools to use, how Sahi AI works, or just tell me your problem! 🇮🇳' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState<'en' | 'hi'>('en')
  const [unread, setUnread] = useState(1)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) { setUnread(0); bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }
  }, [open, msgs])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Msg = { role: 'user', text }
    setMsgs(m => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const history = [...msgs, userMsg].map(m => ({ role: m.role, content: m.text }))
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, system: SYSTEM })
      })
      const data = await res.json()
      setMsgs(m => [...m, { role: 'assistant', text: data.reply || 'Sorry, kuch gadbad ho gayi. Please try again!' }])
    } catch {
      setMsgs(m => [...m, { role: 'assistant', text: 'Oops! Connection issue. Please try again 🙏' }])
    }
    setLoading(false)
  }

  return (
    <>
      <style>{G}</style>

      {/* Tooltip */}
      {!open && (
        <div style={{ position:'fixed', bottom:88, right:24, background:'linear-gradient(135deg,#1e0a4a,#130d2e)', border:'1px solid #3b1f8a', borderRadius:12, padding:'8px 14px', fontSize:12, color:'#c4b5fd', whiteSpace:'nowrap', pointerEvents:'none', zIndex:9998, boxShadow:'0 4px 20px rgba(124,58,237,0.3)' }}>
          Need help finding the right AI tools? 💡
        </div>
      )}

      {/* FAB Button */}
      <button
        className="sahi-btn"
        onClick={() => setOpen(o => !o)}
        style={{ position:'fixed', bottom:24, right:24, width:58, height:58, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#d97706)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, zIndex:9999, boxShadow:'0 4px 24px rgba(124,58,237,0.5)', animation: open ? 'none' : 'pulse 2.5s infinite' }}
      >
        {open ? '✕' : '💬'}
        {unread > 0 && !open && (
          <span style={{ position:'absolute', top:-4, right:-4, width:18, height:18, borderRadius:'50%', background:'#ef4444', fontSize:10, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans',sans-serif" }}>{unread}</span>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{ position:'fixed', bottom:96, right:24, width:360, maxHeight:520, borderRadius:20, background:'#0e0a1f', border:'1px solid #2a1f4a', boxShadow:'0 8px 48px rgba(124,58,237,0.35)', display:'flex', flexDirection:'column', zIndex:9999, overflow:'hidden', fontFamily:"'DM Sans',sans-serif" }}>

          {/* Header */}
          <div style={{ background:'linear-gradient(135deg,#1e0a4a,#130d2e)', padding:'14px 18px', borderBottom:'1px solid #2a1f4a', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#d97706)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🎯</div>
              <div>
                <p style={{ fontSize:14, fontWeight:700, color:'#f5f3ff', fontFamily:"'Playfair Display',serif" }}>Sahi AI</p>
                <p style={{ fontSize:11, color:'#4ade80' }}>● Online · India ka AI guide</p>
              </div>
            </div>
            <button onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')} style={{ background:'#1a1035', border:'1px solid #3b1f8a', borderRadius:8, padding:'4px 10px', fontSize:11, color:'#a78bfa', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
              {lang === 'en' ? '🇮🇳 हिन्दी' : '🇬🇧 English'}
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:10, minHeight:200, maxHeight:320 }}>
            {msgs.map((m, i) => (
              <div key={i} className="chat-msg" style={{ display:'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth:'82%', padding:'10px 14px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.role === 'user' ? 'linear-gradient(135deg,#7c3aed,#6d28d9)' : '#1a1035',
                  border: m.role === 'user' ? 'none' : '1px solid #2a1f4a',
                  fontSize:13, color: m.role === 'user' ? '#fff' : '#c4b5fd', lineHeight:1.6,
                  whiteSpace:'pre-wrap'
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display:'flex', gap:4, padding:'10px 14px', background:'#1a1035', border:'1px solid #2a1f4a', borderRadius:'16px 16px 16px 4px', width:'fit-content' }}>
                {[0,1,2].map(i => <div key={i} className={`dot${i+1}`} style={{ width:7, height:7, borderRadius:'50%', background:'#a78bfa' }} />)}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Replies */}
          {msgs.length <= 2 && (
            <div style={{ padding:'0 14px 10px', display:'flex', flexWrap:'wrap', gap:6 }}>
              {(lang === 'en' ? QUICK : QUICK_HI).map(q => (
                <button key={q} onClick={() => send(q)} className="sahi-btn" style={{ fontSize:11, padding:'5px 10px', background:'#1a1035', border:'1px solid #3b1f8a', borderRadius:20, color:'#a78bfa', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>{q}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding:'10px 14px 14px', borderTop:'1px solid #1a1035', display:'flex', gap:8 }}>
            <input
              className="sahi-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              placeholder={lang === 'en' ? 'Ask anything...' : 'Kuch bhi poochho...'}
              style={{ flex:1, background:'#1a1035', border:'1px solid #2a1f4a', borderRadius:12, padding:'10px 14px', fontSize:13, color:'#e2d9f3', fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s' }}
            />
            <button
              onClick={() => send(input)}
              className="sahi-btn"
              disabled={!input.trim() || loading}
              style={{ width:40, height:40, borderRadius:12, background: input.trim() ? 'linear-gradient(135deg,#7c3aed,#d97706)' : '#1a1035', border:'1px solid #2a1f4a', cursor: input.trim() ? 'pointer' : 'not-allowed', fontSize:16, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}
            >
              ➤
            </button>
          </div>

          {/* Footer */}
          <div style={{ padding:'6px 14px 10px', textAlign:'center' }}>
            <p style={{ fontSize:10, color:'#2a1f4a' }}>Powered by Sahi AI · sahiai.in</p>
          </div>
        </div>
      )}
    </>
  )
}