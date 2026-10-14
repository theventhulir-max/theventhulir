'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useUIModal } from '@/components/Providers';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight, ShieldCheck, Leaf, Droplets, Award, Star,
  ChevronDown, X, ChevronLeft, ChevronRight, Plus, Minus,
  ShoppingCart, Send, Search, Package, Clock, MessageSquare, Quote,
  Truck, CheckCircle2, Sparkles, Heart, RefreshCw, Flame, Sun, Wheat
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { BotanicalCorner } from '@/components/BotanicalOrnament';
import { getWhatsAppProductOrderUrl } from '@/lib/whatsapp';
import { useLanguage } from '@/context/LanguageContext';
import './HomePage.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Direct Hero Product Image Assets
const imgTurmeric = '/assets/hero/turmeric.png';
const imgChilli = '/assets/hero/chilli.png';
const imgCoriander = '/assets/hero/coriander.png';
const imgGaramMasala = '/assets/hero/garam_masala.png';
const imgSambar = '/assets/hero/sambar.png';
const imgOilCoconut = '/assets/hero/oil_coconut.png';
const imgOilGroundnut = '/assets/hero/oil_groundnut.png';
const imgOilGingelly = '/assets/hero/oil_gingelly.png';
const imgOilSunflower = '/assets/hero/oil_sunflower.png';

const API = '/api';


const CATEGORIES = [
  { 
    id: 'spices',
    name: 'Single-Origin Spices',      
    tamilName: 'கைமுறை மசாலா பொடிகள்',
    iconType: 'sparkles',
    badge: 'Sun-Dried & Stone-Ground',
    desc: 'High curcumin Salem turmeric, vivid Guntur red chillies, and fragrant Erode coriander stone-ground at low RPMs.',
    items: '3 Pure Powders Available',
    filterParam: 'Spices & Powders',
    image: imgTurmeric,
    secondaryImg: imgChilli,
    origin: 'Salem & Guntur Direct Farms',
    highlights: ['Salem Turmeric', 'Guntur Red Chilli', 'Erode Coriander'],
    isFeatured: true,
    accentColor: '#1B5E2F'
  },
  { 
    id: 'masalas',
    name: 'Heritage Masala Blends',      
    tamilName: 'பாரம்பரிய கூட்டு மசாலா',
    iconType: 'flame',
    badge: 'Hand-Roasted Heritage Spices',
    desc: 'Slow-roasted in small batches following ancestral family recipes. Fragrant heart for wholesome rasam, sambar & authentic Indian cooking.',
    items: '2 Authentic Blends Available',
    filterParam: 'Masala Blends',
    image: imgSambar,
    secondaryImg: imgGaramMasala,
    origin: 'Chettinad & Kongu Heritage',
    highlights: ['Heritage Sambar Powder', 'Authentic Royal Garam Masala'],
    isFeatured: true,
    accentColor: '#1B5E2F'
  }
];

const REVIEWS = [
  {
    name: 'Maya R.',
    role: 'Home Cook & Nutrition Advocate',
    rating: 5,
    city: 'Chennai',
    text: "The sesame oil is pure magic — the aroma alone tells you it's authentic Chekku pressed. Nothing like store-bought refined oils. My entire family can taste the difference!"
  },
  {
    name: 'Harshath K.',
    role: 'Professional Chef',
    rating: 5,
    city: 'Coimbatore',
    text: "As a chef, purity of raw ingredients is everything. Venthulir's cold-pressed groundnut and coconut oils have an exceptional smoke point and rich, clean flavour."
  },
  {
    name: 'Aswini M.',
    role: 'Certified Nutritionist',
    rating: 5,
    city: 'Bengaluru',
    text: "Finally spice powders and masalas without fillers, preservatives, or artificial dyes. The aroma and health benefits are outstanding for daily holistic meals."
  },
  {
    name: 'Shivanya P.',
    role: 'Organic Lifestyle Blogger',
    rating: 5,
    city: 'Madurai',
    text: "I've reviewed dozens of organic brands across South India, but Venthulir stands apart in transparency, packaging, and genuine farm-fresh taste."
  },
  {
    name: 'Rosan D.',
    role: 'Fitness & Wellness Coach',
    rating: 5,
    city: 'Trichy',
    text: "Unrefined cold-pressed oils are essential for gut health and wholesome nutrition. Venthulir is now my daily kitchen staple and what I recommend to all my clients."
  }
];

const FAQS = [
  {
    q: 'How are Venthulir cold-pressed oils extracted?',
    a: 'We use traditional Chekku (wooden pestle and mortar) operated at very slow RPMs. This mechanical pressing maintains temperatures below 40°C, ensuring that all natural nutrients, antioxidants, aroma, and delicate vitamins remain intact.'
  },
  {
    q: 'Are all products 100% free of preservatives and additives?',
    a: 'Absolutely. Every batch of oil, spice, and grain is zero-chemical, zero-additive, and unadulterated. What you receive is 100% natural, certified, and farm-sourced produce.'
  },
  {
    q: 'What is the shelf life and ideal storage condition?',
    a: 'Because our oils are unrefined with zero chemical preservatives, we recommend storing them in a cool, dry place away from direct sunlight. Unopened bottles last 6 to 9 months, and opened bottles are best enjoyed within 3 months.'
  },
  {
    q: 'Do you offer free shipping and express delivery?',
    a: 'Yes! We offer complimentary standard shipping across India on all orders above ₹499. Orders are processed within 24 hours, with typical delivery taking 3–5 business days.'
  },
  {
    q: 'Can I place bulk orders for events or wholesale?',
    a: 'Yes, we gladly fulfill bulk and wholesale orders with customized packaging options. You can connect with our team via the contact form or WhatsApp us at +91 87784 76414.'
  }
];

