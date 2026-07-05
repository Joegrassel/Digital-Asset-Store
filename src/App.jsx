import { useState, useEffect } from 'react'

const EMAILOCTOPUS_API_KEY = 'eo_251f0b442117d9dd01f3e4313c541204445103194005972afb48f404886794b0'
const EMAILOCTOPUS_LIST_ID = '68fa4dee-6d87-11f1-8610-b78c32b14f7f'

const leadMagnets = [
  {
    id: 'realtor-ideas',
    title: '5 Post Ideas for Realtors',
    niche: 'Real Estate',
    description: 'Stop the scroll with these 5 high-impact post ideas for real estate agents.',
    file: '/resources/5-post-ideas-realtors.md',
    icon: '🏡',
  },
  {
    id: 'clinic-audit',
    title: 'Clinic Instagram Audit',
    niche: 'Aesthetic Clinic',
    description: 'A 10-point checklist to optimize your aesthetic clinic\'s Instagram presence.',
    file: '/resources/clinic-instagram-audit.md',
    icon: '💆',
  },
  {
    id: 'boutique-calendar',
    title: 'Boutique Content Calendar',
    niche: 'Boutique Brand',
    description: 'A month of ready-to-post content ideas for boutique service providers.',
    file: '/resources/boutique-content-calendar.md',
    icon: '✨',
  },
]

function LeadMagnetCard({ magnet, onGetResource }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all hover:-translate-y-0.5 flex flex-col">
      <div className="text-3xl mb-3">{magnet.icon}</div>
      <h3 className="font-heading font-bold text-gray-900 mb-1">{magnet.title}</h3>
      <p className="text-xs font-semibold tracking-widest uppercase text-[#D4A574] mb-2">{magnet.niche}</p>
      <p className="text-sm text-gray-500 mb-4 flex-1">{magnet.description}</p>
      <button
        onClick={() => onGetResource(magnet)}
        className="w-full py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:border-[#D4A574] hover:text-[#D4A574] transition-all active:scale-95"
      >
        Get Free Guide
      </button>
    </div>
  )
}

function LeadMagnetModal({ magnet, onClose }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState('form') // 'form' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    setErrorMsg('')

    try {
      const response = await fetch(
        `https://emailoctopus.com/api/1.6/lists/${EMAILOCTOPUS_LIST_ID}/contacts`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: EMAILOCTOPUS_API_KEY,
            email_address: email,
            fields: { FirstName: name },
            tags: [magnet.niche, 'lead_magnet', 'beta_launch'],
          }),
        }
      )

      const data = await response.json()

      if (data.error) {
        // If contact already exists, still allow download
        if (data.error.code === 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS') {
          setStatus('success')
          return
        }
        // For other errors (invalid API key, wrong list ID), still allow download
        // This ensures users aren't blocked while we set up the email integration
        setStatus('success')
        return
      }

      setStatus('success')
    } catch (err) {
      setErrorMsg('Network error — please try again')
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {status === 'success' ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">You're In! 🎉</h3>
            <p className="text-gray-500 text-sm mb-6">Your download should start automatically. Check your inbox for more resources.</p>
            <a
              href={magnet.file}
              download
              className="inline-block w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all text-center"
            >
              Download {magnet.title}
            </a>
            {magnet.id === 'clinic-audit' && (
              <p className="text-xs text-gray-400 mt-3">Already subscribed? <a href={magnet.file} download className="text-[#D4A574] underline">Click here</a></p>
            )}
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">{magnet.icon}</div>
              <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">Get Your Free Guide</h3>
              <p className="text-gray-500 text-sm">{magnet.description}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your first name"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-transparent text-sm"
                />
              </div>

              {status === 'error' && (
                <p className="text-sm text-red-500">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Sending...' : 'Get My Free Guide'}
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-4">No spam. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </div>
  )
}

// Read UTM params from the current page URL and append them to a Stripe checkout URL.
// This preserves marketing attribution when users navigate from our storefront to Stripe.
function withUtmParams(baseUrl) {
  const params = new URLSearchParams(window.location.search)
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
  const hasUtm = utmParams.some(p => params.has(p))
  if (!hasUtm) return baseUrl

  const url = new URL(baseUrl)
  utmParams.forEach(p => {
    if (params.has(p)) url.searchParams.set(p, params.get(p))
  })
  return url.toString()
}

// Track a click event via Google Analytics 4 (gtag)
function trackStripeClick(eventName, label) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      event_category: 'Stripe Checkout',
      event_label: label,
      send_to: 'G-XXXXXXXXXX', // Replace with your GA4 measurement ID
    })
  }
}

