export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #2a1f4a', background: '#0a0618', padding: '48px 24px 32px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>सही</div>
              <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display', serif", background: 'linear-gradient(135deg, #c084fc, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Sahi AI</span>
            </div>
            <p style={{ fontSize: 13, color: '#4b3f72', lineHeight: 1.7, maxWidth: 200 }}>India's personalized AI tool finder. Built with ❤️ for every Indian.</p>
            <p style={{ fontSize: 12, color: '#3b2f5a', marginTop: 12 }}>🇮🇳 Made in India</p>
          </div>

          {/* Product */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>Product</p>
            {[['How it works', '/how-it-works'], ['Find my tools', '/'], ['Create profile', '/auth'], ['My profile', '/profile']].map(([label, href]) => (
              <a key={label} href={href} style={{ display: 'block', fontSize: 13, color: '#6b5fa0', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#c084fc')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6b5fa0')}>
                {label}
              </a>
            ))}
          </div>

          {/* Company */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>Company</p>
            {[['About us', '/about'], ['Contact', '/contact'], ['Privacy policy', '/privacy'], ['Terms of service', '/terms']].map(([label, href]) => (
              <a key={label} href={href} style={{ display: 'block', fontSize: 13, color: '#6b5fa0', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#c084fc')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6b5fa0')}>
                {label}
              </a>
            ))}
          </div>

          {/* Languages */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>Languages</p>
            <p style={{ fontSize: 13, color: '#6b5fa0', marginBottom: 8 }}> English</p>
            <p style={{ fontSize: 13, color: '#6b5fa0', marginBottom: 8 }}> हिंदी</p>
            <p style={{ fontSize: 11, color: '#3b2f5a', marginTop: 16 }}>More Indian languages coming soon!</p>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid #2a1f4a', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12, color: '#3b2f5a' }}>© 2026 Sahi AI. All rights reserved.</p>
          <p style={{ fontSize: 12, color: '#3b2f5a' }}>Built for 1.4 billion Indians 🇮🇳</p>
        </div>
      </div>
    </footer>
  )
}