const HERO_POWDERS = [
  {
    id: 'turmeric-powder',
    title: 'High-Curcumin Pure Turmeric Powder',
    subtitle: '100% Pure & Natural • Sun-Dried & Stone-Ground',
    badge: '100% Pure',
    image: imgTurmeric,
    tag: 'Authentic Salem Golden Turmeric',
    price: 'From ₹40',
    rating: '4.9 ★ (420+)',
    bgGradient: 'radial-gradient(circle at 50% 32%, #ffffff 0%, #faf5ea 55%, #f2e9d8 100%)',
    spiceColor: '#1B5E2F',
    auraGlow: 'rgba(22, 101, 52, 0.15)',
  },
  {
    id: 'chilli-powder',
    title: 'Pure Stone-Ground Chilli Powder',
    subtitle: 'Sun-Dried Chillies • Vibrant Natural Red Color',
    badge: 'Stone-Ground',
    image: imgChilli,
    tag: 'Medium Spicy Taste & Fine Grind',
    price: 'From ₹40',
    rating: '4.9 ★ (380+)',
    bgGradient: 'radial-gradient(circle at 50% 32%, #ffffff 0%, #faf5ea 55%, #f2e9d8 100%)',
    spiceColor: '#991b1b',
    auraGlow: 'rgba(153, 27, 27, 0.15)',
  },
  {
    id: 'coriander-powder',
    title: 'Single-Origin Coriander Powder',
    subtitle: 'Slowly Roasted Tamil Nadu Heirloom Seeds',
    badge: 'Single-Origin',
    image: imgCoriander,
    tag: 'Fresh Aroma & Smooth Texture',
    price: 'From ₹27',
    rating: '4.9 ★ (310+)',
    bgGradient: 'radial-gradient(circle at 50% 32%, #ffffff 0%, #faf5ea 55%, #f2e9d8 100%)',
    spiceColor: '#059669',
    auraGlow: 'rgba(5, 150, 105, 0.15)',
  },
  {
    id: 'garam-masala',
    title: 'Authentic Royal Garam Masala',
    subtitle: 'Hand-Roasted Whole Heritage Spices',
    badge: 'Heritage Recipe',
    image: imgGaramMasala,
    tag: 'Warm Aromatic Blend • Zero Preservatives',
    price: 'From ₹100',
    rating: '5.0 ★ (290+)',
    bgGradient: 'radial-gradient(circle at 50% 32%, #ffffff 0%, #faf5ea 55%, #f2e9d8 100%)',
    spiceColor: '#0f766e',
    auraGlow: 'rgba(15, 118, 110, 0.15)',
  },
  {
    id: 'sambar-powder',
    title: 'Heritage Grandmothers Sambar Powder',
    subtitle: 'Authentic South Indian Generational Recipe',
    badge: 'Chettinad Recipe',
    image: imgSambar,
    tag: 'Home-Style Flavor & Authentic Aroma',
    price: 'From ₹32',
    rating: '4.9 ★ (510+)',
    bgGradient: 'radial-gradient(circle at 50% 32%, #ffffff 0%, #faf5ea 55%, #f2e9d8 100%)',
    spiceColor: '#047857',
    auraGlow: 'rgba(4, 120, 87, 0.15)',
  }
];

const INITIAL_CATALOG_PRODUCTS = [
  {
    _id: '6aba0cd61452a86806531193',
    slug: 'pure-red-chilli-powder',
    productCode: 'VEN-SP-CHL',
    name: 'Pure Stone-Ground Chilli Powder',
    category: 'Spices & Powders',
    badge: '100% Pure & Natural',
    price: 40,
    originalPrice: 50,
    discountPercent: 20,
    rating: 4.9,
    reviewsCount: 184,
    imageUrl: imgChilli,
    images: [imgChilli],
    description: '100% pure & natural red chilli powder with bright natural red color, medium spicy taste, and fine stone grind with no artificial preservatives.',
    variants: [
      { label: '100g', price: 40, originalPrice: 50, contents: '100g Pack' },
      { label: '200g', price: 75, originalPrice: 95, contents: '200g Pack' },
      { label: '500g', price: 190, originalPrice: 240, contents: '500g Pack' },
      { label: '1000g', price: 340, originalPrice: 420, contents: '1 Kg Family Pack' }
    ],
    inStock: true
  },
  {
    _id: '6aba0cd61452a86806531194',
    slug: 'single-origin-stone-ground-coriander-powder',
    productCode: 'VEN-SP-COR',
    name: 'Single-Origin Stone Ground Coriander Powder',
    category: 'Spices & Powders',
    badge: '100% Pure & Natural',
    price: 27,
    originalPrice: 35,
    discountPercent: 23,
    rating: 4.9,
    reviewsCount: 152,
    imageUrl: imgCoriander,
    images: [imgCoriander],
    description: '100% pure & natural coriander powder with fresh aroma and smooth texture. Slow-ground from single-origin coriander seeds with zero preservatives.',
    variants: [
      { label: '100g', price: 27, originalPrice: 35, contents: '100g Pack' },
      { label: '200g', price: 56, originalPrice: 70, contents: '200g Pack' },
      { label: '500g', price: 135, originalPrice: 170, contents: '500g Pack' },
      { label: '1000g', price: 280, originalPrice: 350, contents: '1 Kg Family Pack' }
    ],
    inStock: true
  },
  {
    _id: '6aba0cd61452a86806531196',
    slug: 'authentic-royal-garam-masala',
    productCode: 'VEN-MS-GAR',
    name: 'Authentic Royal Garam Masala',
    category: 'Masala Blends',
    badge: 'Warm Aromatic Blend',
    price: 100,
    originalPrice: 125,
    discountPercent: 20,
    rating: 4.9,
    reviewsCount: 168,
    imageUrl: imgGaramMasala,
    images: [imgGaramMasala],
    description: '100% pure & natural royal garam masala with authentic Indian taste and warm aromatic blend of hand-roasted heritage whole spices with no preservatives.',
    variants: [
      { label: '100g', price: 100, originalPrice: 125, contents: '100g Pack' },
      { label: '200g', price: 200, originalPrice: 250, contents: '200g Pack' },
      { label: '500g', price: 499, originalPrice: 620, contents: '500g Pack' },
      { label: '1000g', price: 956, originalPrice: 1190, contents: '1 Kg Family Pack' }
    ],
    inStock: true
  },
  {
    _id: '6aba0cd61452a86806531195',
    slug: 'heritage-grandmothers-sambar-powder',
    productCode: 'VEN-MS-SAM',
    name: 'Heritage Grandmothers Sambar Powder',
    category: 'Masala Blends',
    badge: 'Home-Style Flavor',
    price: 32,
    originalPrice: 42,
    discountPercent: 24,
    rating: 4.9,
    reviewsCount: 210,
    imageUrl: imgSambar,
    images: [imgSambar],
    description: '100% pure & natural special South Indian spice mix crafted following traditional home recipes for an authentic and aromatic sambar.',
    variants: [
      { label: '100g', price: 32, originalPrice: 42, contents: '100g Pack' },
      { label: '200g', price: 60, originalPrice: 75, contents: '200g Pack' },
      { label: '500g', price: 150, originalPrice: 190, contents: '500g Pack' },
      { label: '1000g', price: 300, originalPrice: 380, contents: '1 Kg Family Pack' }
    ],
    inStock: true
  },
  {
    _id: '6aba0cd61452a86806531192',
    slug: 'high-curcumin-pure-turmeric-powder',
    productCode: 'VEN-SP-TUR',
    name: 'High-Curcumin Pure Turmeric Powder',
    category: 'Spices & Powders',
    badge: '100% Pure & Natural',
    price: 40,
    originalPrice: 55,
    discountPercent: 27,
    rating: 4.9,
    reviewsCount: 196,
    imageUrl: imgTurmeric,
    images: [imgTurmeric],
    description: '100% pure & natural high-curcumin authentic Salem turmeric powder, sun-dried and stone ground to retain natural color, aroma, and medicinal healing properties.',
    variants: [
      { label: '100g', price: 40, originalPrice: 55, contents: '100g Pack' },
      { label: '200g', price: 75, originalPrice: 95, contents: '200g Pack' },
      { label: '500g', price: 200, originalPrice: 260, contents: '500g Pack' },
      { label: '1000g', price: 400, originalPrice: 520, contents: '1 Kg Family Pack' }
    ],
    inStock: true
  }
];