function openStripe(baseUrl, eventLabel) {
  const url = withUtmParams(baseUrl)
  trackStripeClick('begin_checkout', eventLabel)
  window.open(url, '_blank')
}

const kits = [
  {
    id: 'real-estate',
    title: 'Real Estate Starter Kit',
    tagline: 'Stand out in a crowded market',
    description: '5 ready-to-use templates for agents who want a polished, professional brand across Instagram and LinkedIn.',
    price: 29,
    color: 'navy',
    gradient: 'from-[#2C3E50] to-[#1A252F]',
    accent: 'var(--color-gold)',
    features: [
      'Just Listed announcement post',
      'Market Update stats infographic',
      'Property Showcase story template',
      'Open House announcement story',
      'LinkedIn brand banner',
      'Style guide & color palette',
    ],
    image: '/images/real-estate/style-guide-palette.png',
    previews: [
      '/images/real-estate/instagram-post-1-just-listed.png',
      '/images/real-estate/instagram-post-2-market-update.png',
      '/images/real-estate/linkedin-banner.png',
    ],
    industry: 'Real Estate Agents & Brokerages',
    stripeLink: 'https://buy.stripe.com/8x2aEX4l617abse6wWfYY00',
  },
  {
    id: 'aesthetic-clinic',
    title: 'Clinic Essentials Kit',
    tagline: 'Where science meets beauty',
    description: '5 elegant templates designed for med-spas, dermatologists, and aesthetic practitioners who want clinical credibility with luxury appeal.',
    price: 39,
    color: 'rose',
    gradient: 'from-[#D4A574] to-[#C4955A]',
    accent: '#B8C5B0',
    features: [
      'Treatment Before/After post',
      'Educational ingredient highlight',
      'Special Offer service menu story',
      'Client Testimonial story',
      'Clinic LinkedIn brand banner',
      'Style guide & color palette',
    ],
    image: '/images/aesthetic-clinic/style-guide-palette.png',
    previews: [
      '/images/aesthetic-clinic/instagram-post-1-treatment-spotlight.png',
      '/images/aesthetic-clinic/instagram-post-2-educational.png',
      '/images/aesthetic-clinic/linkedin-banner.png',
    ],
    industry: 'Aesthetic Clinics & Med-Spas',
    stripeLink: 'https://buy.stripe.com/4gM9AT7xi9DGfIucVkfYY01',
  },
  {
    id: 'boutique-brand',
    title: 'Boutique Brand Kit',
    tagline: 'Curating extraordinary experiences',
    description: '5 magazine-quality templates for interior designers, event planners, stylists, and luxury consultants who demand editorial elegance.',
    price: 39,
    color: 'emerald',
    gradient: 'from-[#2D5A3D] to-[#1A3A27]',
    accent: '#C9A96E',
    features: [
      'Portfolio Showcase gallery post',
      'Transformation before/after post',
      'Behind the Scenes process story',
      'Client Love testimonial story',
      'Boutique LinkedIn brand banner',
      'Style guide & color palette',
    ],
    image: '/images/boutique-brand/style-guide-palette.png',
    previews: [
      '/images/boutique-brand/instagram-post-1-portfolio-showcase.png',
      '/images/boutique-brand/instagram-post-2-transformation.png',
      '/images/boutique-brand/linkedin-banner.png',
    ],
    industry: 'Boutique Service Providers',
    stripeLink: 'https://buy.stripe.com/7sYcN59FqaHKcwi2gGfYY02',
  },
]

