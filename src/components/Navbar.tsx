'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;600;700&display=swap');
        .nav-link { color: #7c6fa0; font-size: 14px; font-weight: 500; text-decoration: none; transition: color 0.2s; font-family: 'DM Sans', sans-serif; }
        .nav-link:hover { color: #c084fc; }
        .nav-cta:hover { transform: scale(1.03); box-shadow: 0 0 20px #7c3aed44; }
        .hamburger:hover { opacity: 0.7; }
        .mobile-link { color: #a78bfa; font-size: 16px; font-weight: 500; text-decoration: none; padding: 12px 0; border-bottom: 1px solid #2a1f4a; display: block; font-family: 'DM Sans', sans-serif; transition: color 0.2s; }
        .mobile-link:hover { color: #f5f3ff; }
      `}</style>

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(10, 6, 24, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid #2a1f4a' : 'none',
        transition: 'all 0.3s ease',
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>सही</div>
            <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display', serif", background: 'linear-gradient(135deg, #c084fc, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Sahi AI</span>
          </a>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
            <a href="/how-it-works" className="nav-link">How it works</a>
            <a href="/about" className="nav-link">About</a>
            <a href="/contact" className="nav-link">Contact</a>
          </div>

          {/* Desktop CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="desktop-nav">
            {user ? (
              <a href="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>
                  {user.email?.[0].toUpperCase()}
                </div>
                <span className="nav-link">Profile</span>
              </a>
            ) : (
              <>
                <a href="/auth" className="nav-link">Log in</a>
                <a href="/" style={{ background: 'linear-gradient(135deg, #7c3aed, #d97706)', color: '#fff', padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }} className="nav-cta">
                  Get Started →
                </a>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <div style={{ width: 22, height: 2, background: '#a78bfa', marginBottom: 5, transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <div style={{ width: 22, height: 2, background: '#a78bfa', marginBottom: 5, opacity: menuOpen ? 0 : 1, transition: 'all 0.2s' }} />
            <div style={{ width: 22, height: 2, background: '#a78bfa', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: '#130d2e', borderTop: '1px solid #2a1f4a', padding: '16px 24px 24px' }}>
            <a href="/how-it-works" className="mobile-link">How it works</a>
            <a href="/about" className="mobile-link">About</a>
            <a href="/contact" className="mobile-link">Contact</a>
            {user ? (
              <a href="/profile" className="mobile-link">My Profile</a>
            ) : (
              <>
                <a href="/auth" className="mobile-link">Log in</a>
                <a href="/" style={{ display: 'block', marginTop: 16, background: 'linear-gradient(135deg, #7c3aed, #d97706)', color: '#fff', padding: '12px 20px', borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: 'none', textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}>
                  Get Started →
                </a>
              </>
            )}
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </>
  )
}