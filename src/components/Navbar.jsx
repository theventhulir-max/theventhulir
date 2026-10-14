'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useUIModal } from '@/components/Providers';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Search, 
  Heart, 
  ChevronDown, 
  Sparkles, 
  Flame, 
  ArrowRight,
  ShieldCheck,
  Truck,
  PhoneCall,
  Gift,
  Star,
  Plus,
  Check,
  TrendingUp,
  Package,
  MapPin,
  Globe
} from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onAuthOpen, onSearchOpen }) {
  const { cartCount, setIsCartOpen, addToCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, toggleLanguage, t, isTamil } = useLanguage();
  const uiModal = useUIModal?.() || null;

  const QUICK_CATEGORIES = [
    { id: 'all',          name: t('catAll', 'All Harvest'),       emoji: '🌿' },
    { id: 'spices',       name: t('catSpices', 'Spices & Powders'),  emoji: '🌶️', filter: 'Spices & Powders' },
    { id: 'masalas',      name: t('catMasalas', 'Heritage Masalas'),  emoji: '🍲', filter: 'Masala Blends' },
  ];

  const ANNOUNCEMENTS = [
    { text: t('announcement1', '🌿 100% Certified Organic & Single-Origin Direct from Farms'), icon: ShieldCheck },
    { text: t('announcement2', '🚚 Free Express Delivery Across India on Orders Above ₹499'), icon: Truck },
    { text: t('announcement3', '✨ Farm Fresh Harvest — Wood Cold-Pressed & Stone Ground'), icon: Sparkles },
    { text: t('announcement4', '💬 Instant WhatsApp Order: +91 94861 45001'), icon: PhoneCall },
  ];

  const TRENDING_SEARCHES = isTamil ? [
    'மஞ்சள் பொடி',
    'மிளகாய் பொடி',
    'மல்லி பொடி',
    'சாம்பார் பொடி',
    'கரம் மசாலா'
  ] : [
    'Turmeric Powder',
    'Chilli Powder',
    'Coriander Powder',
    'Sambar Powder',
    'Garam Masala'
  ];
  
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [categoryDropOpen, setCategoryDropOpen] = useState(false);
  const [catalog, setCatalog] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [tickerIndex, setTickerIndex] = useState(0);
  const [addedItemKey, setAddedItemKey] = useState(null);
  const [mounted, setMounted] = useState(false);

  const dropRef = useRef(null);
  const catDropRef = useRef(null);
  const searchContainerRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    router.prefetch('/products');
    router.prefetch('/home');
    fetch('/api/products?limit=100')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.products)) {
          setCatalog(data.products);
        }
      })
      .catch(() => {});
  }, [router]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleAuthClick = () => {
    setMenuOpen(false);
    router.push('/login');
  };

  // Enhanced fuzzy matching for instant search across live unified catalog
  const searchResults = searchQuery.trim()
    ? catalog.filter((p) => {
        const query = searchQuery.toLowerCase().trim();
        const name = (p.name || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const origin = (p.origin || '').toLowerCase();
        const badge = (p.badge || '').toLowerCase();
        
        // Match tokens
        const tokens = query.split(/\s+/).filter(Boolean);
        return tokens.every((token) => {
          if (name.includes(token) || cat.includes(token) || desc.includes(token) || origin.includes(token) || badge.includes(token)) {
            return true;
          }
          if ((token === 'chili' || token === 'chilli') && (name.includes('chilli') || name.includes('chili') || desc.includes('chilli'))) {
            return true;
          }
          if ((token === 'oil' || token === 'oils') && (cat.includes('oil') || name.includes('oil'))) {
            return true;
          }
          if ((token === 'turmeric' || token === 'manjal' || token === 'haldi') && (name.includes('turmeric') || desc.includes('curcumin'))) {
            return true;
          }
          if ((token === 'sambar' || token === 'masala') && (name.includes('sambar') || name.includes('masala') || cat.includes('masala'))) {
            return true;
          }
          return false;
        });
      })
    : [];

  // Rotate announcement ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Prefetch critical customer routes for 0ms instantaneous navigation
  useEffect(() => {
    if (router?.prefetch) {
      router.prefetch('/profile');
      router.prefetch('/login');
      router.prefetch('/products');
      router.prefetch('/checkout');
    }
  }, [router]);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const close = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setUserOpen(false);
      if (catDropRef.current && !catDropRef.current.contains(e.target)) setCategoryDropOpen(false);
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('touchstart', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('touchstart', close);
    };
  }, []);

  // Instant live search submit handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchFocused(false);
      setMenuOpen(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleProductSelect = (product) => {
    setSearchFocused(false);
    setSearchQuery('');
    setMenuOpen(false);
    router.push(`/products?search=${encodeURIComponent(product.name)}`);
  };

  const handleQuickAdd = (e, product) => {
    e.stopPropagation();
    addToCart(product, product.variants?.[0] || null);
    setAddedItemKey(product._id);
    setTimeout(() => setAddedItemKey(null), 1500);
  };

  // Instant category quick filter handler
  const handleCategorySelect = (cat) => {
    setActiveCategory(cat.id);
    setCategoryDropOpen(false);
    setMenuOpen(false);
    if (cat.filter) {
      router.push(`/products?category=${encodeURIComponent(cat.filter)}`);
    } else {
      router.push('/products');
    }
  };

  const navigateToSection = (sectionId, fallbackUrl) => {
    setMenuOpen(false);
    if (sectionId === 'offers' || sectionId === 'products') {
      router.push('/products');
      return;
    }
    if (sectionId === 'home') {
      if (pathname === '/home' || pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        router.push('/home');
      }
      return;
    }
    if (pathname === '/home' || pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    router.push(fallbackUrl || '/home');
  };

  const activeAnnouncement = ANNOUNCEMENTS[tickerIndex];
  const AnnouncementIcon = activeAnnouncement.icon;

  return (
    <header className={`site-header-wrapper ${scrolled ? 'is-scrolled' : ''}`}>
      
      {/* ── 1. Top High-Trust Announcement Ticker Strip ── */}
      <div className="top-announcement-strip">
        <div className="container announcement-inner">
          <div className="announcement-content">
            <AnnouncementIcon size={14} className="ticker-icon" />
            <span className="ticker-text">{activeAnnouncement.text}</span>
          </div>
          <div className="announcement-quick-links">
            <button 
              type="button" 
              className="announcement-lang-toggle" 
              onClick={toggleLanguage}
              title={isTamil ? 'Switch to English' : 'தமிழுக்கு மாற்றுக'}
            >
              <Globe size={13} />
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
            <span className="divider">|</span>
            <span className="announcement-badge-pill">{t('purityBadge', '100% PURE')}</span>
            <span className="divider">|</span>
            <Link href="/products" prefetch={true} className="quick-link-btn" onClick={() => setMenuOpen(false)}>
              {t('shopFreshHarvest', 'Shop Fresh Harvest')}
            </Link>
            <span className="divider">|</span>
            <a href="https://wa.me/918778476414" target="_blank" rel="noreferrer" className="quick-link-btn highlight">
              {t('whatsappOrder', 'WhatsApp Order')}
            </a>
          </div>
        </div>
      </div>

      {/* ── 2. Main Primary Navbar ── */}
      <nav className="main-navbar">
        <div className="container navbar-content-row">
          
          {/* Brand Logo */}
          <Link href="/home" className="navbar-brand-link" onClick={() => setMenuOpen(false)}>
            <div className="brand-badge-crest">
              <img
                src="/logo.png"
                alt="Venthulir"
                className="brand-logo-img"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="brand-text-stack">
              <span className="brand-name">VENTHULIR</span>
              <span className="brand-tagline">{isTamil ? '100% அசல் இயற்கை விளைபொருட்கள்' : '100% PURE ORGANIC HARVEST'}</span>
            </div>
          </Link>

          {/* High-Converting Integrated Omnisearch with Live Autocomplete Dropdown */}
          <div className="nav-omnisearch-container" ref={searchContainerRef}>
            <form className={`omnisearch-form ${searchFocused ? 'focused' : ''}`} onSubmit={handleSearchSubmit}>
              <Search size={16} className="search-lead-icon" />
              <input
                type="text"
                placeholder={isTamil ? 'மசாலா, எண்ணெய், தேன்...' : 'Search spices, oils, masalas...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchFocused(true);
                }}
                onFocus={() => setSearchFocused(true)}
                onClick={() => setSearchFocused(true)}
                className="omnisearch-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={14} />
                </button>
              )}
              <button type="submit" className="search-submit-btn" aria-label="Submit search">
                <span>{t('search', 'Search')}</span>
              </button>
            </form>

            {/* ── LIVE SEARCH RESULTS DROPDOWN ── */}
            {searchFocused && (
              <div className="search-instant-dropdown">
                
                {/* 1. When user typed query and has results */}
                {searchQuery.trim() && searchResults.length > 0 && (
                  <div className="search-results-list">
                    <div className="search-results-header">
                      <span>{t('matchingResults', 'Matching Organic Harvest')} ({searchResults.length})</span>
                    </div>

                    {searchResults.slice(0, 6).map((p) => {
                      const img = p.images?.[0] || p.imageUrl || p.image;
                      const isAdded = addedItemKey === p._id;
                      return (
                        <div 
                          key={p._id || p.id} 
                          className="search-item-row"
                          onClick={() => handleProductSelect(p)}
                        >
                          <div className="search-item-thumb">
                            {img ? <img src={img} alt={p.name} /> : <span>{p.name[0]}</span>}
                          </div>

                          <div className="search-item-info">
                            <span className="search-item-cat">{p.category || 'Farm Harvest'}</span>
                            <span className="search-item-name">{p.name}</span>
                          </div>

                          <div className="search-item-actions">
                            <div className="search-item-price-group">
                              <span className="search-item-price">₹{p.price}</span>
                              {(p.originalPrice || Math.round(p.price * 1.25)) > p.price && (
                                <span className="search-item-strike-price">₹{p.originalPrice || Math.round(p.price * 1.25)}</span>
                              )}
                            </div>
                            <button
                              type="button"
                              className={`search-item-add-btn ${isAdded ? 'added' : ''}`}
                              onClick={(e) => handleQuickAdd(e, p)}
                              title={t('addToCart', 'Add to Cart')}
                            >
                              {isAdded ? (
                                <>
                                  <Check size={12} />
                                  <span>{t('addedToCart', 'Added')}</span>
                                </>
                              ) : (
                                <>
                                  <Plus size={13} />
                                  <span>{t('addToCart', 'Add')}</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    <Link 
                      href={`/products?search=${encodeURIComponent(searchQuery)}`}
                      className="search-view-all-link"
                      onClick={() => setSearchFocused(false)}
                    >
                      <span>{t('viewAllResults', 'View all results')} ({searchResults.length})</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                )}

                {/* 2. When query returned 0 results */}
                {searchQuery.trim() && searchResults.length === 0 && (
                  <div className="search-no-results">
                    <p className="no-res-title">{t('noResultsFound', 'No organic products found for')} &quot;{searchQuery}&quot;</p>
                    <p className="no-res-sub">{isTamil ? 'இவற்றைத் தேடிப் பாருங்கள்:' : 'Try searching for authentic staples like:'}</p>
                    <div className="search-suggestion-pills">
                      {TRENDING_SEARCHES.map((term) => (
                        <button
                          key={term}
                          type="button"
                          className="suggestion-pill"
                          onClick={() => {
                            setSearchQuery(term);
                          }}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. When search is focused but empty (Trending Searches) */}
                {!searchQuery.trim() && (
                  <div className="search-trending-section">
                    <div className="trending-header">
                      <TrendingUp size={14} className="trending-icon" />
                      <span>{t('trendingHarvest', 'Trending Organic Harvest')}</span>
                    </div>
                    <div className="trending-chips-grid">
                      {TRENDING_SEARCHES.map((term) => (
                        <button
                          key={term}
                          type="button"
                          className="trending-chip-btn"
                          onClick={() => {
                            setSearchQuery(term);
                          }}
                        >
                          <span>{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Desktop Navigation Links */}
          <div className="navbar-nav-group">
            <Link 
              href="/home"
              prefetch={true}
              className="nav-item-btn"
              onClick={(e) => { 
                setMenuOpen(false); 
                if (pathname === '/home' || pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' }); 
                }
              }}
            >
              {t('home', 'Home')}
            </Link>

            <Link 
              href="/products"
              prefetch={true}
              className="nav-item-btn"
              onClick={() => { setMenuOpen(false); }}
            >
              {t('allProducts', 'All Products')}
            </Link>

            {/* Categories Dropdown */}
            <div 
              className="nav-dropdown-wrapper" 
              ref={catDropRef}
              onMouseEnter={() => setCategoryDropOpen(true)}
              onMouseLeave={() => setCategoryDropOpen(false)}
            >
              <button 
                type="button" 
                className={`nav-item-btn with-arrow ${categoryDropOpen ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCategoryDropOpen(v => !v);
                }}
              >
                <span>{t('categories', 'Categories')}</span>
                <ChevronDown size={14} className={`chevron-icon ${categoryDropOpen ? 'rotate' : ''}`} />
              </button>

              {categoryDropOpen && (
                <div className="nav-flyout-menu">
                  <div className="flyout-header">{t('browseCategories', 'Browse Organic Categories')}</div>
                  {QUICK_CATEGORIES.map(cat => (
                    <Link
                      key={cat.id}
                      href={cat.filter ? `/products?category=${encodeURIComponent(cat.filter)}` : '/products'}
                      prefetch={true}
                      className="flyout-item"
                      onClick={() => setCategoryDropOpen(false)}
                    >
                      <span className="flyout-emoji">{cat.emoji}</span>
                      <span className="flyout-name">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* High-Converting Offer Pill */}
            <button 
              type="button" 
              className="nav-offer-pill"
              onClick={() => navigateToSection('offers', '/home#offers')}
            >
              <Flame size={13} className="flame-icon" />
              <span>{t('festiveOffers', 'Festive Offers')}</span>
            </button>
          </div>

          {/* User Actions (Wishlist, Cart, Profile, Language) */}
          <div className="navbar-actions-group">
            
            {/* Desktop Language Switcher */}
            <div className="nav-lang-switcher" title={isTamil ? 'மொழியை மாற்றுக' : 'Choose Language'}>
              <button 
                type="button" 
                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
              <span className="lang-divider">/</span>
              <button 
                type="button" 
                className={`lang-btn ${language === 'ta' ? 'active' : ''}`}
                onClick={() => setLanguage('ta')}
              >
                தமிழ்
              </button>
            </div>

            {/* Wishlist Button */}
            <Link 
              href="/products"
              prefetch={true}
              className="nav-action-icon-btn"
              title={t('wishlist', 'Saved Items')}
            >
              <Heart size={19} />
            </Link>

            {/* Cart Button */}
            <button 
              type="button" 
              className="nav-action-cart-btn" 
              onClick={() => setIsCartOpen(true)}
              title={t('cart', 'Shopping Cart')}
              aria-label="Open Shopping Cart"
            >
              <div className="cart-icon-wrapper">
                <ShoppingBag size={18} />
                {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
              </div>
              <span className="cart-label-text">{t('cart', 'Cart')}</span>
            </button>

            {/* Auth / Account Profile */}
            {isAuthenticated ? (
              <Link href="/profile" className="user-profile-btn" style={{textDecoration: 'none'}}>
                <div className="user-avatar-initial" style={user?.avatar ? { background: 'transparent', padding: 0 } : {}}>
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user?.name || 'User'} 
                      referrerPolicy="no-referrer"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                    />
                  ) : (
                    user?.name?.[0]?.toUpperCase() || <User size={14} />
                  )}
                </div>
                <span className="user-firstname">{user?.name?.split(' ')[0] || t('account', 'Account')}</span>
              </Link>
            ) : (
              <button 
                type="button"
                className="btn-header-signin" 
                onClick={() => {
                  setMenuOpen(false);
                  if (onAuthOpen) {
                    onAuthOpen();
                  } else {
                    router.push('/login');
                  }
                }}
                aria-label="Sign In"
              >
                <User size={15} />
                <span>{t('signIn', 'Sign In')}</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button 
              className="nav-mobile-toggle" 
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Navigation"
              type="button"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>

        </div>
      </nav>

      {/* ── 3. Mobile Drawer Menu via Portal ── */}
      {menuOpen && mounted && typeof document !== 'undefined' && createPortal(
        <div className="mobile-nav-backdrop" onClick={() => setMenuOpen(false)}>
          <div className="mobile-nav-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-panel-header">
              <span className="mobile-brand-title">VENTHULIR</span>
              <button className="mobile-close-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>

            {/* Mobile Search */}
            <form className="mobile-search-form" onSubmit={handleSearchSubmit}>
              <Search size={15} className="mobile-search-icon" />
              <input
                type="text"
                placeholder={t('searchPlaceholder', 'Search organic products...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Mobile Language Selector */}
            <div className="mobile-menu-section mobile-lang-section">
              <span className="mobile-section-label">Language / மொழி</span>
              <div className="mobile-lang-options">
                <button 
                  type="button" 
                  className={`mobile-lang-btn ${language === 'en' ? 'active' : ''}`}
                  onClick={() => setLanguage('en')}
                >
                  <span>English</span>
                  {language === 'en' && <Check size={14} />}
                </button>
                <button 
                  type="button" 
                  className={`mobile-lang-btn ${language === 'ta' ? 'active' : ''}`}
                  onClick={() => setLanguage('ta')}
                >
                  <span>தமிழ்</span>
                  {language === 'ta' && <Check size={14} />}
                </button>
              </div>
            </div>

            {/* Mobile Category List */}
            <div className="mobile-menu-section">
              <span className="mobile-section-label">{t('categories', 'Quick Shop')}</span>
              <div className="mobile-category-grid">
                {QUICK_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className="mobile-category-pill"
                    onClick={() => handleCategorySelect(cat)}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Nav Links */}
            <div className="mobile-menu-section">
              <span className="mobile-section-label">{isTamil ? 'வழிகாட்டல்' : 'Navigation'}</span>
              <button type="button" className="mobile-nav-row" onClick={() => navigateToSection('home', '/home')}>
                <span>{t('home', 'Home')}</span>
                <ChevronDown size={14} style={{ transform: 'rotate(-90deg)', color: '#94a3b8' }} />
              </button>
              <Link href="/products" prefetch={true} className="mobile-nav-row" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>
                <span>{t('allProducts', 'All Products')}</span>
                <ChevronDown size={14} style={{ transform: 'rotate(-90deg)', color: '#94a3b8' }} />
              </Link>
              <Link href="/products" prefetch={true} className="mobile-nav-row" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>
                <span>{t('wishlist', 'Saved Items / Wishlist')}</span>
                <ChevronDown size={14} style={{ transform: 'rotate(-90deg)', color: '#94a3b8' }} />
              </Link>
              <button type="button" className="mobile-nav-row" onClick={() => navigateToSection('story', '/home#story')}>
                <span>{t('learnOurStory', 'Our Story')}</span>
                <ChevronDown size={14} style={{ transform: 'rotate(-90deg)', color: '#94a3b8' }} />
              </button>
              <button type="button" className="mobile-nav-row" onClick={() => navigateToSection('reviews', '/home#reviews')}>
                <span>{t('reviewsEyebrow', 'Customer Reviews')}</span>
                <ChevronDown size={14} style={{ transform: 'rotate(-90deg)', color: '#94a3b8' }} />
              </button>
            </div>

            {/* Mobile Auth Button */}
            <div className="mobile-panel-footer">
              {!isAuthenticated ? (
                <button 
                  type="button"
                  className="mobile-auth-cta" 
                  onClick={() => {
                    setMenuOpen(false);
                    if (onAuthOpen) {
                      onAuthOpen();
                    } else {
                      router.push('/login');
                    }
                  }}
                >
                  <User size={16} />
                  <span>{t('signIn', 'Sign In / Register')}</span>
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link
                    href="/profile"
                    className="mobile-auth-cta"
                    onClick={() => setMenuOpen(false)}
                    style={{ background: '#1B5E2F' }}
                  >
                    <User size={16} />
                    <span>{isTamil ? 'எனது கணக்கு & ஆர்டர்கள்' : 'My Profile & Orders'}</span>
                  </Link>
                  <button 
                    type="button" 
                    className="mobile-auth-cta logout" 
                    onClick={() => { logout(); setMenuOpen(false); }}
                  >
                    <LogOut size={16} />
                    <span>{isTamil ? 'வெளியேறுக' : 'Sign Out'}</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>,
        document.body
      )}

    </header>
  );
}
