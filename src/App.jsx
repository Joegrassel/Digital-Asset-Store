import { useState } from 'react'

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

function ProPlanModal({ onClose }) {
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

function App() {
  const [showPro, setShowPro] = useState(false)

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
