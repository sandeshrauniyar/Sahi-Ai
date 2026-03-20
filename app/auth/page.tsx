'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars!')
}

const supabase = createClient(supabaseUrl!, supabaseKey!)

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/profile` }
    })
  }

  const handleSubmit = async () => {
    console.log('Submit clicked, mode:', mode)
    setLoading(true)
    setError('')
    setMessage('')
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      })
      if (error) setError(error.message)
      else setMessage('✅ Check your email to confirm your account!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else window.location.href = '/profile'
    }
    setLoading(false)
  }

  return (
    <main style={S.page}>
      <style>{G}</style>
      <div style={S.card}>
        <div style={S.logoMark}>सही</div>
        <h1 style={S.title}>Sahi AI</h1>
        <p style={S.sub}>{mode === 'login' ? 'Welcome back! 👋' : 'Create your secure profile 🔐'}</p>

        <button style={S.googleBtn} className="google-btn" onClick={handleGoogle}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>G</span>
          <span>Continue with Google</span>
        </button>

        <div style={S.dividerWrap}>
          <div style={S.dividerLine} />
          <span style={S.dividerText}>or</span>
          <div style={S.dividerLine} />
        </div>

        {mode === 'signup' && (
          <div style={S.field}>
            <label style={S.label}>Full Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Rahul Sharma"
              style={S.input}
              className="sahi-input"
            />
          </div>
        )}

        <div style={S.field}>
          <label style={S.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={S.input}
            className="sahi-input"
          />
        </div>

        <div style={S.field}>
          <label style={S.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Min 8 characters"
            style={S.input}
            className="sahi-input"
          />
        </div>

        {error && <p style={{ color: '#f87171', fontSize: 13, marginBottom: 12, width: '100%' }}>{error}</p>}
        {message && <p style={{ color: '#4ade80', fontSize: 13, marginBottom: 12, width: '100%' }}>{message}</p>}

        <button
          style={{ ...S.cta, opacity: loading ? 0.7 : 1 }}
          className="cta-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Log In →' : 'Create Account →'}
        </button>

        <p style={S.switchText}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span
            style={{ color: '#a78bfa', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setMessage('') }}
          >
            {mode === 'login' ? 'Sign up free' : 'Log in'}
          </span>
        </p>

        <p style={S.secureNote}>🔒 Your data is encrypted. We never sell your data.</p>
      </div>
    </main>
  )
}

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at 20% 20%, #1e0a4a 0%, #0a0618 50%, #0d0520 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif",
    padding: '32px 16px',
  },
  card: {
    background: '#130d2e',
    border: '1px solid #2a1f4a',
    borderRadius: 24,
    padding: '36px 32px',
    width: '100%',
    maxWidth: 420,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoMark: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 3,
    color: '#7c3aed',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    fontFamily: "'Playfair Display', serif",
    background: 'linear-gradient(135deg, #c084fc 0%, #fbbf24 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: 6,
  },
  sub: { fontSize: 14, color: '#7c6fa0', marginBottom: 24 },
  googleBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '13px',
    borderRadius: 12,
    border: '1px solid #2a1f4a',
    background: '#1a1035',
    color: '#e2d9f3',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: 20,
    transition: 'all 0.2s',
  },
  dividerWrap: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  dividerLine: { flex: 1, height: 1, background: '#2a1f4a' },
  dividerText: { fontSize: 12, color: '#4b3f72' },
  field: { width: '100%', marginBottom: 14 },
  label: { fontSize: 12, color: '#7c6fa0', display: 'block', marginBottom: 6, fontWeight: 600 },
  input: {
    width: '100%',
    background: '#0d0520',
    border: '1px solid #2a1f4a',
    borderRadius: 10,
    padding: '12px 14px',
    fontSize: 14,
    color: '#e2d9f3',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s',
  },
  cta: {
    width: '100%',
    background: 'linear-gradient(135deg, #7c3aed 0%, #d97706 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '14px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: 16,
    transition: 'all 0.2s',
  },
  switchText: { fontSize: 13, color: '#4b3f72', marginBottom: 16 },
  secureNote: { fontSize: 11, color: '#3b2f5a', textAlign: 'center', lineHeight: 1.6 },
}

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;600;700&display=swap');
  .google-btn:hover { border-color: #7c3aed !important; background: #1e0a4a !important; }
  .cta-btn:hover { transform: scale(1.02); box-shadow: 0 0 24px #7c3aed55; }
  .sahi-input:focus { border-color: #7c3aed !important; box-shadow: 0 0 0 3px #7c3aed22; }
`