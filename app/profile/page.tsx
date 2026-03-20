'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Profile = {
  id: string
  email: string
  full_name: string
  who: string
  device: string
  budget: string
  skill: string
  language: string
  goals: string[]
  struggles: string[]
  notifications_enabled: boolean
}

type SavedRec = {
  id: string
  problem: string
  results: Array<{ tool: string; type: string; confidence: number; reason: string; firstStep: string }>
  created_at: string
}

type Tab = 'overview' | 'history' | 'settings'

export default function ProfilePage() {
  const [user, setUser]       = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [recs, setRecs]       = useState<SavedRec[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState<Tab>('overview')
  const [editing, setEditing] = useState(false)
  const [name, setName]       = useState('')
  const [notif, setNotif]     = useState(false)
  const [saving, setSaving]   = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth'; return }
      setUser(user)

      const { data: prof } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()
      if (prof) {
        setProfile(prof)
        setName(prof.full_name || '')
        setNotif(prof.notifications_enabled || false)
      }

      const { data: history } = await supabase
        .from('recommendations').select('*')
        .eq('user_id', user.id).order('created_at', { ascending: false })
      if (history) setRecs(history)

      setLoading(false)
    }
    load()
  }, [])

  const saveProfile = useCallback(async () => {
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      full_name: name,
      notifications_enabled: notif,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id)
    setSaving(false)
    if (!error) {
      setProfile(p => p ? { ...p, full_name: name, notifications_enabled: notif } : p)
      setEditing(false)
      setSaveMsg('✓ Saved!')
      setTimeout(() => setSaveMsg(''), 2500)
    }
  }, [name, notif, user])

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const deleteHistory = async (id: string) => {
    await supabase.from('recommendations').delete().eq('id', id)
    setRecs(r => r.filter(x => x.id !== id))
  }

  if (loading) return (
    <main style={S.page}><style>{G}</style>
      <div style={{ textAlign: 'center' }}>
        <div style={S.orb} className="pulse-orb" />
        <p style={{ color: '#4b3f72', fontSize: 14, marginTop: 20 }}>Loading your profile...</p>
      </div>
    </main>
  )

  const avatar = (profile?.full_name || user?.email || 'U')[0].toUpperCase()
  const hasProfile = !!(profile?.who)

  return (
    <main style={{ ...S.page, justifyContent: 'flex-start', padding: '32px 16px 64px' }}><style>{G}</style>
      <div style={S.wrap}>

        {/* ── TOP NAV ── */}
        <div style={S.topNav}>
          <button style={S.navHome} className="nav-btn" onClick={() => window.location.href = '/'}>
            ← Sahi AI
          </button>
          <div style={S.logoMark}>सही AI</div>
          <button style={S.logoutBtn} className="logout-btn" onClick={logout}>Log out</button>
        </div>

        {/* ── PROFILE HERO ── */}
        <div style={S.heroCard}>
          <div style={S.avatarWrap}>
            <div style={S.avatar}>{avatar}</div>
            {hasProfile && <div style={S.activeDot} />}
          </div>
          <div style={{ flex: 1 }}>
            {editing ? (
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                style={S.nameInput}
                className="name-input"
                placeholder="Your name"
                autoFocus
              />
            ) : (
              <p style={S.displayName}>{profile?.full_name || 'Add your name'}</p>
            )}
            <p style={{ fontSize: 13, color: '#4b3f72', marginTop: 2 }}>{user?.email}</p>
            {saveMsg && <p style={{ fontSize: 12, color: '#4ade80', marginTop: 4 }}>{saveMsg}</p>}
          </div>
          <button
            style={editing ? S.saveBtn : S.editBtn}
            className="edit-btn"
            onClick={editing ? saveProfile : () => setEditing(true)}
            disabled={saving}
          >
            {saving ? '...' : editing ? '✓ Save' : '✎ Edit'}
          </button>
        </div>

        {/* ── STATS ROW ── */}
        <div style={S.statsRow}>
          {[
            { label: 'Searches', value: recs.length },
            { label: 'Profile', value: hasProfile ? '✓ Done' : 'Incomplete' },
            { label: 'Language', value: profile?.language === 'hindi' ? 'हिंदी' : 'English' },
          ].map(s => (
            <div key={s.label} style={S.statBox}>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#c084fc', fontFamily: "'Cormorant Garamond', serif" }}>{s.value}</p>
              <p style={{ fontSize: 11, color: '#4b3f72', marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div style={S.tabs}>
          {(['overview', 'history', 'settings'] as Tab[]).map(t => (
            <button
              key={t}
              style={{ ...S.tab, ...(tab === t ? S.tabActive : {}) }}
              onClick={() => setTab(t)}
              className="tab-btn"
            >
              {t === 'overview' ? '👤 Profile' : t === 'history' ? `📋 History${recs.length > 0 ? ` (${recs.length})` : ''}` : '⚙️ Settings'}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {hasProfile ? (
              <>
                {/* Identity grid */}
                <div style={S.card}>
                  <p style={S.sectionLabel}>Your Sahi AI Profile</p>
                  <div style={S.infoGrid}>
                    {[
                      { label: 'Who', value: profile?.who },
                      { label: 'Device', value: profile?.device },
                      { label: 'Budget', value: profile?.budget },
                      { label: 'Skill', value: profile?.skill },
                    ].map(({ label, value }) => value && (
                      <div key={label} style={S.infoBox}>
                        <p style={S.infoLabel}>{label}</p>
                        <p style={S.infoValue}>{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Goals */}
                  {profile?.goals?.length > 0 && (
                    <div style={{ marginTop: 14 }}>
                      <p style={S.infoLabel}>Goals</p>
                      <div style={S.tagWrap}>
                        {profile.goals.map((g, i) => <span key={i} style={S.goalTag}>{g}</span>)}
                      </div>
                    </div>
                  )}

                  {/* Struggles */}
                  {profile?.struggles?.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <p style={S.infoLabel}>Challenges</p>
                      <div style={S.tagWrap}>
                        {profile.struggles.map((s, i) => <span key={i} style={S.struggleTag}>{s}</span>)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Retake */}
                <button style={S.retakeBtn} className="retake-btn" onClick={() => window.location.href = '/'}>
                  🔄 Get new recommendations
                </button>
              </>
            ) : (
              /* No profile yet */
              <div style={S.card}>
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <p style={{ fontSize: 32, marginBottom: 12 }}>🎯</p>
                  <p style={{ fontSize: 16, fontWeight: 600, color: '#c4b5fd', marginBottom: 8 }}>No profile yet</p>
                  <p style={{ fontSize: 13, color: '#4b3f72', marginBottom: 20, lineHeight: 1.6 }}>
                    Complete the questionnaire to get your personalized AI toolkit and save your profile.
                  </p>
                  <button style={S.cta} className="cta-btn" onClick={() => window.location.href = '/'}>
                    Start questionnaire →
                  </button>
                </div>
              </div>
            )}

            {/* Security card */}
            <div style={{ ...S.card, background: '#031a0e', borderColor: '#14532d' }}>
              <p style={{ fontSize: 13, color: '#4ade80', fontWeight: 600, marginBottom: 6 }}>🔒 Your data is safe</p>
              <p style={{ fontSize: 12, color: '#86efac', lineHeight: 1.7 }}>
                All your data is protected with Supabase Row Level Security. Only you can see your profile and history. We never sell or share your data.
              </p>
            </div>
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {tab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {recs.length === 0 ? (
              <div style={S.card}>
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <p style={{ fontSize: 32, marginBottom: 12 }}>📋</p>
                  <p style={{ fontSize: 15, color: '#4b3f72', marginBottom: 16 }}>No searches yet</p>
                  <button style={S.cta} className="cta-btn" onClick={() => window.location.href = '/'}>
                    Get your first recommendations →
                  </button>
                </div>
              </div>
            ) : recs.map(rec => (
              <div key={rec.id} style={S.card}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 11, color: '#4b3f72', marginBottom: 4 }}>
                      {new Date(rec.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p style={{ fontSize: 13, color: '#9d8ec4', fontStyle: 'italic', lineHeight: 1.5 }}>
                      "{rec.problem?.slice(0, 80)}{rec.problem?.length > 80 ? '...' : ''}"
                    </p>
                  </div>
                  <button
                    style={S.deleteBtn}
                    className="delete-btn"
                    onClick={() => deleteHistory(rec.id)}
                    title="Delete"
                  >✕</button>
                </div>

                {/* Tool pills */}
                <div style={S.tagWrap}>
                  {rec.results?.map((r, j) => (
                    <span key={j} style={{ ...S.goalTag, fontSize: 11 }}>
                      {r.tool} <span style={{ color: '#fbbf24', marginLeft: 4 }}>{r.confidence}%</span>
                    </span>
                  ))}
                </div>

                {/* Expand toggle */}
                <button
                  style={S.expandBtn}
                  className="expand-btn"
                  onClick={() => setExpanded(expanded === rec.id ? null : rec.id)}
                >
                  {expanded === rec.id ? '▲ Hide details' : '▼ Show details'}
                </button>

                {/* Expanded detail */}
                {expanded === rec.id && rec.results && (
                  <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {rec.results.map((r, j) => (
                      <div key={j} style={{ background: '#0d0520', borderRadius: 12, padding: '12px 14px', border: '1px solid #2a1f4a' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <p style={{ fontSize: 15, fontWeight: 700, color: '#f5f3ff', fontFamily: "'Cormorant Garamond', serif" }}>{r.tool}</p>
                          <span style={{ fontSize: 12, color: '#fbbf24', fontWeight: 600 }}>{r.confidence}% match</span>
                        </div>
                        <p style={{ fontSize: 12, color: '#6b5fa0', lineHeight: 1.6, marginBottom: 8 }}>{r.reason}</p>
                        <div style={{ background: '#130d2e', borderRadius: 8, padding: '8px 10px', border: '1px solid #2a1f4a' }}>
                          <p style={{ fontSize: 10, color: '#fbbf24', fontWeight: 700, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.8 }}>First step</p>
                          <p style={{ fontSize: 12, color: '#c4b5fd' }}>{r.firstStep}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Notifications */}
            <div style={S.card}>
              <p style={S.sectionLabel}>Preferences</p>
              <div style={S.settingRow}>
                <div>
                  <p style={{ fontSize: 14, color: '#e2d9f3', fontWeight: 600 }}>🔔 Tool update notifications</p>
                  <p style={{ fontSize: 12, color: '#4b3f72', marginTop: 2 }}>Get notified when better tools are found for you</p>
                </div>
                <div
                  style={{ ...S.toggle, background: notif ? '#7c3aed' : '#2a1f4a' }}
                  onClick={() => setNotif(n => !n)}
                  className="toggle"
                >
                  <div style={{ ...S.toggleDot, transform: notif ? 'translateX(20px)' : 'translateX(0)' }} />
                </div>
              </div>
              {editing === false && (
                <button
                  style={{ ...S.retakeBtn, marginTop: 14 }}
                  className="retake-btn"
                  onClick={saveProfile}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : '✓ Save preferences'}
                </button>
              )}
              {saveMsg && <p style={{ fontSize: 12, color: '#4ade80', marginTop: 8 }}>{saveMsg}</p>}
            </div>

            {/* Account */}
            <div style={S.card}>
              <p style={S.sectionLabel}>Account</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={S.infoBox}>
                  <p style={S.infoLabel}>Email</p>
                  <p style={S.infoValue}>{user?.email}</p>
                </div>
                <div style={S.infoBox}>
                  <p style={S.infoLabel}>Member since</p>
                  <p style={S.infoValue}>
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Danger zone */}
            <div style={{ ...S.card, borderColor: '#7f1d1d', background: '#1c0a0a' }}>
              <p style={{ fontSize: 11, color: '#f87171', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>Account Actions</p>
              <button style={S.logoutBtnFull} className="logout-full-btn" onClick={logout}>
                Sign out of Sahi AI
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  page:         { minHeight: '100vh', background: 'radial-gradient(ellipse at 20% 20%, #1e0a4a 0%, #0a0618 50%, #0d0520 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: "'DM Sans', sans-serif", color: '#e2d9f3' },
  wrap:         { maxWidth: 560, width: '100%' },
  orb:          { width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #fbbf24)', margin: '0 auto' },
  topNav:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0 24px 0' },
  logoMark:     { fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#7c3aed', textTransform: 'uppercase' },
  navHome:      { background: 'transparent', border: 'none', color: '#4b3f72', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'color 0.2s' },
  logoutBtn:    { background: 'transparent', border: '1px solid #2a1f4a', borderRadius: 10, padding: '7px 14px', color: '#4b3f72', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' },
  heroCard:     { background: '#130d2e', border: '1px solid #2a1f4a', borderRadius: 20, padding: '20px 22px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 16 },
  avatarWrap:   { position: 'relative', flexShrink: 0 },
  avatar:       { width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#fff' },
  activeDot:    { position: 'absolute', bottom: 2, right: 2, width: 10, height: 10, borderRadius: '50%', background: '#4ade80', border: '2px solid #130d2e' },
  displayName:  { fontSize: 17, fontWeight: 700, color: '#f5f3ff', fontFamily: "'Cormorant Garamond', serif" },
  nameInput:    { background: '#0d0520', border: '1px solid #7c3aed', borderRadius: 8, padding: '6px 10px', fontSize: 15, color: '#f5f3ff', fontFamily: "'DM Sans', sans-serif", outline: 'none', width: '100%' },
  editBtn:      { background: 'transparent', border: '1px solid #2a1f4a', borderRadius: 10, padding: '7px 14px', color: '#a78bfa', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", flexShrink: 0, transition: 'all 0.2s' },
  saveBtn:      { background: '#1e0a4a', border: '1px solid #7c3aed', borderRadius: 10, padding: '7px 14px', color: '#c084fc', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", flexShrink: 0, transition: 'all 0.2s' },
  statsRow:     { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 },
  statBox:      { background: '#130d2e', border: '1px solid #2a1f4a', borderRadius: 14, padding: '14px', textAlign: 'center' },
  tabs:         { display: 'flex', gap: 8, marginBottom: 16 },
  tab:          { flex: 1, padding: '10px 6px', borderRadius: 12, border: '1px solid #2a1f4a', background: '#130d2e', color: '#4b3f72', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' },
  tabActive:    { background: '#1e0a4a', borderColor: '#7c3aed', color: '#c084fc' },
  card:         { background: '#130d2e', border: '1px solid #2a1f4a', borderRadius: 18, padding: '20px 22px' },
  sectionLabel: { fontSize: 11, color: '#7c3aed', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 },
  infoGrid:     { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  infoBox:      { background: '#0d0520', borderRadius: 10, padding: '10px 12px', border: '1px solid #2a1f4a' },
  infoLabel:    { fontSize: 10, color: '#4b3f72', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  infoValue:    { fontSize: 13, color: '#c4b5fd', fontWeight: 600 },
  tagWrap:      { display: 'flex', flexWrap: 'wrap' as const, gap: 6 },
  goalTag:      { fontSize: 12, padding: '4px 10px', background: '#1e0a4a', border: '1px solid #7c3aed', borderRadius: 100, color: '#c084fc' },
  struggleTag:  { fontSize: 12, padding: '4px 10px', background: '#2d0a1e', border: '1px solid #db2777', borderRadius: 100, color: '#f472b6' },
  retakeBtn:    { width: '100%', padding: '13px', borderRadius: 14, border: '1px solid #3b1f8a', background: '#1e0a4a', color: '#a78bfa', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' },
  cta:          { background: 'linear-gradient(135deg, #7c3aed 0%, #d97706 100%)', color: '#fff', border: 'none', borderRadius: 14, padding: '13px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' },
  deleteBtn:    { background: 'transparent', border: 'none', color: '#4b3f72', fontSize: 16, cursor: 'pointer', padding: '0 0 0 12px', lineHeight: 1, transition: 'color 0.2s', flexShrink: 0 },
  expandBtn:    { background: 'transparent', border: 'none', color: '#4b3f72', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginTop: 10, padding: 0, transition: 'color 0.2s' },
  settingRow:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 },
  toggle:       { width: 44, height: 24, borderRadius: 100, cursor: 'pointer', transition: 'background 0.3s', position: 'relative', flexShrink: 0 },
  toggleDot:    { position: 'absolute', top: 3, left: 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'transform 0.3s' },
  logoutBtnFull:{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #7f1d1d', background: 'transparent', color: '#f87171', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' },
}

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;600;700&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0a0618; }
  .nav-btn:hover { color: #a78bfa !important; }
  .logout-btn:hover { border-color: #f87171 !important; color: #f87171 !important; }
  .edit-btn:hover { border-color: #7c3aed !important; color: #c084fc !important; }
  .tab-btn:hover { color: #a78bfa !important; }
  .cta-btn:hover { transform: scale(1.02); box-shadow: 0 0 24px #7c3aed55; }
  .retake-btn:hover { background: #2d1b69 !important; }
  .delete-btn:hover { color: #f87171 !important; }
  .expand-btn:hover { color: #a78bfa !important; }
  .toggle:hover { opacity: 0.85; }
  .logout-full-btn:hover { background: #450a0a !important; }
  .name-input:focus { box-shadow: 0 0 0 3px #7c3aed22; }
  @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:0.7} }
  .pulse-orb { animation: pulse 1.5s ease-in-out infinite; }
`