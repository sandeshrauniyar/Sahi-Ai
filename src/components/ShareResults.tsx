'use client'

type ShareProps = {
  tools: string[]
  lang: 'english' | 'hindi'
}

export default function ShareResults({ tools, lang }: ShareProps) {
  const isHindi = lang === 'hindi'

  const shareText = isHindi
    ? `🎯 Sahi AI ने मेरे लिए ये AI टूल्स recommend किए:\n\n${tools.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n👉 अपने लिए फ्री में ढूंढें: https://sahiai.in`
    : `🎯 Sahi AI recommended these AI tools for me:\n\n${tools.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\nFind yours free at: https://sahiai.in`

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText)
    alert(isHindi ? '✅ कॉपी हो गया!' : '✅ Copied to clipboard!')
  }

  return (
    <div style={{ marginTop: 24, background: '#130d2e', border: '1px solid #2a1f4a', borderRadius: 16, padding: '20px 22px', fontFamily: "'DM Sans', sans-serif" }}>
      <p style={{ fontSize: 13, color: '#7c3aed', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
        {isHindi ? '📤 दोस्तों के साथ शेयर करें' : '📤 Share your results'}
      </p>
      <p style={{ fontSize: 13, color: '#6b5fa0', marginBottom: 16, lineHeight: 1.6 }}>
        {isHindi ? 'अपने दोस्तों को भी बताएं — Sahi AI उनके लिए भी सबसे अच्छे टूल्स ढूंढेगा!' : 'Help your friends find their perfect AI tools too!'}
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>

        {/* WhatsApp */}
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 12, background: '#052e16', border: '1px solid #16a34a', color: '#4ade80', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#065f46' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#052e16' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#4ade80"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </a>

        {/* Twitter/X */}
        <a href={twitterUrl} target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 12, background: '#0c1a2e', border: '1px solid #1d4ed8', color: '#60a5fa', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1e3a5f' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#0c1a2e' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#60a5fa"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
          Share on X
        </a>

        {/* Copy link */}
        <button onClick={copyToClipboard}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 12, background: '#1a1035', border: '1px solid #3b1f8a', color: '#a78bfa', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#2d1b69' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#1a1035' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          {isHindi ? 'कॉपी करें' : 'Copy link'}
        </button>
      </div>
    </div>
  )
}