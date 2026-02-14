import { useState, useEffect } from 'react'
import './LoveCalculator.css'
import elemeBanner from '../assets/eleme-bole-banner.jpeg'

export default function LoveCalculator() {
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [loveScore, setLoveScore] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [hearts, setHearts] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [promo, setPromo] = useState(null)
  const [promoVisible, setPromoVisible] = useState(true)
  const [leaderboardVisible, setLeaderboardVisible] = useState(false)
  const [advertVisible, setAdvertVisible] = useState(true)

  const calculateLoveScore = () => {
    if (!name1.trim() || !name2.trim()) {
      alert('Please enter both names!')
      return
    }

    setIsCalculating(true)
    
    // Create a love score based on the combined length and character codes
    const combined = (name1 + name2).toLowerCase()
    let score = 0
    
    for (let char of combined) {
      score += char.charCodeAt(0)
    }
    
    score = (score % 101)
    
    // Add some randomness but keep it somewhat consistent
    const bonus = Math.abs(name1.length - name2.length) * 2
    const finalScore = Math.min(100, (score + bonus) % 101)

    // Generate floating hearts animation
    const newHearts = []
    for (let i = 0; i < 15; i++) {
      newHearts.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1
      })
    }
    setHearts(newHearts)

    // Animate score counting
    setTimeout(() => {
      setLoveScore(finalScore)
      setIsCalculating(false)
      // If score is above 95, add to leaderboard (persisted in localStorage)
      if (finalScore > 95) {
        const entry = {
          names: `${name1.trim()} + ${name2.trim()}`,
          score: finalScore,
          date: new Date().toISOString(),
        }
        setLeaderboard((prev) => {
          const merged = [entry, ...prev]
          // keep highest scores first and only top 5
          merged.sort((a, b) => b.score - a.score || new Date(a.date) - new Date(b.date))
          const top5 = merged.slice(0, 5)
          try {
            localStorage.setItem('love_leaderboard', JSON.stringify(top5))
          } catch (e) {
            // ignore storage errors
          }
          return top5
        })
      }
      // If score is above 96, create a promo for ELEME BOLE FEST
      if (finalScore > 96) {
        const code = String(Math.floor(10000 + Math.random() * 90000))
        const promoObj = {
          code,
          names: `${name1.trim()} + ${name2.trim()}`,
          score: finalScore,
          event: 'ELEME BOLE FEST',
          slogan: 'for the CULTURE',
          discount: 20,
          date: new Date().toISOString(),
        }
        setPromo(promoObj)
        setPromoVisible(true)
        try { localStorage.setItem('love_latest_promo', JSON.stringify(promoObj)); localStorage.removeItem('promo_closed') } catch (e) {}
      } else {
        setPromo(null)
      }
    }, 1500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      calculateLoveScore()
    }
  }

  const resetCalculator = () => {
    setName1('')
    setName2('')
    setLoveScore(null)
    setHearts([])
  }

  const shareWhatsApp = () => {
    const base = window.location.href
    const msg = `Our Love Score is ${loveScore}% — ${name1} + ${name2}. Check it out: ${base}`
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank', 'noopener')
  }

  const shareFacebook = () => {
    const base = window.location.href
    const quote = `Our Love Score is ${loveScore}% — ${name1} + ${name2}.`
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(base)}&quote=${encodeURIComponent(quote)}`
    window.open(url, '_blank', 'noopener')
  }

  useEffect(() => {
    try {
      const saved = localStorage.getItem('love_leaderboard')
      if (saved) setLeaderboard(JSON.parse(saved))
    } catch (e) {
      // ignore parse errors
    }
    try {
      const p = localStorage.getItem('love_latest_promo')
      if (p) setPromo(JSON.parse(p))
    } catch (e) {}
    try {
      const closed = localStorage.getItem('promo_closed')
      if (closed === '1') setPromoVisible(false)
    } catch (e) {}
    // auto-hide site visit advert after 5s
    const timer = setTimeout(() => setAdvertVisible(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  const toggleLeaderboard = () => setLeaderboardVisible(v => !v)

  const closePromo = () => {
    setPromoVisible(false)
    try { localStorage.setItem('promo_closed', '1') } catch (e) {}
  }

  const closeAdvert = () => setAdvertVisible(false)

  const getScoreMessage = (score) => {
    if (score >= 90) return "🔥 Absolutely Destined Together! 🔥"
    if (score >= 80) return "💕 Perfect Match Made in Heaven 💕"
    if (score >= 70) return "💖 Deeply in Love 💖"
    if (score >= 60) return "💝 Strong Connection 💝"
    if (score >= 50) return "🌹 There's Chemistry Here 🌹"
    if (score >= 40) return "💕 Growing Attraction 💕"
    return "🌟 Keep Getting to Know Each Other 🌟"
  }

  return (
    <div className="love-calculator-wrapper">
      {advertVisible && (
        <div className="visit-advert">
          <a href="https://wa.me/2348085982336" target="_blank" rel="noopener noreferrer" className="visit-ad-link">
            <img src={elemeBanner} alt="ELEME BOLE FEST" className="visit-ad-image" />
          </a>
          <button className="visit-ad-close" onClick={closeAdvert} aria-label="Close advert">✕</button>
        </div>
      )}


      {loveScore !== null && (
        <a href="https://wa.me/2348085982336" target="_blank" rel="noopener noreferrer" className="slanted-banner-card">
          <img src={elemeBanner} alt="ELEME BOLE FEST" className="slanted-banner-img" />
        </a>
      )}

      <div className="love-calculator">
        <div className="header">
          <h1 className="title">💕 Love Calculator 💕</h1>
          <p className="subtitle">Discover Your Love Compatibility Score</p>
        </div>

        {loveScore === null ? (
          <div className="input-section">
            <div className="input-group">
              <label htmlFor="name1">Your Name</label>
              <input
                id="name1"
                type="text"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your name"
                className="input-field"
              />
            </div>

            <div className="heart-divider">💗</div>

            <div className="input-group">
              <label htmlFor="name2">Partner's Name</label>
              <input
                id="name2"
                type="text"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter their name"
                className="input-field"
              />
            </div>

            <button
              onClick={calculateLoveScore}
              disabled={isCalculating}
              className={`calculate-btn ${isCalculating ? 'calculating' : ''}`}
            >
              {isCalculating ? 'Calculating...' : 'Calculate Love Score ❤️'}
            </button>
          </div>
        ) : (
          <div className="result-section">
            {loveScore > 96 && (
              <div className="screenshot-note">Please screenshot this page to claim your 20% discount at the event.</div>
            )}
            <div className="hearts-animation">
              <span>💕</span>
              <span>💖</span>
              <span>💗</span>
            </div>

            <div className="score-container">
              <h2 className="score-label">Love Score</h2>
              <div className="score-circle">
                <span className="score-number">{loveScore}</span>
                <span className="score-percent">%</span>
              </div>
            </div>

            <div className="names-result">
              <p className="result-names">
                <span className="name fancy-name">{name1}</span>
                <span className="plus">+</span>
                <span className="name fancy-name">{name2}</span>
              </p>
            </div>

            <p className="score-message">{getScoreMessage(loveScore)}</p>

            <div className="progress-bar-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${loveScore}%` }}
                />
              </div>
            </div>

            <button
              onClick={resetCalculator}
              className="reset-btn"
            >
              Try Another Couple 💑
            </button>

            <div className="share-buttons">
              <button className="share-btn share-whatsapp" onClick={shareWhatsApp} aria-label="Share on WhatsApp">Share on WhatsApp</button>
              <button className="share-btn share-facebook" onClick={shareFacebook} aria-label="Share on Facebook">Share on Facebook</button>
            </div>

            {promo && (
              <div className="promo-card">
                <div className="promo-flowers">
                  {[...Array(6)].map((_, i) => (
                    <span key={i} className={`flower flower-${i}`}>🌸</span>
                  ))}
                </div>

                <div className="promo-content">
                  <div className="festival-message">
                    {loveScore >= 80 ? (
                      <p>Your love is doing incredibly well! Join us at Eleme Global Fest on <strong>Feb 15, 2026</strong> to make it even stronger together.</p>
                    ) : (
                      <p>Your love can be improved! Spend quality time at Eleme Global Fest on <strong>Feb 15, 2026</strong> to help your bond grow.</p>
                    )}
                  </div>
                  <div className="promo-score-display">{loveScore}%</div>
                  <h3 className="event-name">{promo.event}</h3>
                  <p className="event-slogan">{promo.slogan}</p>
                  <p className="promo-discount">Tickets are available!</p>

                  <div className="promo-names">
                    <span className="fancy-name promo-name-left">{name1}</span>
                    <span className="promo-plus">&amp;</span>
                    <span className="fancy-name promo-name-right">{name2}</span>
                  </div>

                  <div className="promo-action">
                    <a href="https://wa.me/2348085982336" target="_blank" rel="noopener noreferrer" className="buy-tickets-btn">Buy Tickets</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="footer-text">
          ✨ Made with Love on Valentine's Day ✨
        </div>
      </div>

      {/* Leaderboard toggle button and sliding panel */}
      <button className="leaderboard-toggle" onClick={toggleLeaderboard} aria-expanded={leaderboardVisible} aria-controls="leaderboard-panel">Top 5 ❤️</button>

      <aside id="leaderboard-panel" className={`leaderboard-panel ${leaderboardVisible ? 'open' : ''}`} role="dialog" aria-label="Top love scores">
        <button className="leaderboard-close" onClick={() => setLeaderboardVisible(false)} aria-label="Close leaderboard">✕</button>
        <h4 className="leaderboard-title">Top 5 Lover</h4>
        {leaderboard && leaderboard.length > 0 ? (
          <ol className="leaderboard-list">
            {leaderboard.map((entry, idx) => (
              <li key={idx} className="leaderboard-item">
                <span className="entry-names">{entry.names}</span>
                <span className="entry-score">{entry.score}%</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="no-entries">No top scores yet — get a score above 95%!</p>
        )}
      </aside>
    </div>
  )
}