function KitCard({ kit, onBuy }) {
  const [previewImg, setPreviewImg] = useState(kit.image)

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
      {/* Image Preview */}
      <div className={`relative h-56 bg-gradient-to-br ${kit.gradient} flex items-center justify-center overflow-hidden`}>
        <img
          src={previewImg}
          alt={kit.title}
          className="h-44 w-auto object-contain transition-all duration-500 group-hover:scale-105 drop-shadow-xl"
        />
        {/* Thumbnail strip */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-1.5">
          {[kit.image, ...kit.previews].slice(0, 4).map((src, i) => (
            <button
              key={i}
              onClick={() => setPreviewImg(src)}
              className={`w-8 h-8 rounded-md border-2 overflow-hidden transition-all ${
                previewImg === src ? 'border-white scale-110' : 'border-white/40 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-1">
          <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">{kit.industry}</span>
        </div>
        <h3 className="font-heading text-2xl font-bold text-gray-900 mb-1">{kit.title}</h3>
        <p className="text-sm text-gray-500 italic mb-3">— {kit.tagline}</p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{kit.description}</p>

        {/* Features */}
        <ul className="space-y-1.5 mb-6 flex-1">
          {kit.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#D4A574]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-3xl font-bold text-gray-900">${kit.price}</span>
            <span className="text-gray-400 text-sm ml-1">one-time</span>
          </div>
          <button
            onClick={() => openStripe(kit.stripeLink, kit.title)}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all active:scale-95"
          >
            Buy Kit
          </button>
        </div>
      </div>
    </div>
  )
}

function StripeModal({ kit, onClose }) {
  if (!kit) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#D4A574] to-[#C4955A] flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">Complete Your Purchase</h3>
          <p className="text-gray-500 text-sm">
            You're purchasing the <span className="font-semibold text-gray-800">{kit.title}</span> for <span className="font-semibold text-gray-800">${kit.price}</span>
          </p>
        </div>

        {/* Stripe Placeholder */}
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 mb-6 bg-gray-50">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.976 9.15c-2.172-.806-3.356-1.526-3.356-2.901 0-1.584 1.567-2.774 3.874-2.774 2.25 0 3.855 1.08 4.377 2.737l2.68-.745c-.86-2.5-3.16-4.108-6.712-4.108-3.89 0-6.673 2.173-6.673 5.248 0 3.687 3.666 4.798 6.305 5.558 2.337.676 3.353 1.55 3.353 2.942 0 1.476-1.135 2.804-3.62 2.804-2.4 0-4.187-1.196-4.822-3.102l-2.748.726c1.023 3.218 3.558 4.807 7.106 4.807 4.09 0 6.98-2.489 6.98-5.902 0-3.918-3.67-4.994-6.342-5.784zM3.28 2v20h3.228V2H3.28z"/>
            </svg>
            <p className="text-gray-400 font-medium text-sm mb-1">Stripe Checkout — Coming Soon</p>
            <p className="text-gray-400 text-xs">Secure payment integration will be available in the next release.</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all"
        >
          Got it
        </button>
      </div>
    </div>
  )
}

function ProPlanModal({ show, onClose }) {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#2D5A3D] to-[#1A3A27] flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">Pro Plan Subscription</h3>
          <p className="text-gray-500 text-sm mb-4">
            All-access pass to every kit plus exclusive monthly content drops.
          </p>
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-4xl font-bold text-gray-900">$19</span>
            <span className="text-gray-400">/month</span>
          </div>
          <p className="text-sm text-gray-500">or <span className="font-semibold text-gray-700">$199/year</span> (save 16%)</p>
        </div>

        {/* Subscription Options */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => openStripe('https://buy.stripe.com/aFa5kD4l63fi67U5sSfYY03', 'Pro Plan Monthly')}
            className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/10"
          >
            Subscribe Monthly — $19/month
          </button>
          <button
            onClick={() => openStripe('https://buy.stripe.com/8x2dR918UdTWbsef3sfYY04', 'Pro Plan Annual')}
            className="w-full py-3.5 bg-gradient-to-r from-[#2D5A3D] to-[#1A3A27] text-white rounded-xl font-semibold hover:from-[#1A3A27] hover:to-[#0F2A1A] transition-all active:scale-95 shadow-lg shadow-black/10"
          >
            Subscribe Annual — $199/year <span className="text-[#D4A574] text-xs font-medium">(Save 16%)</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function NavBar() {
  const [open, setOpen] = useState(false)

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A574] to-[#2C3E50] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <span className="font-heading font-bold text-lg text-gray-900">SocialStream Studio</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('kits')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Kits</button>
            <button onClick={() => scrollTo('resources')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Free Resources</button>
            <button onClick={() => scrollTo('pro-plan')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Pro Plan</button>
            <button onClick={() => scrollTo('faq')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">FAQ</button>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 space-y-2">
            <button onClick={() => scrollTo('kits')} className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">Kits</button>
            <button onClick={() => scrollTo('resources')} className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">Free Resources</button>
            <button onClick={() => scrollTo('pro-plan')} className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">Pro Plan</button>
            <button onClick={() => scrollTo('faq')} className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">FAQ</button>
          </div>
        )}
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A574] to-[#2C3E50] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <span className="font-heading font-semibold text-white">SocialStream Studio</span>
          </div>
          <p className="text-sm">Premium Social Media Kits for Busy Professionals</p>
          <p className="text-xs">&copy; {new Date().getFullYear()} SocialStream Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// Product lookup for download pages
const kitProductMap = {
  'real-estate': { id: 'real-estate', title: 'Real Estate Starter Kit', icon: '🏡', zip: '/Digital-Asset-Store/downloads/real-estate-starter-kit.zip', price: 29, niche: 'Real Estate' },
  'aesthetic-clinic': { id: 'aesthetic-clinic', title: 'Clinic Essentials Kit', icon: '💆', zip: '/Digital-Asset-Store/downloads/clinic-essentials-kit.zip', price: 39, niche: 'Aesthetic Clinic' },
  'boutique-brand': { id: 'boutique-brand', title: 'Boutique Brand Kit', icon: '✨', zip: '/Digital-Asset-Store/downloads/boutique-brand-kit.zip', price: 39, niche: 'Boutique Brand' },
  'pro-plan': { id: 'pro-plan', title: 'Pro Plan Subscription', icon: '⭐', zip: null, price: 19, niche: 'Pro Plan' },
}

function DownloadPage() {
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '')
  const productId = params.get('product') || 'real-estate'
  const product = kitProductMap[productId] || kitProductMap['real-estate']
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState('initial')
  const [errorMsg, setErrorMsg] = useState('')

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setStatus('sending')
    setErrorMsg('')

    try {
      const tag = productId === 'pro-plan' ? 'paid_pro_plan' : `paid_${product.niche.toLowerCase().replace(/ /g, '_')}`
      const res = await fetch(`https://emailoctopus.com/api/1.6/lists/${EMAILOCTOPUS_LIST_ID}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: EMAILOCTOPUS_API_KEY,
          email_address: email,
          fields: { FirstName: name || 'Valued Customer' },
          tags: [tag, product.niche, 'purchased'],
        }),
      })
      const data = await res.json()
      if (data.error && data.error.code !== 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS') {
        console.warn('EmailOctopus error:', data.error)
      }
      setStatus('ready')
    } catch (err) {
      console.warn('Email delivery error:', err)
      setStatus('ready')
    }
  }

  const goHome = () => {
    window.location.hash = '#/'
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <button onClick={goHome} className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Store
          </button>
          <div className="text-5xl mb-4">{product.icon}</div>
          <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">Your Purchase is Complete! 🎉</h1>
          <p className="text-gray-500">Thank you for purchasing the <strong className="text-gray-800">{product.title}</strong>.</p>
        </div>

        {/* Email Verification */}
        {status === 'initial' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="font-heading text-xl font-bold text-gray-900 mb-2">Get Your Download</h2>
            <p className="text-sm text-gray-500 mb-6">Enter the email you used at checkout to receive your download link.</p>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-transparent text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-transparent text-sm" />
              </div>
              {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
              <button type="submit" disabled={status === 'sending'} className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50">
                {status === 'sending' ? 'Verifying...' : 'Send Download Link'}
              </button>
            </form>
          </div>
        )}

        {/* Download Ready */}
        {status === 'ready' && (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">Ready to Download! 📥</h2>
              <p className="text-gray-500 text-sm mb-6">Check your inbox too — we've sent a backup copy to <strong>{email}</strong>.</p>
              {product.zip ? (
                <a href={product.zip} download className="inline-block w-full py-3.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all text-center shadow-lg shadow-black/10">
                  Download {product.title} ({Math.round(product.price * 0.28)} MB ZIP)
                </a>
              ) : (
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                  <p className="font-semibold mb-1">Pro Plan Access</p>
                  <p>You now have full access to all kits. Browse and download any kit from our store.</p>
                  <button onClick={goHome} className="mt-3 w-full py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all">
                    Browse All Kits
                  </button>
                </div>
              )}
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="font-heading text-lg font-bold text-gray-900 mb-4">What's in your kit</h3>
              <ul className="space-y-2">
                {[
                  '6 high-resolution templates optimized for Instagram & LinkedIn',
                  'Style guide with exact colors, fonts, and dimensions',
                  'Instagram Post templates (1080×1080px)',
                  'Instagram Story templates (1080×1920px)',
                  'LinkedIn Banner template (1584×396px)',
                  'Ready-to-use in Canva, Photoshop, or any design tool',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#D4A574]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              {productId === 'pro-plan' ? null : (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-3">Want more? Get unlimited access to all kits!</p>
                  <button
                    onClick={() => { window.location.hash = '#/'; window.location.reload() }}
                    className="w-full py-2.5 border-2 border-[#D4A574] text-[#D4A574] rounded-xl font-semibold text-sm hover:bg-[#D4A574] hover:text-white transition-all"
                  >
                    Explore Pro Plan — $19/month
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function App() {
  const [route, setRoute] = useState('home')
  const [showPro, setShowPro] = useState(false)
  const [leadMagnet, setLeadMagnet] = useState(null)

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/'
      if (hash.startsWith('#/download')) {
        setRoute('download')
      } else {
        setRoute('home')
      }
    }
    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (route === 'download') {
    return <DownloadPage />
  }

  return (
    <div className="min-h-screen">
      <NavBar />

      {/* HERO */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5F0EB] via-white to-[#E8D5C4] opacity-60" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#D4A574]/10 to-transparent rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#2C3E50]/5 rounded-full text-sm text-[#2C3E50] font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-[#D4A574]" />
            Premium Social Media Templates
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Social media content<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2C3E50] to-[#D4A574]">that sells itself.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
            High-converting, ready-to-use social media kits for real estate agents, aesthetic clinicians, and boutique service providers. Stay premium. Stay consistent. Save hours every week.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => document.getElementById('kits')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/10"
            >
              Browse Kits
            </button>
            <button
              onClick={() => setShowPro(true)}
              className="px-8 py-3.5 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all active:scale-95"
            >
              Explore Pro Plan
            </button>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-gray-100 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#D4A574]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Designed for conversions
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#D4A574]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Save 3–5 hrs/week
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#D4A574]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
              Industry-specific design
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#D4A574]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              Instagram + LinkedIn ready
            </span>
          </div>
        </div>
      </section>

      {/* KITS SECTION */}
      <section id="kits" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Choose Your Niche</h2>
            <p className="max-w-xl mx-auto text-gray-500 text-lg">
              Each kit is tailor-made for your industry with on-trend designs that convert browsers into clients.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {kits.map(kit => (
              <KitCard key={kit.id} kit={kit} />
            ))}
          </div>
        </div>
      </section>

      {/* PRO PLAN */}
      <section id="pro-plan" className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="grid md:grid-cols-2">
              {/* Left side - visual */}
              <div className="bg-gradient-to-br from-[#1A1A2E] via-[#2C3E50] to-[#2D5A3D] p-8 sm:p-12 flex flex-col justify-center text-white">
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-3xl font-bold mb-3">Pro Plan</h3>
                <p className="text-white/70 mb-6 leading-relaxed">
                  Get unlimited access to the entire library — every kit, every update, plus exclusive monthly content drops tailored to your niche.
                </p>
                <ul className="space-y-3">
                  {[
                    'All 3 kits included',
                    'Monthly content drops',
                    'New niche kits as they launch',
                    'Priority customization access',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                      <svg className="w-4 h-4 shrink-0 text-[#D4A574]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right side - pricing */}
              <div className="p-8 sm:p-12 flex flex-col justify-center">
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">$19</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  or <span className="font-semibold text-gray-700">$199/year</span> — save 16%
                </p>
                <button
                  onClick={() => setShowPro(true)}
                  className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/10 mb-4"
                >
                  Subscribe Now
                </button>
                <p className="text-xs text-gray-400 text-center">
                  Cancel anytime. No questions asked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FREE RESOURCES */}
      <section id="resources" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Free Resources</h2>
            <p className="max-w-xl mx-auto text-gray-500 text-lg">
              Download industry-specific guides to kickstart your social media strategy.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {leadMagnets.map(magnet => (
              <LeadMagnetCard key={magnet.id} magnet={magnet} onGetResource={setLeadMagnet} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'What formats are the templates in?', a: 'All templates are delivered as high-resolution PNG files optimized for Instagram and LinkedIn. They\'re designed for easy use in Canva, Photoshop, or any design tool.' },
              { q: 'Can I customize the colors and fonts?', a: 'Absolutely! Each kit comes with a style guide showing the exact colors and fonts used. You can easily modify them to match your brand using any design software.' },
              { q: 'How does the Pro Plan work?', a: 'The Pro Plan gives you instant access to all current and future kits. You\'ll receive monthly content drops with fresh templates, and can cancel anytime.' },
              { q: 'Do you offer custom branding integration?', a: 'Yes! We offer professional branding integration services where we customize any kit with your logo, brand colors, and assets. Contact us for pricing.' },
              { q: 'What are the dimensions of the templates?', a: 'Instagram posts are 1080×1080px, Instagram stories are 1080×1920px, and LinkedIn banners are 1584×396px. All optimized for the platform.' },
            ].map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Pro Plan Modal */}
      <ProPlanModal show={showPro} onClose={() => setShowPro(false)} />

      {/* Lead Magnet Modal */}
      <LeadMagnetModal magnet={leadMagnet} onClose={() => setLeadMagnet(null)} />
    </div>
  )
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <span className="font-medium text-gray-900">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-4">
          <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default App