const StarRating = ({ count = 5 }) => (
  <div className="star-rating-row" aria-label={`${count} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={14}
        className={i <= count ? 'star-filled' : 'star-empty'}
        fill={i <= count ? '#c9a84c' : 'none'}
        stroke="#c9a84c"
        strokeWidth={1.5}
      />
    ))}
  </div>
);

export default function HomePage({ onCheckout }) {
  const { addToCart, setIsCartOpen } = useCart();
  const { language, setLanguage, toggleLanguage, t, isTamil } = useLanguage();
  const router = useRouter();
  const uiModal = useUIModal();
  const handleCheckout = onCheckout || uiModal?.openCheckout;

  const homeRootRef = useRef(null);
  const [products, setProducts] = useState(INITIAL_CATALOG_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch live products asynchronously on mount
  useEffect(() => {
    let mounted = true;
    fetch('/api/products?limit=60')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (mounted && data?.products && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Hero Showcase Category Tab & Slideshow State
  const [heroTab, setHeroTab] = useState('powders');
  const activeHeroSlides = HERO_POWDERS;
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragEndX = useRef(0);

  // Helper to ensure newest products are ALWAYS placed first
  const sortNewestFirst = (list) => {
    return [...list].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeA && timeB && timeA !== timeB) return timeB - timeA;
      if (timeA && !timeB) return -1;
      if (!timeA && timeB) return 1;
      return (b._id || b.id || '').localeCompare(a._id || a.id || '');
    });
  };

  // Unique categories for filtering
  const categoryTabs = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    const pCat = (p.category || '').trim().toLowerCase();
    const aCat = activeCategory.trim().toLowerCase();
    const matchCategory = activeCategory === 'All' || 
      pCat === aCat ||
      (aCat.includes('spice') && /spice|powder/i.test(pCat)) ||
      (aCat.includes('oil') && /oil/i.test(pCat)) ||
      (aCat.includes('masala') && /masala/i.test(pCat));
    const matchSearch = !searchQuery || p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  // Quick View Modal State & Zoom Lens
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [zoomState, setZoomState] = useState({ isZoomed: false, x: 50, y: 50 });

  const handleZoomMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomState({ isZoomed: true, x, y });
  };

  const handleZoomMouseLeave = () => {
    setZoomState({ isZoomed: false, x: 50, y: 50 });
  };

  // Reviews Carousel
  const [currentReview, setCurrentReview] = useState(0);

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState(0);

  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle');
  
  // Products Horizontal Track Ref, Section Ref & Progress Fill Ref
  const productsSectionRef = useRef(null);
  const productsTrackRef = useRef(null);
  const progressFillRef = useRef(null);

  // Smooth Horizontal Track Progress Updater
  const handleTrackScroll = () => {
    if (productsTrackRef.current && progressFillRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = productsTrackRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      progressFillRef.current.style.width = `${Math.max(12, Math.min(100, progress))}%`;
    }
  };

  // Smooth Navigation Arrow Controls
  const scrollProducts = (direction) => {
    if (productsTrackRef.current) {
      const scrollOffset = direction === 'next' ? 340 : -340;
      productsTrackRef.current.scrollBy({
        left: scrollOffset,
        behavior: 'smooth'
      });
    }
  };

  // Load products from API (Fresh live fetch + newest first sort)
  const fetchFreshProducts = useCallback(() => {
    fetch(`${API}/products?limit=100&sort=newest&t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.products || []);
        if (list.length > 0) {
          setProducts(sortNewestFirst(list));
        }
      })
      .catch((err) => {
        console.error('API load failed:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchFreshProducts();
  }, [fetchFreshProducts]);

  // Clean, lightweight ambient animations without hiding content
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Refresh scroll triggers if any
    try {
      ScrollTrigger.refresh();
    } catch {}
  }, []);

  // Manual / user-driven hero slides (no aggressive automatic auto-switching)
  const handleCategorySwitch = (tab) => {
    setHeroTab(tab);
    setCurrentHeroSlide(0);
  };

  // Hero Touch & Drag Handlers for Mobile / Desktop Swipe
  const handleDragStart = (clientX) => {
    isDragging.current = true;
    dragStartX.current = clientX;
    dragEndX.current = clientX;
    setIsHeroPaused(true);
  };

  const handleDragMove = (clientX) => {
    if (!isDragging.current) return;
    dragEndX.current = clientX;
  };

  const handleDragEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setIsHeroPaused(false);
    
    const distance = dragStartX.current - dragEndX.current;
    if (distance > 45) {
      setCurrentHeroSlide((prev) => (prev + 1) % activeHeroSlides.length);
    } else if (distance < -45) {
      setCurrentHeroSlide((prev) => (prev - 1 + activeHeroSlides.length) % activeHeroSlides.length);
    }
    dragStartX.current = 0;
    dragEndX.current = 0;
  };

  // Open Quick View
  const handleOpenQuickView = useCallback((product) => {
    setQuickViewProduct(product);
    setSelectedVariant(product.variants?.[0] || null);
    setQuantity(1);
    setActiveImgIndex(0);
    setZoomState({ isZoomed: false, x: 50, y: 50 });
    document.body.style.overflow = 'hidden';
  }, []);

  // Close Quick View
  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
    setZoomState({ isZoomed: false, x: 50, y: 50 });
    document.body.style.overflow = '';
  };

  const qvImages = quickViewProduct
    ? (quickViewProduct.images?.length ? quickViewProduct.images : [quickViewProduct.imageUrl].filter(Boolean))
    : [];
  const qvPrice = selectedVariant?.price ?? quickViewProduct?.price ?? 0;

  // Contact Form Submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      const res = await fetch(`${API}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={homeRootRef} className="home-page-root">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Warm Ivory Luxury Organic D2C Layout)
      ───────────────────────────────────────────────────────────── */}
      <section id="home" className="home-hero">
        <BotanicalCorner position="top-left" variant="royal" opacity={0.9} size={96} />
        <BotanicalCorner position="bottom-right" variant="royal" opacity={0.9} size={96} />
        <div className="hero-bg-accent" />
        <div className="container hero-container">
          <div className="hero-content-grid">
            
            {/* Left Column: Brand Story, Headline & CTAs */}
            <div className="hero-text-col">
              <div className="hero-badge-capsule">
                <Leaf size={14} className="badge-leaf-icon" />
                <span>{isTamil ? '🌿 100% தூயது • பாரம்பரியம் • பண்ணை நேரடி' : '100% Pure • Traditional • Farm Sourced'}</span>
              </div>

              <h1 className="hero-main-heading">
                <span className="hero-brand-name-tag" style={{ display: 'block', fontSize: '0.88rem', color: '#1B5E2F', letterSpacing: '0.06em', marginBottom: '14px', fontWeight: '800', textTransform: 'uppercase' }}>
                  {isTamil ? 'வெண்துளிர் இயற்கை' : 'Venthulir Natural Harvests'}
                </span>
                <span className="heading-italic-lead">{isTamil ? 'சுவையான பாரம்பரிய ' : 'Taste the Purity of '}</span>
                <span className="heading-nature-bold">{isTamil ? 'இயற்கை நல்வாழ்வு.' : 'Nature.'}</span>
                <span className="heading-farm-sub">{isTamil ? 'பண்ணையிலிருந்து உங்கள் சமையலறைக்கு.' : 'From Tamil Nadu Farms to Your Kitchen.'}</span>
              </h1>

              <p className="hero-description">
                {isTamil 
                  ? 'தூய்மையான பாரம்பரிய இயற்கை விளைபொருட்கள் உங்கள் இல்லத்திற்கு நேரடியாக.' 
                  : 'Pure. Natural. Authentic. Our spices bring the true flavour of Tamil Nadu straight to your home.'}
              </p>

              {/* Action Buttons */}
              <div className="hero-actions-row">
                <button 
                  type="button"
                  className="btn-hero-primary" 
                  onClick={() => router.push('/products')}
                >
                  <ShoppingCart size={17} className="btn-cart-icon" />
                  <span>{t('shopFreshHarvest', 'Shop Fresh Harvest')}</span>
                  <ArrowRight size={17} className="btn-arrow-icon" />
                </button>
                <button 
                  type="button"
                  className="btn-hero-secondary" 
                  onClick={() => router.push('/products')}
                >
                  <span>{isTamil ? 'மசாலா & எண்ணெய்களைப் பார்க்க' : 'Explore Spices & Oils'}</span>
                  <ArrowRight size={17} className="btn-arrow-icon" />
                </button>
              </div>
            </div>

            {/* Right Column: Artisan Organic Stage Showcase with Powders / Oils Switcher */}
            <div className="hero-visual-col">
              <div 
                className="artisan-showcase-wrapper"
                onMouseEnter={() => setIsHeroPaused(true)}
                onMouseLeave={() => {
                  setIsHeroPaused(false);
                  handleDragEnd();
                }}
                onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
                onTouchEnd={handleDragEnd}
                onMouseDown={(e) => handleDragStart(e.clientX)}
                onMouseMove={(e) => handleDragMove(e.clientX)}
                onMouseUp={handleDragEnd}
              >
                {/* Dynamic Aura Glow matched to active product */}
                <div 
                  className="artisan-aura-glow"
                  style={{ background: activeHeroSlides[currentHeroSlide]?.auraGlow || 'rgba(36, 88, 55, 0.25)' }}
                />

                {/* Main Artisan Sculpted Arch Stage */}
                <div className="artisan-arch-stage">
                  
                  {/* Navigation Arrows */}
                  <button 
                    type="button"
                    className="artisan-nav-arrow left"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentHeroSlide((prev) => (prev - 1 + activeHeroSlides.length) % activeHeroSlides.length);
                    }}
                    aria-label="Previous product"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button 
                    type="button"
                    className="artisan-nav-arrow right"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentHeroSlide((prev) => (prev + 1) % activeHeroSlides.length);
                    }}
                    aria-label="Next product"
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Slides Track */}
                  <div 
                    className="artisan-slides-track" 
                    style={{ transform: `translateX(-${currentHeroSlide * 100}%)` }}
                  >
                    {activeHeroSlides.map((slide) => (
                      <div 
                        key={slide.id} 
                        className="artisan-slide-scene"
                        style={{ background: slide.bgGradient }}
                      >
                        {/* Concentric Halo Aura Ring */}
                        <div className="artisan-halo-ring" />
                        <div className="artisan-halo-ring inner" />
                        
                        {/* Upfront, Close-Up Hero Product Container */}
                        <div className="artisan-hero-focus">
                          <div className="artisan-wood-plinth" />
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="artisan-pouch-closeup"
                            draggable="false"
                            loading="eager"
                          />
                        </div>

                        {/* Floating Glassmorphic Product Info Capsule */}
                        <div className="artisan-glass-card">
                          <div className="artisan-card-header">
                            <span 
                              className="artisan-spice-pill"
                              style={{ 
                                borderColor: slide.spiceColor,
                                color: slide.spiceColor 
                              }}
                            >
                              <span className="pill-dot" style={{ background: slide.spiceColor }} />
                              {slide.badge}
                            </span>
                            <div className="artisan-card-meta">
                              <span className="artisan-rating-pill">
                                <Star size={11} fill="#eab308" color="#eab308" />
                                <span>{slide.rating.split(' ')[0]}</span>
                              </span>
                              <span className="artisan-price-tag">{slide.price}</span>
                            </div>
                          </div>
                          
                          <div className="artisan-card-body-row">
                            <div className="artisan-card-info-text">
                              <div className="artisan-spice-title">{slide.title}</div>
                              <div className="artisan-spice-sub">{slide.subtitle}</div>
                            </div>
                            <button 
                              type="button"
                              className="artisan-quick-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push('/products');
                              }}
                              title="Shop Now"
                            >
                              <ArrowRight size={15} />
                            </button>
                          </div>

                          {/* Minimal slide pagination indicator dots inside card */}
                          <div className="artisan-dots-minimal">
                            {activeHeroSlides.map((s, dotIdx) => (
                              <button
                                key={s.id}
                                type="button"
                                className={`artisan-mini-dot ${dotIdx === currentHeroSlide ? 'active' : ''}`}
                                style={dotIdx === currentHeroSlide ? { background: slide.spiceColor } : undefined}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentHeroSlide(dotIdx);
                                }}
                                aria-label={`Slide ${dotIdx + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Indicator placed below the box */}
                <div className="artisan-category-switcher" style={{ justifyContent: 'center' }}>
                  <div className="artisan-switch-btn active" style={{ cursor: 'default' }}>
                    <Sparkles size={14} className="switch-icon" />
                    <span className="switcher-label-full">Heritage Farm Spices · 5 Pure Products</span>
                    <span className="switcher-label-short">Farm Spices (5)</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. VALUE PROPOSITIONS STRIP (Rich Forest Green with White Icons)
      ───────────────────────────────────────────────────────────── */}
      <section className="features-strip">
        <BotanicalCorner position="top-left" variant="eucalyptus" opacity={0.85} size={84} />
        <BotanicalCorner position="bottom-right" variant="eucalyptus" opacity={0.85} size={84} />
        <div className="container">
          <div className="features-grid">
            <div className="feature-cell">
              <div className="feature-icon-box">
                <Leaf size={22} />
              </div>
              <div className="feature-content">
                <h4 className="feature-title">{isTamil ? '100% இயற்கை விளைச்சல்' : '100% Certified Organic'}</h4>
                <p className="feature-desc">{isTamil ? 'ரசாயனம் மற்றும் பூச்சிக்கொல்லி இல்லாத உழவு முறை.' : 'Cultivated without synthetic pesticides or harmful chemicals.'}</p>
              </div>
            </div>

            <div className="feature-cell">
              <div className="feature-icon-box">
                <Droplets size={22} />
              </div>
              <div className="feature-content">
                <h4 className="feature-title">{isTamil ? 'பாரம்பரிய மரச்செக்கு' : 'Traditional Chekku'}</h4>
                <p className="feature-desc">{isTamil ? '40°C க்கும் குறைவான வெப்பநிலையில் ஊட்டச்சத்து காக்கப்பட்டு பிழிதல்.' : 'Wooden press extraction under 40°C to lock in nutrients.'}</p>
              </div>
            </div>

            <div className="feature-cell">
              <div className="feature-icon-box">
                <Truck size={22} />
              </div>
              <div className="feature-content">
                <h4 className="feature-title">{isTamil ? 'பண்ணை நேரடி விநியோகம்' : 'Direct Farm Dispatch'}</h4>
                <p className="feature-desc">{isTamil ? 'பாதுகாப்பான பேக்கிங் முறையில் இந்தியா முழுவதும் துரித டெலிவரி.' : 'Swift pan-India delivery with eco-friendly packaging.'}</p>
              </div>
            </div>

            <div className="feature-cell">
              <div className="feature-icon-box">
                <ShieldCheck size={22} />
              </div>
              <div className="feature-content">
                <h4 className="feature-title">{isTamil ? 'FSSAI தர பரிசோதனை' : 'Lab Tested & FSSAI'}</h4>
                <p className="feature-desc">{isTamil ? 'ஒவ்வொரு தயாரிப்பும் தீவிர தர பரிசோதனைக்கு உட்படுத்தப்படுகிறது.' : 'Rigorous multi-point testing for complete batch purity.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. PRODUCTS CATALOG (GSAP Horizontal Scrolling Showcase)
      ───────────────────────────────────────────────────────────── */}
      <section id="products" ref={productsSectionRef} className="section-products">
        <BotanicalCorner position="top-left" variant="olive" opacity={0.9} size={92} />
        <BotanicalCorner position="bottom-right" variant="olive" opacity={0.9} size={92} />
        <div className="container">
          
          <div className="products-top-bar">
            <div>
              <span className="section-eyebrow">{isTamil ? 'எங்கள் பண்ணை விளைபொருட்கள்' : 'Our Farm Catalog'}</span>
              <h2 className="section-headline">{isTamil ? 'தூய இயற்கை விளைபொருட்கள்' : 'Pure Organic Staples'}</h2>
              <p className="products-section-sub">
                {isTamil 
                  ? 'தமிழக இயற்கை பண்ணைகளிலிருந்து நேரடியாக பெறப்பட்ட மரச்செக்கு எண்ணெய்கள் & மசாலா பொடிகள்'
                  : 'Hand-pressed virgin oils & stone-ground spices directly from Tamil Nadu farms'}
              </p>
            </div>

            <div className="products-top-actions">
              {/* Search Input */}
              <div className="product-search-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder={t('searchProductsPlaceholder', 'Search oils, spices...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="search-clear-btn"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* View All Products Button */}
              <button
                className="btn-view-all-header"
                onClick={() => router.push('/products')}
              >
                <span>{t('viewAllResults', 'View All')} ({products.length})</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="category-filter-pills">
            {categoryTabs.map((tab) => (
              <button
                key={tab}
                className={`filter-pill-btn ${activeCategory === tab ? 'active' : ''}`}
                onClick={() => setActiveCategory(tab)}
              >
                {tab === 'All' ? t('allFilter', 'All Products') : tab}
              </button>
            ))}
          </div>

          {/* Responsive Product Grid */}
          {loading ? (
            <div className="products-catalog-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="product-skeleton-card" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="products-empty-state">
              <Package size={52} strokeWidth={1.2} />
              <h3>No products found</h3>
              <p>Try searching for another keyword or selecting &quot;All&quot; categories.</p>
              <button
                className="btn-secondary-sm"
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="products-catalog-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={handleOpenQuickView}
                  onBuyNow={(prod, variant, itemKey) => {
                    router.push(`/checkout${itemKey ? `?buyNow=${encodeURIComponent(itemKey)}` : ''}`);
                  }}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. CATEGORIES SECTION (Curated Visual Bento Showcase)
      ───────────────────────────────────────────────────────────── */}
      <section id="categories" className="section-categories-showcase">
        <BotanicalCorner position="top-left" variant="wheat" opacity={0.9} size={92} />
        <BotanicalCorner position="bottom-right" variant="wheat" opacity={0.9} size={92} />
        <div className="container">
          <div className="section-header text-center cat-showcase-header">
            <div className="cat-eyebrow-pill">
              <Sparkles size={14} className="cat-pill-sparkle" />
              <span>{t('catSectionEyebrow', 'HANDCRAFTED HERITAGE COLLECTIONS')}</span>
            </div>
            <h2 className="section-headline">{t('catSectionHeading', 'Shop By Category')}</h2>
            <p className="section-subtitle">
              {t('catSectionSub', 'From aromatic stone-ground spices and pure single-origin powders to traditional wood cold-pressed oils and native heirloom grains, discover pure staples crafted for wholesome living.')}
            </p>
            <div className="cat-header-badges">
              <span className="cat-header-tag">{isTamil ? '✨ பாரம்பரிய கல் அரைப்பு' : '✨ Stone-Ground Spices'}</span>
              <span className="cat-header-tag">{isTamil ? '🪵 மரச்செக்கு <40°C' : '🪵 Wood-Pressed <40°C'}</span>
              <span className="cat-header-tag">{isTamil ? '🌱 100% பண்ணை நேரடி' : '🌱 100% Farm-Direct'}</span>
              <span className="cat-header-tag">{isTamil ? '🛡️ கலப்படம் அற்றது' : '🛡️ Zero Additives'}</span>
            </div>
          </div>

          <div className="categories-bento-showcase">
            {/* Top Row: Two Grande Feature Showcase Cards */}
            <div className="cat-bento-row-grande">
              {CATEGORIES.filter(c => c.isFeatured).map((cat) => (
                <div
                  key={cat.id || cat.name}
                  className={`cat-bento-card-grande cat-grande-${cat.id}`}
                  onClick={() => {
                    setActiveCategory(cat.filterParam || cat.name);
                  }}
                >
                  <div className="cat-grande-ambient-glow" style={{ background: cat.accentGlow }} />
                  
                  <div className="cat-grande-content">
                    <div className="cat-grande-badges-wrap">
                      <span className="cat-grande-badge">
                        {cat.iconType === 'droplets' ? <Droplets size={14} /> : <Sparkles size={14} />}
                        {cat.badge}
                      </span>
                      {cat.origin && <span className="cat-origin-badge">{cat.origin}</span>}
                    </div>

                    <div className="cat-grande-titles">
                      <span className="cat-tamil-title">{cat.tamilName}</span>
                      <h3 className="cat-grande-heading">{isTamil && cat.tamilName ? cat.tamilName : cat.name}</h3>
                    </div>

                    <p className="cat-grande-desc">{cat.desc}</p>

                    <div className="cat-ingredient-pills">
                      {cat.highlights?.map((hl, idx) => (
                        <span key={idx} className="cat-pill-item">
                          <CheckCircle2 size={12} />
                          {hl}
                        </span>
                      ))}
                    </div>

                    <div className="cat-grande-footer">
                      <span className="cat-grande-items-count">{cat.items}</span>
                      <button 
                        className="btn-cat-grande-cta"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCategory(cat.filterParam || cat.name);
                          scrollToSection('products');
                        }}
                      >
                        <span>{t('exploreCollection', 'Explore Collection')}</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="cat-grande-visual">
                    <div className="cat-visual-canvas">
                      {cat.image && (
                        <img 
                          src={cat.image} 
                          alt={cat.name} 
                          className="cat-grande-primary-img" 
                          loading="lazy" 
                        />
                      )}
                      {cat.secondaryImg && (
                        <img 
                          src={cat.secondaryImg} 
                          alt="" 
                          className="cat-grande-secondary-img" 
                          loading="lazy" 
                        />
                      )}
                    </div>
                    <div className="cat-floating-micro-badge">
                      <ShieldCheck size={14} />
                      <span>{cat.id === 'oils' ? (isTamil ? 'வாகை மரச்செக்கு தயாரிப்பு' : 'Vaagai Chekku Extracted') : (isTamil ? 'குறைந்த வேகத்தில் கல் அரைப்பு' : 'Stone-Ground at 120 RPM')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Row: 4 Heritage Bento Cards */}
            <div className="cat-bento-row-heritage">
              {CATEGORIES.filter(c => !c.isFeatured).map((cat, idx) => (
                <div
                  key={cat.id || cat.name}
                  className={`cat-bento-card-compact cat-compact-${cat.id}`}
                  onClick={() => {
                    setActiveCategory(cat.filterParam || cat.name);
                    scrollToSection('products');
                  }}
                >
                  <div className="cat-compact-header">
                    <div className="cat-compact-icon-emblem">
                      {cat.iconType === 'flame' && <Flame size={20} />}
                      {cat.iconType === 'wheat' && <Wheat size={20} />}
                      {cat.iconType === 'sun' && <Sun size={20} />}
                      {cat.iconType === 'leaf' && <Leaf size={20} />}
                    </div>
                    <div className="cat-compact-meta-pill">
                      <span className="cat-compact-meta-sparkle">✦</span>
                      <span>{cat.badge}</span>
                    </div>
                  </div>

                  <div className="cat-compact-body">
                    <div className="cat-compact-title-wrap">
                      <span className="cat-compact-tamil-label">{cat.tamilName}</span>
                      <h4 className="cat-compact-heading">{isTamil && cat.tamilName ? cat.tamilName : cat.name}</h4>
                      <div className="cat-compact-divider" />
                    </div>
                    <p className="cat-compact-desc">{cat.desc}</p>
                    
                    <div className="cat-compact-highlights">
                      {cat.highlights?.slice(0, 3).map((hl, hIdx) => (
                        <span key={hIdx} className="cat-compact-pill">{hl}</span>
                      ))}
                    </div>
                  </div>

                  <div className="cat-compact-footer">
                    <span className="cat-compact-count">{cat.items}</span>
                    <button 
                      type="button"
                      className="cat-compact-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCategory(cat.filterParam || cat.name);
                        scrollToSection('products');
                      }}
                    >
                      <span>{t('shopNow', 'Shop Now')}</span>
                      <span className="cat-compact-arrow-bubble">
                        <ArrowRight size={13} />
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. WHY CHOOSE VENTHULIR (Numbered Value Cards)
      ───────────────────────────────────────────────────────────── */}
      <section className="section-why-choose">
        <BotanicalCorner position="top-left" variant="spice" opacity={0.9} size={92} />
        <BotanicalCorner position="bottom-right" variant="spice" opacity={0.9} size={92} />
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">{t('whyEyebrow', 'Our Core Principles')}</span>
            <h2 className="section-headline">{t('whyHeading', 'Why Choose Venthulir?')}</h2>
            <p className="section-subtitle">
              {t('whySub', 'Every drop of oil, grain of rice, and pinch of spice reflects our commitment to uncompromised purity and ethical farming.')}
            </p>
          </div>

          <div className="why-choose-grid">
            <div className="why-card">
              <div className="why-card-top">
                <div className="why-icon-bubble">
                  <Leaf size={20} />
                </div>
                <span className="why-number">01</span>
              </div>
              <span className="why-card-tag">{isTamil ? 'இயற்கை விவசாயம்' : 'Ethical Agriculture'}</span>
              <h3 className="why-title">{t('why3Title', 'Direct Farm Sourcing')}</h3>
              <p className="why-desc">
                {t('why3Desc', 'We work directly with 50+ certified organic farmers across Tamil Nadu, eliminating middlemen and ensuring fair livelihoods.')}
              </p>
              <div className="why-card-highlight">
                <CheckCircle2 size={13} />
                <span>{isTamil ? '50+ தமிழக இயற்கை உழவர்கள்' : '50+ Partner Native Farms'}</span>
              </div>
            </div>

            <div className="why-card">
              <div className="why-card-top">
                <div className="why-icon-bubble">
                  <Droplets size={20} />
                </div>
                <span className="why-number">02</span>
              </div>
              <span className="why-card-tag">{isTamil ? 'மரபு பிழிதல்' : 'Artisan Extraction'}</span>
              <h3 className="why-title">{t('why1Title', 'Traditional Chekku Press')}</h3>
              <p className="why-desc">
                {t('why1Desc', 'Extracted using native Vaagai wood mortars under 40°C. Natural enzymes, vitamins, and authentic aroma remain untouched.')}
              </p>
              <div className="why-card-highlight">
                <CheckCircle2 size={13} />
                <span>{isTamil ? 'சூடாக்கப்படாத மரச்செக்கு' : 'Zero Heat • Native Vaagai Wood'}</span>
              </div>
            </div>

            <div className="why-card">
              <div className="why-card-top">
                <div className="why-icon-bubble">
                  <ShieldCheck size={20} />
                </div>
                <span className="why-number">03</span>
              </div>
              <span className="why-card-tag">{isTamil ? '100% தூய்மை' : 'Clean Label Purity'}</span>
              <h3 className="why-title">{t('why4Title', 'Zero Chemicals & Additives')}</h3>
              <p className="why-desc">
                {t('why4Desc', 'No chemical refining, bleaching, artificial fragrances, or paraffin. 100% single-origin natural goodness in every batch.')}
              </p>
              <div className="why-card-highlight">
                <CheckCircle2 size={13} />
                <span>{isTamil ? 'ஆய்வகப் பரிசோதனை செய்யப்பட்டது' : 'Lab-Tested Zero Contaminants'}</span>
              </div>
            </div>

            <div className="why-card">
              <div className="why-card-top">
                <div className="why-icon-bubble">
                  <Package size={20} />
                </div>
                <span className="why-number">04</span>
              </div>
              <span className="why-card-tag">{isTamil ? 'புதிய பேக்கிங்' : 'Peak Freshness'}</span>
              <h3 className="why-title">{isTamil ? 'சிறிய அளவிலான பிரஷ் பேக்கிங்' : 'Fresh Small-Batch Packing'}</h3>
              <p className="why-desc">
                {isTamil 
                  ? 'ஊட்டச்சத்துக்களின் வீரியம் குறையாமல் உணவுப் பாதுகாப்புத் தரம் வாய்ந்த பாட்டில்கள் மற்றும் பைகளில் பேக் செய்யப்படுகிறது.' 
                  : 'Bottled and packed fresh to order in food-grade, leak-proof containers to preserve peak nutritional potency.'}
              </p>
              <div className="why-card-highlight">
                <CheckCircle2 size={13} />
                <span>{isTamil ? 'பாதுகாப்பான காற்றுப்புகா பேக்கிங்' : 'Food-Grade UV-Safe Seal'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ─────────────────────────────────────────────────────────────
          7. BRAND STORY & HERITAGE (Editorial 2-Column on Warm Ivory)
      ───────────────────────────────────────────────────────────── */}
      <section id="story" className="section-story">
        <BotanicalCorner position="top-left" variant="olive" opacity={0.9} size={92} />
        <BotanicalCorner position="bottom-right" variant="olive" opacity={0.9} size={92} />
        <div className="container">
          <div className="story-layout-grid">
            
            {/* Visual Column */}
            <div className="story-visual-side">
              <div className="story-photo-frame">
                <img
                  src="/story-traditional.jpg"
                  alt="Traditional Wood Press Chekku at Tamil Nadu Farm"
                  className="story-photo"
                />
              </div>

              {/* Floating Highlight Box */}
              <div className="story-stat-card">
                <div className="stat-unit">
                  <div className="stat-number">50+</div>
                  <div className="stat-desc">Partner Farms</div>
                </div>
                <div className="stat-sep" />
                <div className="stat-unit">
                  <div className="stat-number">100%</div>
                  <div className="stat-desc">Wood Pressed</div>
                </div>
                <div className="stat-sep" />
                <div className="stat-unit">
                  <div className="stat-number">0%</div>
                  <div className="stat-desc">Chemicals</div>
                </div>
              </div>
            </div>

            {/* Narrative Column */}
            <div className="story-text-side">
              <span className="section-eyebrow">Our Philosophy</span>
              <h2 className="section-headline">
                Rooted in Tradition. <br />
                Driven by Uncompromised Purity.
              </h2>

              <p className="story-body-p">
                At Venthulir, we believe modern food production has lost touch with what truly nourishes our bodies. 
                Mass-produced supermarket oils are treated with harsh chemicals, high heat, and bleaching agents that strip away life-giving vitamins.
              </p>

              <p className="story-body-p">
                We revived the ancient <strong>Chekku</strong> (wooden pestle press) tradition. By partnering directly 
                with organic farmers across Tamil Nadu, we ensure fair prices for growers and unadulterated goodness 
                for your kitchen table.
              </p>

              <div className="story-features-list">
                <div className="story-feature-row">
                  <div className="story-bullet-dot">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <strong>Direct Farmer Partnerships:</strong> We eliminate middlemen so local farming communities thrive.
                  </div>
                </div>

                <div className="story-feature-row">
                  <div className="story-bullet-dot">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <strong>Cold Mechanical Pressing:</strong> Extracted under 40°C to preserve unrefined antioxidants and rich natural aroma.
                  </div>
                </div>

                <div className="story-feature-row">
                  <div className="story-bullet-dot">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <strong>Small Batch Freshness:</strong> Bottled fresh in food-grade packaging right after settling and filtering.
                  </div>
                </div>
              </div>

              <div className="story-cta-wrap">
                <button
                  className="btn-hero-primary"
                  onClick={() => scrollToSection('products')}
                >
                  <span>Shop Pure Harvest</span>
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. CUSTOMER REVIEWS & TESTIMONIALS (Carousel)
      ───────────────────────────────────────────────────────────── */}
      <section id="reviews" className="section-reviews">
        <BotanicalCorner position="top-left" variant="eucalyptus" opacity={0.9} size={92} />
        <BotanicalCorner position="bottom-right" variant="eucalyptus" opacity={0.9} size={92} />
        <div className="container">
          
          <div className="reviews-header-bar">
            <div>
              <span className="section-eyebrow">Verified Feedback</span>
              <h2 className="section-headline">Loved by 5,000+ Kitchens</h2>
            </div>

            <div className="carousel-nav-arrows">
              <button
                className="carousel-arrow-btn"
                onClick={() => setCurrentReview((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length)}
                aria-label="Previous review"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="carousel-arrow-btn"
                onClick={() => setCurrentReview((prev) => (prev + 1) % REVIEWS.length)}
                aria-label="Next review"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="reviews-cards-grid">
            {REVIEWS.map((rev, index) => {
              const offset = (index - currentReview + REVIEWS.length) % REVIEWS.length;
              const isPrimary = offset === 0;
              const isSecondary = offset === 1 || offset === REVIEWS.length - 1;

              return (
                <div
                  key={index}
                  className={`review-card ${isPrimary ? 'primary-card' : ''} ${isSecondary ? 'secondary-card' : ''}`}
                  onClick={() => setCurrentReview(index)}
                >
                  <div className="review-top-row">
                    <StarRating count={rev.rating} />
                    <Quote size={24} className="quote-watermark" />
                  </div>

                  <p className="review-comment">&quot;{rev.text}&quot;</p>

                  <div className="reviewer-profile">
                    <div className="reviewer-avatar">{rev.name[0]}</div>
                    <div className="reviewer-meta">
                      <div className="reviewer-name">{rev.name}</div>
                      <div className="reviewer-role">{rev.role} • {rev.city}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="reviews-dot-nav">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                className={`dot-pill ${i === currentReview ? 'active' : ''}`}
                onClick={() => setCurrentReview(i)}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. FAQ & DIRECT INQUIRY
      ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="section-faq-contact">
        <BotanicalCorner position="top-left" variant="spice" opacity={0.9} size={92} />
        <BotanicalCorner position="bottom-right" variant="spice" opacity={0.9} size={92} />
        <div className="container">
          <div className="faq-contact-grid">
            
            {/* Left: FAQ Accordion */}
            <div className="faq-column">
              <span className="section-eyebrow">Got Questions?</span>
              <h2 className="section-headline">Frequently Asked Questions</h2>
              
              <div className="accordion-list">
                {FAQS.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div key={index} className={`accordion-item ${isOpen ? 'is-open' : ''}`}>
                      <button
                        className="accordion-trigger"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        aria-expanded={isOpen}
                      >
                        <span className="accordion-question">{faq.q}</span>
                        <ChevronDown size={18} className="accordion-arrow" />
                      </button>
                      <div className="accordion-collapse">
                        <p className="accordion-answer">{faq.a}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Contact & Bulk Inquiry Form */}
            <div id="contact" className="contact-column">
              <span className="section-eyebrow">Get In Touch</span>
              <h2 className="section-headline">Inquiries &amp; Bulk Orders</h2>

              <div className="contact-card-box">
                {formStatus === 'success' ? (
                  <div className="contact-success-panel">
                    <div className="success-icon-wrap">
                      <CheckCircle2 size={36} />
                    </div>
                    <h3>Thank you for reaching out!</h3>
                    <p>Your message has been sent. Our team will get back to you within 24 hours.</p>
                    <button
                      className="btn-hero-primary"
                      onClick={() => setFormStatus('idle')}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="inquiry-form">
                    <div className="form-fields-row">
                      <div className="form-field-unit">
                        <label>Your Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Kumar"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="form-field-unit">
                        <label>Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. ramesh@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-field-unit">
                      <label>Phone Number (Optional)</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="form-field-unit">
                      <label>Your Message / Requirement *</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us what products or questions you have..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    {formStatus === 'error' && (
                      <p className="form-error-msg">
                        Unable to send right now. Please try again or reach us on WhatsApp.
                      </p>
                    )}

                    <button
                      type="submit"
                      className="btn-submit-form"
                      disabled={formStatus === 'submitting'}
                    >
                      {formStatus === 'submitting' ? (
                        <span>Sending Message...</span>
                      ) : (
                        <>
                          <span>Submit Inquiry</span>
                          <Send size={15} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                <div className="contact-quick-support">
                  <div className="support-item">
                    <MessageSquare size={16} className="support-icon" />
                    <span>WhatsApp: <strong>+91 87784 76414</strong></span>
                  </div>
                  <div className="support-item">
                    <Clock size={16} className="support-icon" />
                    <span>Fast Response: Within 24h</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. FINAL CTA BANNER (Rich Forest Green with Gold Accent)
      ───────────────────────────────────────────────────────────── */}
      <section className="section-final-cta">
        <div className="container">
          <div className="final-cta-card">
            <BotanicalCorner position="top-left" variant="royal" opacity={0.85} size={88} />
            <BotanicalCorner position="bottom-right" variant="royal" opacity={0.85} size={88} />
            <div className="final-cta-content">
              <span className="final-cta-eyebrow">Pure • Traditional • Honest</span>
              <h2 className="final-cta-heading">
                Bring the Goodness of Tamil Nadu Farms Home.
              </h2>
              <p className="final-cta-sub">
                Pure ingredients. Honest farming. Traditional goodness for your entire family. 
                Experience the difference today with free delivery on orders above ₹499.
              </p>
              <div className="final-cta-actions">
                <button
                  className="btn-final-primary"
                  onClick={() => scrollToSection('products')}
                >
                  <span>Explore Our Products</span>
                  <ArrowRight size={18} />
                </button>
                <a
                  href="https://wa.me/918778476414"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-final-secondary"
                >
                  <span>Order on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. QUICK VIEW MODAL
      ───────────────────────────────────────────────────────────── */}
      {quickViewProduct && (
        <div className="quickview-overlay" onClick={handleCloseQuickView}>
          <div className="quickview-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="quickview-close-btn"
              onClick={handleCloseQuickView}
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            <div className="quickview-grid">
              
              {/* Product Gallery with Hover Zoom Magnifier */}
              <div className="quickview-gallery-side">
                <div 
                  className={`quickview-main-image-wrap ${zoomState.isZoomed ? 'is-zoomed' : ''}`}
                  onMouseMove={handleZoomMouseMove}
                  onMouseLeave={handleZoomMouseLeave}
                >
                  {qvImages[activeImgIndex] ? (
                    <img 
                      src={qvImages[activeImgIndex]} 
                      alt={quickViewProduct.name}
                      style={{
                        transformOrigin: `${zoomState.x}% ${zoomState.y}%`,
                        transform: zoomState.isZoomed ? 'scale(2.35)' : 'scale(1)',
                        transition: zoomState.isZoomed ? 'transform 0.08s ease-out' : 'transform 0.3s ease',
                      }} 
                    />
                  ) : (
                    <div className="quickview-placeholder">
                      {quickViewProduct.name[0]}
                    </div>
                  )}

                  <div className={`qv-zoom-badge ${zoomState.isZoomed ? 'hide' : ''}`}>
                    <Search size={12} />
                    <span>Hover to Zoom</span>
                  </div>
                </div>

                {qvImages.length > 1 && (
                  <div className="quickview-thumbs-row">
                    {qvImages.map((img, idx) => (
                      <button
                        key={idx}
                        className={`thumb-btn ${idx === activeImgIndex ? 'is-selected' : ''}`}
                        onClick={() => setActiveImgIndex(idx)}
                      >
                        <img src={img} alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details & Actions */}
              <div className="quickview-details-side">
                {quickViewProduct.badge && (
                  <span className="qv-badge-pill">{quickViewProduct.badge}</span>
                )}
                <div className="qv-category-label">{quickViewProduct.category}</div>
                <h2 className="qv-product-name">{quickViewProduct.name}</h2>

                <div className="qv-rating-strip">
                  <StarRating count={5} />
                  <span className="qv-rating-text">4.9 (500+ verified ratings)</span>
                </div>

                <div className="qv-price-tag">₹{qvPrice}</div>

                <p className="qv-description-text">{quickViewProduct.description}</p>

                {/* Variants Selector */}
                {quickViewProduct.variants?.length > 0 && (
                  <div className="qv-variant-group">
                    <label className="qv-field-label">Available Packaging / Sizes:</label>
                    <div className="qv-variants-row">
                      {quickViewProduct.variants.map((v) => (
                        <button
                          key={v.label}
                          className={`qv-variant-btn ${selectedVariant?.label === v.label ? 'active' : ''}`}
                          onClick={() => setSelectedVariant(v)}
                        >
                          <span className="var-label">{v.label}</span>
                          <span className="var-price">₹{v.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="qv-quantity-group">
                  <label className="qv-field-label">Quantity:</label>
                  <div className="qv-quantity-stepper">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="stepper-value">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="qv-subtotal-row">
                  <span>Total Amount:</span>
                  <strong>₹{qvPrice * quantity}</strong>
                </div>

                <div className="qv-action-buttons-row">
                  <button
                    className="btn-qv-add-cart"
                    onClick={() => {
                      addToCart(quickViewProduct, selectedVariant, quantity);
                      handleCloseQuickView();
                    }}
                    type="button"
                  >
                    <ShoppingCart size={17} />
                    <span>Add To Cart</span>
                  </button>

                  <button
                    className="btn-qv-buy-now"
                    onClick={() => {
                      const url = getWhatsAppProductOrderUrl(quickViewProduct, selectedVariant, quantity);
                      handleCloseQuickView();
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                    type="button"
                  >
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
