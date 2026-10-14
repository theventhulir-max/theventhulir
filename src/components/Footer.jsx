'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ArrowRight, 
  CheckCircle2, 
  Leaf, 
  ShieldCheck, 
  Truck, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Instagram, 
  Facebook,
  Droplets
} from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const { t, isTamil } = useLanguage();

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 6000);
    }, 600);
  };

  const handleLink = (path, hash) => {
    if (path.includes('#') && (pathname === '/home' || pathname === '/')) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(path);
    }
  };

  return (
    <footer className="footer-luxury">
      {/* ── TOP TRUST PILLARS STRIP ── */}
      <div className="footer-trust-strip">
        <div className="footer-container">
          <div className="trust-pillars-grid">
            <div className="trust-pillar-item">
              <div className="trust-pillar-icon">
                <Droplets size={22} />
              </div>
              <div className="trust-pillar-content">
                <h4>Wood Cold-Pressed</h4>
                <p>Extracted in Vaagai wood churns below 40°C</p>
              </div>
            </div>

            <div className="trust-pillar-item">
              <div className="trust-pillar-icon">
                <ShieldCheck size={22} />
              </div>
              <div className="trust-pillar-content">
                <h4>100% Pure & Unrefined</h4>
                <p>Zero chemicals, solvents, or artificial aromas</p>
              </div>
            </div>

            <div className="trust-pillar-item">
              <div className="trust-pillar-icon">
                <Leaf size={22} />
              </div>
              <div className="trust-pillar-content">
                <h4>Single-Origin Harvest</h4>
                <p>Direct from native Tamil Nadu organic farms</p>
              </div>
            </div>

            <div className="trust-pillar-item">
              <div className="trust-pillar-icon">
                <Truck size={22} />
              </div>
              <div className="trust-pillar-content">
                <h4>Farm to Doorstep</h4>
                <p>Fresh batch dispatched in UV-safe containers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN FOOTER CONTENT ── */}
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Column 1: Brand & Heritage */}
            <div className="footer-brand-col">
              <Link href="/" className="footer-brand-logo">
                <img src="/logo.png" alt="Venthulir Logo" className="footer-brand-img" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                <span className="brand-name">VENTHULIR</span>
              </Link>
              <div className="footer-tamil-sub">தூய மரச்செக்கு எண்ணெய் & இயற்கை விளைச்சல்</div>
              <p className="footer-about-text">
                Pure wood cold-pressed oils & traditional spices directly from our organic farms in Tamil Nadu.
              </p>

              <div className="footer-social-row">
                <a 
                  href="https://instagram.com/venthulir" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-pill-btn"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
                <a 
                  href="https://facebook.com/venthulir" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-pill-btn"
                  aria-label="Facebook"
                >
                  <Facebook size={16} />
                </a>
                <a 
                  href="https://wa.me/918778476414" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-pill-btn whatsapp"
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={16} />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-nav-col">
              <h4 className="footer-col-title">Quick Links</h4>
              <ul className="footer-links-list">
                <li>
                  <button onClick={() => router.push('/products?category=Cold-Pressed Oils')}>
                    Cold-Pressed Oils
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/products?category=Spices & Powders')}>
                    Traditional Spices
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/products')}>
                    All Products
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLink('/home#why-choose', '#why-choose')}>
                    Our Story
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/profile')}>
                    My Account
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div className="footer-nav-col">
              <h4 className="footer-col-title">Contact Us</h4>
              <div className="footer-contact-details">
                <a href="tel:+918778476414" className="contact-item">
                  <Phone size={15} className="contact-icon" />
                  <span>+91 87784 76414</span>
                </a>
                <a href="mailto:theventhulir@gmail.com" className="contact-item">
                  <Mail size={15} className="contact-icon" />
                  <span>theventhulir@gmail.com</span>
                </a>
                <div className="contact-item">
                  <MapPin size={15} className="contact-icon" />
                  <span>Tamil Nadu, India</span>
                </div>
              </div>
            </div>

            {/* Column 4: Newsletter */}
            <div className="footer-newsletter-col">
              <h4 className="footer-col-title">Stay Connected</h4>
              <p className="footer-newsletter-desc">
                Subscribe for exclusive offers and harvest updates.
              </p>
              {subscribed ? (
                <div className="newsletter-success-state">
                  <CheckCircle2 size={16} />
                  <span>Thank you for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="newsletter-clean-form">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" disabled={submitting} aria-label="Subscribe">
                    <ArrowRight size={15} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. PERFECTED LUXURY DELIVERY HIGHWAY & TRUCK STAGE ── */}
      <div className="footer-animation-stage theme-pollachi-express">
        {/* Subtle Organic Scenery Backdrop */}
        <div className="anim-scenery-backdrop" aria-hidden="true">
          <svg className="scenery-svg" viewBox="0 0 1440 140" preserveAspectRatio="xMidYMax slice" fill="none">
            <defs>
              {/* Golden Morning Sky Gradient */}
              <linearGradient id="morningSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="50%" stopColor="#FEF3C7" />
                <stop offset="85%" stopColor="#ECFDF5" />
                <stop offset="100%" stopColor="#D1FAE5" />
              </linearGradient>

              {/* Sun Glow */}
              <radialGradient id="morningSun" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#FDE047" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
              </radialGradient>

              {/* Distant Ghats Mountain Ridge */}
              <linearGradient id="ghatsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#64748B" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#475569" stopOpacity="0.75" />
              </linearGradient>

              {/* Midground Lush Farmlands */}
              <linearGradient id="midGrovesGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4ADE80" />
                <stop offset="100%" stopColor="#15803D" />
              </linearGradient>

              {/* Foreground Emerald Harvest Groves */}
              <linearGradient id="foreGrovesGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="40%" stopColor="#16A34A" />
                <stop offset="100%" stopColor="#0B331F" />
              </linearGradient>
            </defs>

            {/* Sky */}
            <rect width="1440" height="140" fill="url(#morningSky)" />

            {/* Morning Sun */}
            <circle cx="1200" cy="36" r="42" fill="url(#morningSun)" />

            {/* Layer 1: Distant Western Ghats Mountain Silhouette */}
            <path
              d="M0 68 Q180 38 380 58 T820 46 T1260 52 T1440 42 L1440 140 L0 140 Z"
              fill="url(#ghatsGrad)"
            />

            {/* Layer 2: Midground Rolling Organic Farmlands */}
            <path
              d="M0 84 Q260 62 560 78 T1060 68 T1440 76 L1440 140 L0 140 Z"
              fill="url(#midGrovesGrad)"
            />

            {/* Layer 3: Foreground Emerald Plantation Hills */}
            <path
              d="M0 98 Q320 86 700 96 T1240 88 T1440 94 L1440 140 L0 140 Z"
              fill="url(#foreGrovesGrad)"
            />

            {/* Detailed Natural Tropical Coconut Palms */}
            {/* Palm 1 */}
            <g transform="translate(75, 42) scale(0.95)">
              <path d="M12 68 Q15 32 10 0" stroke="#78350F" strokeWidth="3" fill="none" strokeLinecap="round" />
              <circle cx="10" cy="0" r="2.8" fill="#451A03" />
              <circle cx="8" cy="2" r="2" fill="#D97706" />
              <circle cx="12" cy="2" r="2" fill="#D97706" />
              <path d="M10 0 Q-12 -12 -22 6" stroke="#15803D" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              <path d="M10 0 Q2 -16 -8 -18" stroke="#16A34A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
              <path d="M10 0 Q20 -18 32 -10" stroke="#15803D" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              <path d="M10 0 Q30 -6 38 12" stroke="#16A34A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            </g>

            {/* Palm 2 */}
            <g transform="translate(340, 36) scale(1.1)">
              <path d="M14 74 Q10 36 13 0" stroke="#5F2C0B" strokeWidth="3.2" fill="none" strokeLinecap="round" />
              <circle cx="13" cy="0" r="3" fill="#381A05" />
              <circle cx="11" cy="2.5" r="2.2" fill="#D97706" />
              <circle cx="15" cy="2.5" r="2.2" fill="#D97706" />
              <path d="M13 0 Q-15 -14 -26 6" stroke="#16A34A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
              <path d="M13 0 Q-2 -20 -10 -22" stroke="#22C55E" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              <path d="M13 0 Q24 -22 36 -12" stroke="#16A34A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
              <path d="M13 0 Q34 -8 42 14" stroke="#22C55E" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            </g>

            {/* Palm 3 */}
            <g transform="translate(740, 40) scale(1.0)">
              <path d="M12 70 Q16 34 11 0" stroke="#78350F" strokeWidth="3" fill="none" strokeLinecap="round" />
              <circle cx="11" cy="0" r="2.8" fill="#451A03" />
              <circle cx="9" cy="2" r="2" fill="#D97706" />
              <circle cx="13" cy="2" r="2" fill="#D97706" />
              <path d="M11 0 Q-13 -12 -22 8" stroke="#15803D" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              <path d="M11 0 Q1 -17 -8 -19" stroke="#16A34A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
              <path d="M11 0 Q21 -19 32 -9" stroke="#15803D" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              <path d="M11 0 Q30 -6 38 12" stroke="#16A34A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            </g>

            {/* Palm 4 */}
            <g transform="translate(1180, 34) scale(1.15)">
              <path d="M15 76 Q11 38 14 0" stroke="#5F2C0B" strokeWidth="3.2" fill="none" strokeLinecap="round" />
              <circle cx="14" cy="0" r="3.2" fill="#381A05" />
              <circle cx="12" cy="2.5" r="2.4" fill="#D97706" />
              <circle cx="16" cy="2.5" r="2.4" fill="#D97706" />
              <path d="M14 0 Q-17 -15 -28 7" stroke="#16A34A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M14 0 Q-3 -22 -12 -24" stroke="#22C55E" strokeWidth="2.3" fill="none" strokeLinecap="round" />
              <path d="M14 0 Q26 -24 38 -13" stroke="#16A34A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M14 0 Q36 -9 46 15" stroke="#22C55E" strokeWidth="2.3" fill="none" strokeLinecap="round" />
            </g>
          </svg>
        </div>

        {/* Highway Asphalt Track */}
        <div className="anim-road-track">
          <div className="road-surface">
            <div className="road-dashed-lines" />
          </div>
        </div>

        {/* ── GLEAMING PEARL WHITE & GOLD LUXURY DELIVERY TRUCK ── */}
        <div className="anim-moving-vehicle" title="Venthulir Express - Farm to Doorstep in 24 Hours">
          <div className="vehicle-speech-bubble">
            <span className="bubble-live-dot" />
            <span>🚚 Same Day Dispatch</span>
          </div>

          <div className="van-vehicle">
            <svg viewBox="0 0 240 85" className="van-svg" fill="none">
              <defs>
                {/* Pearl White Body Gradient */}
                <linearGradient id="pearlWhiteBody" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="60%" stopColor="#F8FAFC" />
                  <stop offset="100%" stopColor="#E2E8F0" />
                </linearGradient>

                {/* Metallic Gold Accent Gradient */}
                <linearGradient id="goldFoilGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#B45309" />
                  <stop offset="35%" stopColor="#F59E0B" />
                  <stop offset="65%" stopColor="#FDE68A" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>

                {/* Deep Forest Green Decal Gradient */}
                <linearGradient id="greenDecalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#062B19" />
                  <stop offset="50%" stopColor="#0B331F" />
                  <stop offset="100%" stopColor="#14532D" />
                </linearGradient>

                {/* Headlight Beam Cone */}
                <linearGradient id="headlightBeam" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
                  <stop offset="40%" stopColor="#FEF08A" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
                </linearGradient>

                {/* Official Logo Circular Clip */}
                <clipPath id="truckLogoClip">
                  <circle cx="36" cy="36" r="8" />
                </clipPath>
              </defs>

              {/* Headlight Beam Cone Shining Ahead on Road */}
              <polygon points="214,48 240,36 240,64 214,54" fill="url(#headlightBeam)" />

              {/* Vehicle Ground Contact Shadow */}
              <ellipse cx="115" cy="74" rx="98" ry="6" fill="#000000" fillOpacity="0.35" />

              {/* Main Cargo Container Body (Crisp Pearl White) */}
              <rect x="18" y="16" width="140" height="48" rx="4" fill="url(#pearlWhiteBody)" stroke="#CBD5E1" strokeWidth="1.2" />

              {/* Cargo Side Luxury Emerald & Gold Banner */}
              <rect x="22" y="24" width="132" height="24" rx="3" fill="url(#greenDecalGrad)" />

              {/* Aerodynamic Front Driver Cabin */}
              <path
                d="M158 24 L185 24 Q198 24 206 35 L215 48 Q219 54 219 61 L219 64 L158 64 Z"
                fill="url(#pearlWhiteBody)"
                stroke="#CBD5E1"
                strokeWidth="1.2"
              />

              {/* Front Sapphire Windshield Glass Background */}
              <path
                d="M164 28 L182 28 Q192 28 198 37 L206 48 L164 48 Z"
                fill="#E0F2FE"
                stroke="#BAE6FD"
                strokeWidth="0.8"
              />

              {/* ── Delivery Driver Character Inside Cabin ── */}
              <g id="truckDriver">
                {/* Driver Torso / Venthulir Green Uniform */}
                <path
                  d="M167 48 L167 42 Q174 40 181 42 L181 48 Z"
                  fill="#1B5E2F"
                />
                {/* Uniform Collar */}
                <polygon points="172,41 174,44 176,41" fill="#FFFFFF" />

                {/* Driver Head / Face */}
                <circle cx="174" cy="36.5" r="3.2" fill="#F59E0B" />

                {/* Delivery Cap (Crown + Visor) */}
                <ellipse cx="174" cy="34" rx="3.6" ry="2.2" fill="#0B331F" />
                <path d="M173 34.5 Q178 33 181 35.5 L175 36.2 Z" fill="#062B19" />

                {/* Steering Wheel */}
                <ellipse
                  cx="187"
                  cy="43.5"
                  rx="1.8"
                  ry="5"
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="1.4"
                  transform="rotate(-20 187 43.5)"
                />
                {/* Steering Center Hub */}
                <circle cx="187" cy="43.5" r="1.2" fill="#475569" />

                {/* Driver Hands on Steering Wheel */}
                <circle cx="185.5" cy="42" r="1.1" fill="#F59E0B" />
                <circle cx="186" cy="45.5" r="1.1" fill="#F59E0B" />
              </g>

              {/* Front Windshield Glass Highlight Overlay (Crystal Glare) */}
              <path
                d="M164 28 L182 28 Q192 28 198 37 L206 48 L164 48 Z"
                fill="url(#sapphireGlass)"
                opacity="0.35"
              />
              <line x1="172" y1="30" x2="192" y2="46" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.4" strokeLinecap="round" />

              {/* Dual Gold Foil Luxury Accent Pinstripes */}
              <rect x="18" y="50" width="201" height="3" fill="url(#goldFoilGrad)" />
              <rect x="18" y="55" width="201" height="1.2" fill="#D97706" fillOpacity="0.8" />

              {/* Lower Emerald Bumper Skirt */}
              <rect x="18" y="58" width="201" height="4" fill="#062B19" />

              {/* Official Venthulir Brand Logo Emblem */}
              <circle cx="36" cy="36" r="8" fill="#FFFFFF" stroke="url(#goldFoilGrad)" strokeWidth="1.2" />
              <image
                href="/logo.png"
                x="28.5"
                y="28.5"
                width="15"
                height="15"
                preserveAspectRatio="xMidYMid meet"
                clipPath="url(#truckLogoClip)"
              />

              {/* Brand Typography */}
              <text
                x="48"
                y="35"
                fill="#FFFFFF"
                fontSize="9.5"
                fontFamily="'Cinzel', serif"
                fontWeight="800"
                letterSpacing="1.8"
              >
                VENTHULIR
              </text>
              <text
                x="48"
                y="43"
                fill="#FDE68A"
                fontSize="5.5"
                fontFamily="'Plus Jakarta Sans', sans-serif"
                fontWeight="700"
                letterSpacing="0.6"
              >
                MARACHEKKU &bull; FARM DIRECT
              </text>

              {/* Front Bright LED Headlight & Rear Red LED Taillight */}
              <polygon points="215,50 219,50 219,56 215,56" fill="#FDE047" stroke="#CA8A04" strokeWidth="0.5" />
              <polygon points="18,50 20,50 20,56 18,56" fill="#EF4444" />

              {/* Wheel Well Arches */}
              <path d="M40 64 A18 18 0 0 1 74 64 Z" fill="#0F172A" />
              <path d="M168 64 A18 18 0 0 1 202 64 Z" fill="#0F172A" />

              {/* Rear Wheel (High-Precision Rotating Alloy) */}
              <g>
                <animateTransform attributeName="transform" type="rotate" from="0 57 65" to="360 57 65" dur="0.55s" repeatCount="indefinite" />
                <circle cx="57" cy="65" r="15" fill="#1E293B" stroke="#475569" strokeWidth="1.2" />
                <circle cx="57" cy="65" r="9.5" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.2" />
                <circle cx="57" cy="65" r="4.5" fill="#0F172A" />
                <circle cx="57" cy="65" r="2.5" fill="#D97706" />
                <line x1="49" y1="65" x2="65" y2="65" stroke="#475569" strokeWidth="1.8" />
                <line x1="57" y1="57" x2="57" y2="73" stroke="#475569" strokeWidth="1.8" />
                <line x1="51.5" y1="59.5" x2="62.5" y2="70.5" stroke="#475569" strokeWidth="1.8" />
                <line x1="51.5" y1="70.5" x2="62.5" y2="59.5" stroke="#475569" strokeWidth="1.8" />
              </g>

              {/* Front Wheel (High-Precision Rotating Alloy) */}
              <g>
                <animateTransform attributeName="transform" type="rotate" from="0 185 65" to="360 185 65" dur="0.55s" repeatCount="indefinite" />
                <circle cx="185" cy="65" r="15" fill="#1E293B" stroke="#475569" strokeWidth="1.2" />
                <circle cx="185" cy="65" r="9.5" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.2" />
                <circle cx="185" cy="65" r="4.5" fill="#0F172A" />
                <circle cx="185" cy="65" r="2.5" fill="#D97706" />
                <line x1="177" y1="65" x2="193" y2="65" stroke="#475569" strokeWidth="1.8" />
                <line x1="185" y1="57" x2="185" y2="73" stroke="#475569" strokeWidth="1.8" />
                <line x1="179.5" y1="59.5" x2="190.5" y2="70.5" stroke="#475569" strokeWidth="1.8" />
                <line x1="179.5" y1="70.5" x2="190.5" y2="59.5" stroke="#475569" strokeWidth="1.8" />
              </g>
            </svg>
          </div>
        </div>
      </div>



      {/* ── 3. BOTTOM BAR ── */}
      <div className="footer-bottom-bar">
        <div className="footer-container">
          <div className="footer-bottom-flex">
            <div className="footer-copyright-wrap">
              <p>&copy; {new Date().getFullYear()} Venthulir Natural Harvests. All rights reserved.</p>
              <span className="fssai-pill">
                <ShieldCheck size={13} />
                <span>FSSAI Lic. No. 12423002001892</span>
              </span>
            </div>

            <div className="footer-bottom-links">
              <Link href="/privacy">Privacy Policy</Link>
              <span className="dot-sep">•</span>
              <Link href="/terms">Terms of Service</Link>
              <span className="dot-sep">•</span>
              <button onClick={() => router.push('/profile?tab=help')} className="inline-help-link">
                Help & Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
