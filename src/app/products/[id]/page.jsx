'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Star, ShieldCheck, Heart, ShoppingBag, ArrowRight,
  Truck, CheckCircle2, ChevronRight, Plus, Minus,
  Sparkles, Award, Droplets, Leaf, MessageCircle,
  HelpCircle, Check, ZoomIn, ArrowLeft, ChevronLeft, Zap
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { INITIAL_PRODUCTS } from '@/data/initialCatalog';
import { getWhatsAppProductOrderUrl } from '@/lib/whatsapp';
import { toast } from 'react-toastify';
import './ProductDetail.css';

// Extract strictly this product's own images
const getProductImages = (product) => {
  if (!product) return [];

  // If product has array of images in DB
  if (Array.isArray(product.images) && product.images.length > 0) {
    const valid = product.images.filter(Boolean);
    if (valid.length > 0) return valid;
  }

  // If product has single imageUrl
  if (product.imageUrl) {
    return [product.imageUrl];
  }

  // Fallback only if product has no image at all in DB
  const name = (product.name || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();
  if (name.includes('turmeric') || name.includes('manjal')) return ['/assets/hero/turmeric.png'];
  if (name.includes('chilli') || name.includes('chili') || name.includes('red')) return ['/assets/hero/chilli.png'];
  if (name.includes('coriander') || name.includes('mallie')) return ['/assets/hero/coriander.png'];
  if (name.includes('sambar') || name.includes('masala') || name.includes('garam')) return ['/assets/hero/sambar.png'];
  if (name.includes('coconut')) return ['/assets/hero/oil_coconut.png'];
  if (name.includes('groundnut')) return ['/assets/hero/oil_groundnut.png'];
  if (name.includes('gingelly') || name.includes('sesame')) return ['/assets/hero/oil_gingelly.png'];
  if (name.includes('oil') || cat.includes('oil')) return ['/assets/hero/oil_sunflower.png'];
  return ['/assets/hero/turmeric.png'];
};

function ProductDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { t, isTamil, getProductName, getProductDesc, getCategory } = useLanguage();

  const productId = params?.id;
  const initialMatch = productId ? INITIAL_PRODUCTS.find(p => (p._id || p.id) === productId || p.slug === productId) : null;

  const [product, setProduct] = useState(initialMatch || null);
  const [allProducts, setAllProducts] = useState(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(!initialMatch);
  const [selectedVariant, setSelectedVariant] = useState(initialMatch?.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [isCheckingReview, setIsCheckingReview] = useState(false);

  // Zoom state
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  // Pincode checker state
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // Accordion active tab
  const [activeAccordion, setActiveAccordion] = useState('heritage');

  // Instant scroll to top on product change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [productId]);

  // 1. Fetch Product Detail and Catalog (Instant Display)
  useEffect(() => {
    let isMounted = true;
    const fetchProductData = async () => {
      try {
        if (!productId) return;

        // Step 1: Fetch single product details first for INSTANT loading
        const prodRes = await fetch(`/api/products/${productId}`)
          .then(r => r.ok ? r.json() : null)
          .catch(() => null);

        if (isMounted && prodRes && !prodRes.error && !prodRes.msg) {
          setProduct(prodRes);
          if (prodRes.variants?.length > 0) {
            setSelectedVariant(prodRes.variants[0]);
          }
          setLoading(false); // Unblock rendering immediately!
        }

        // Step 2: Asynchronously fetch catalog for related products without blocking
        fetch('/api/products')
          .then(r => r.ok ? r.json() : null)
          .then(catalogRes => {
            if (!isMounted) return;
            const fullCatalog = Array.isArray(catalogRes) 
              ? catalogRes 
              : (catalogRes?.products && Array.isArray(catalogRes.products) ? catalogRes.products : []);

            setAllProducts(fullCatalog);

            // Fallback if single product fetch had failed
            if (!prodRes || prodRes.error || prodRes.msg) {
              const matched = fullCatalog.find(p => (p._id || p.id) === productId || p.slug === productId);
              if (matched) {
                setProduct(matched);
                if (matched.variants?.length > 0) setSelectedVariant(matched.variants[0]);
              }
              setLoading(false);
            }
          })
          .catch(() => {
            if (isMounted) setLoading(false);
          });

      } catch (err) {
        console.error('Error loading product detail:', err);
        if (isMounted) setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => { isMounted = false; };
  }, [params?.id]);

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="pdp-container" style={{ padding: '80px 24px', textAlign: 'center' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 20px', width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#1B5E2F', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <h2 style={{ fontFamily: "'Cinzel', Georgia, serif", color: '#0f3d2a', fontSize: '20px' }}>Loading Product Details...</h2>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="pdp-container" style={{ padding: '80px 24px', textAlign: 'center' }}>
          <Leaf size={48} color="#1B5E2F" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontFamily: "'Cinzel', Georgia, serif", color: '#0f3d2a', fontSize: '24px', marginBottom: '8px' }}>Product Not Found</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>The product you are looking for is currently not available in our catalog.</p>
          <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#1B5E2F', color: '#ffffff', borderRadius: '10px', textDecoration: 'none', fontWeight: 700 }}>
            <ArrowLeft size={16} />
            <span>Explore All Products</span>
          </Link>
        </div>
      </div>
    );
  }

  // Strictly this product's own images
  const productImages = getProductImages(product);
  const currentImageUrl = productImages[activeImgIndex] || productImages[0];
  const hasMultipleImages = productImages.length > 1;

  // Price calculations (Mathematically 100% Accurate & Dynamic per selected variant)
  const unitPrice = selectedVariant?.price ?? product.price ?? 0;

  let originalPrice = selectedVariant?.originalPrice;
  if (!originalPrice) {
    if (product.originalPrice && product.price && product.originalPrice > product.price) {
      const ratio = product.originalPrice / product.price;
      originalPrice = Math.round(unitPrice * ratio);
    } else {
      originalPrice = Math.round(unitPrice * 1.25);
    }
  }

  const savingsPerUnit = Math.max(0, originalPrice - unitPrice);
  const discountPercent = originalPrice > unitPrice 
    ? Math.round(((originalPrice - unitPrice) / originalPrice) * 100) 
    : 0;

  const subtotalPrice = unitPrice * quantity;

  // Zoom Handler (Desktop Only)
  const handleMouseMove = (e) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 992) {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setZoomOrigin({ x, y });
    }
  };

  // Review logic
  const handleWriteReview = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to write a review.');
      return;
    }
    
    setIsCheckingReview(true);
    try {
      const res = await fetch('/api/orders/my-orders');
      if (res.ok) {
        const orders = await res.json();
        const bought = orders.some(order => 
          order.items && order.items.some(item => 
            (item.productId && item.productId === product._id) || 
            (item.name && item.name === product.name)
          )
        );
        if (bought) {
          toast.success('Thank you! You can now write a review.');
        } else {
          toast.warning('Only verified buyers who purchased this product can review it.');
        }
      } else {
        toast.error('Could not verify purchase history.');
      }
    } catch (err) {
      toast.error('Could not verify purchase history.');
    } finally {
      setIsCheckingReview(false);
    }
  };

  // Add to Cart Handlers
  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setAdded(true);
    toast.success(`Added ${quantity} × ${product.name} to cart!`);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    const url = getWhatsAppProductOrderUrl(product, selectedVariant, quantity);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Pincode delivery check
  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6 || isNaN(Number(pincode))) {
      setPincodeStatus({ success: false, msg: 'Please enter a valid 6-digit postal pincode.' });
      return;
    }
    const isTN = pincode.startsWith('6');
    setPincodeStatus({
      success: true,
      msg: isTN 
        ? 'Express 24-48 hr Delivery available in Tamil Nadu! Free Shipping eligible.' 
        : 'Standard 2-4 Days Express Dispatch across India. Free Shipping over ₹499.'
    });
  };

  // Related Products (products from same category or catalog excluding current product)
  const currentProdId = (product._id || product.id || '').toString();
  const currentCategory = (product.category || '').toLowerCase();

  const relatedProducts = allProducts
    .filter(p => (p._id || p.id || '').toString() !== currentProdId)
    .sort((a, b) => {
      const aCat = (a.category || '').toLowerCase();
      const bCat = (b.category || '').toLowerCase();
      const aMatch = aCat.includes(currentCategory) || currentCategory.includes(aCat);
      const bMatch = bCat.includes(currentCategory) || currentCategory.includes(bCat);
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    })
    .slice(0, 10);

  // Other Products row (cross-category explore)
  const otherProducts = allProducts
    .filter(p => {
      const pId = (p._id || p.id || '').toString();
      if (pId === currentProdId) return false;
      const isAlreadyInTopRelated = relatedProducts.slice(0, 4).some(r => (r._id || r.id || '').toString() === pId);
      return !isAlreadyInTopRelated;
    })
    .slice(0, 12);

  const finalOtherProducts = otherProducts.length >= 2 
    ? otherProducts 
    : allProducts.filter(p => (p._id || p.id || '').toString() !== currentProdId).slice(0, 10);

  const scrollRelated = (dir) => {
    const el = document.getElementById('relatedProductsGrid');
    if (el) {
      const scrollAmount = window.innerWidth < 768 ? 240 : 300;
      el.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollOther = (dir) => {
    const el = document.getElementById('otherProductsGrid');
    if (el) {
      const scrollAmount = window.innerWidth < 768 ? 240 : 300;
      el.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };


  return (
    <div className="product-detail-page">
      <div className="pdp-container">
        
        {/* ── Breadcrumbs ── */}
        <nav className="pdp-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/home">{t('pdpBreadcrumbsHome', 'Home')}</Link>
          <span className="breadcrumb-sep">/</span>
          <Link href="/products">{t('pdpBreadcrumbsProducts', 'Products')}</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-cat">{getCategory(product.category) || t('categories', 'Store')}</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{getProductName(product)}</span>
        </nav>

        {/* ── Main Product Stage (2-Column Grid) ── */}
        <div className="pdp-main-grid">
          
          {/* ════════════════════════════════════════════════════════════
              LEFT COLUMN: THIS PRODUCT'S OWN IMAGE GALLERY WITH ZOOM
              ════════════════════════════════════════════════════════════ */}
          <div className="pdp-gallery-wrap">
            
            {/* Main Stage Image with Zoom Lens */}
            <div className="pdp-main-stage">
              
              {/* Badges */}
              <div className="pdp-stage-badges">
                {product.badge && (
                  <span className="pdp-badge-organic">
                    <Leaf size={12} />
                    <span>{isTamil ? (product.tamilBadge || '100% இயற்கை') : product.badge}</span>
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="pdp-badge-discount">{discountPercent}% {isTamil ? 'தள்ளுபடி' : 'OFF'}</span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                className={`pdp-wishlist-btn ${liked ? 'active' : ''}`}
                onClick={() => setLiked(!liked)}
                title={t('wishlist', 'Save to Wishlist')}
                aria-label={t('wishlist', 'Save to Wishlist')}
              >
                <Heart size={18} fill={liked ? '#ef4444' : 'none'} color={liked ? '#ef4444' : '#475569'} />
              </button>

              {/* Interactive Zoom Box */}
              <div
                className="pdp-image-zoom-box"
                onMouseEnter={() => {
                  if (typeof window !== 'undefined' && window.innerWidth >= 992) {
                    setIsZoomed(true);
                  }
                }}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={currentImageUrl}
                  alt={getProductName(product)}
                  className="pdp-main-img"
                  style={{
                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                    transform: isZoomed ? 'scale(1.85)' : 'none'
                  }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/hero/turmeric.png';
                  }}
                />
                {!isZoomed && (
                  <div className="pdp-zoom-hint">
                    <ZoomIn size={12} />
                    <span>{t('pdpHoverZoom', 'Hover to Zoom')}</span>
                  </div>
                )}
              </div>

              {/* Mobile Swipe Pagination Dots */}
              {hasMultipleImages && (
                <div className="pdp-mobile-dots">
                  {productImages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`pdp-mobile-dot ${activeImgIndex === idx ? 'active' : ''}`}
                      onClick={() => setActiveImgIndex(idx)}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

            </div>

            {/* Show thumbnails BELOW the main stage box */}
            {hasMultipleImages && (
              <div className="pdp-thumbnails-strip">
                {productImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`pdp-thumb-item ${activeImgIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImgIndex(idx)}
                    onMouseEnter={() => setActiveImgIndex(idx)}
                    aria-label={`View Image ${idx + 1}`}
                  >
                    <img src={imgUrl} alt={`${getProductName(product)} angle ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* ════════════════════════════════════════════════════════════
              RIGHT COLUMN: PRODUCT DETAILS & PURCHASE HUB
              ════════════════════════════════════════════════════════════ */}
          <div className="pdp-details-wrap">
            
            {/* Category & Ratings & Stock */}
            <div className="pdp-header-meta">
              <span className="pdp-category-tag">{getCategory(product.category) || 'General'}</span>
              
              <div className="pdp-rating-strip">
                <div className="pdp-rating-pill">
                  <span>{product.rating ? Number(product.rating).toFixed(1) : '4.9'}</span>
                  <Star size={10} fill="#ffffff" color="#ffffff" />
                </div>
                <span className="pdp-rating-count">({product.reviewsCount || 480}+ {isTamil ? 'மதிப்பீடுகள்' : 'ratings'})</span>
                <span className="pdp-stock-status">
                  <CheckCircle2 size={12} />
                  <span>{t('pdpInStock', 'In Stock')}</span>
                </span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="pdp-title">{getProductName(product)}</h1>
            <p className="pdp-subtitle">
              {getProductDesc(product) || (isTamil ? 'உயர்ந்த அக்கறையுடனும் தரத்துடனும் தயாரிக்கப்பட்ட தூய இயற்கை தயாரிப்பு.' : 'Pure unadulterated quality produced with highest care and standards.')}
            </p>

            {/* Realworld E-Commerce Pricing Box */}
            <div className="pdp-pricing-card">
              <div className="pdp-price-row">
                <span className="pdp-current-price">₹{unitPrice.toLocaleString()}</span>
                {originalPrice > unitPrice && (
                  <span className="pdp-mrp-group">
                    <span className="pdp-mrp-label">M.R.P.:</span>
                    <span className="pdp-strike-price">₹{originalPrice.toLocaleString()}</span>
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="pdp-discount-pill">
                    {isTamil ? `${discountPercent}% தள்ளுபடி` : `${discountPercent}% off`}
                  </span>
                )}
              </div>
              {savingsPerUnit > 0 && (
                <div className="pdp-savings-row">
                  <span className="pdp-savings-badge">
                    {isTamil ? `🎉 நீங்கள் ₹${savingsPerUnit.toLocaleString()} சேமிக்கிறீர்கள்` : `🎉 You Save: ₹${savingsPerUnit.toLocaleString()}`}
                  </span>
                </div>
              )}
              <p className="pdp-tax-notice">
                {t('pdpTaxNotice', 'Inclusive of all taxes • 🚚 Free Delivery on orders above ₹499')}
              </p>
            </div>

            {/* Variant Selector (if product has variants) */}
            {product.variants?.length > 0 && (
              <div className="pdp-section-block">
                <div className="pdp-block-label">
                  <span>{t('pdpSelectSize', 'Select Size / Quantity:')}</span>
                  {selectedVariant && <span style={{ color: '#1B5E2F' }}>{selectedVariant.label}</span>}
                </div>
                <div className="pdp-variants-list">
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant?.label === variant.label;
                    return (
                      <button
                        key={variant.label}
                        type="button"
                        className={`pdp-variant-chip ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedVariant(variant)}
                      >
                        <span>{variant.label}</span>
                        <span className="pdp-variant-price-addon">₹{variant.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Subtotal Row */}
            <div className="pdp-qty-row">
              <div className="pdp-qty-control">
                <button
                  type="button"
                  className="pdp-qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span className="pdp-qty-val">{quantity}</span>
                <button
                  type="button"
                  className="pdp-qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>

              <div className="pdp-subtotal-preview">
                {t('pdpTotalAmount', 'Total Amount:')} <strong>₹{subtotalPrice}</strong>
              </div>
            </div>

            {/* Dual Action Buttons (Desktop Inline, Mobile Sticky) */}
            <div className="pdp-action-cluster">
              <button
                type="button"
                className="pdp-btn-add"
                onClick={handleAddToCart}
              >
                {added ? (
                  <>
                    <Check size={18} />
                    <span>{t('pdpAddedToCart', 'Added To Cart')}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>{t('pdpAddToCart', 'Add to Cart')}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="pdp-btn-buy"
                onClick={handleBuyNow}
              >
                <div className="pdp-buy-btn-content">
                  <Zap size={16} className="pdp-bolt-icon" fill="#facc15" color="#facc15" />
                  <span>{t('pdpBuyNow', 'Buy Now')}</span>
                </div>
                <div className="pdp-buy-arrow-circle">
                  <ArrowRight size={14} />
                </div>
              </button>
            </div>

            {/* Pincode Delivery Estimator */}
            <div className="pdp-pincode-card">
              <div className="pdp-pincode-label">
                <Truck size={15} color="#1B5E2F" />
                <span>{t('pdpDeliveryAvailability', 'Delivery Availability:')}</span>
              </div>
              <form onSubmit={handlePincodeCheck} className="pdp-pincode-form">
                <input
                  type="text"
                  maxLength={6}
                  placeholder={t('pdpEnterPincode', 'Enter 6-digit Pincode')}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="pdp-pincode-input"
                />
                <button type="submit" className="pdp-pincode-check-btn">
                  {t('pdpCheck', 'Check')}
                </button>
              </form>
              {pincodeStatus && (
                <div className={`pdp-pincode-result ${!pincodeStatus.success ? 'error' : ''}`} style={{ color: pincodeStatus.success ? '#15803d' : '#dc2626' }}>
                  {pincodeStatus.success ? <CheckCircle2 size={13} /> : <HelpCircle size={13} />}
                  <span>
                    {!pincodeStatus.success 
                      ? (isTamil ? 'சரியான 6 இலக்க அஞ்சல் குறியீட்டை உள்ளிடவும்.' : pincodeStatus.msg)
                      : (isTamil 
                          ? (pincode.startsWith('6') ? 'தமிழ்நாடு முழுவதும் 24-48 மணிநேர விரைவு டெலிவரி கிடைக்கும்! இலவச ஷிப்பிங் உண்டு.' : 'இந்தியா முழுவதும் 2-4 நாட்களில் விரைவு டெஸ்பாட்ச். ₹499-க்கு மேல் இலவச டெலிவரி.')
                          : pincodeStatus.msg)}
                  </span>
                </div>
              )}
            </div>

            {/* 4 Value Pillars Strip */}
            <div className="pdp-pillars-grid">
              <div className="pdp-pillar-item">
                <div className="pdp-pillar-icon"><Droplets size={18} /></div>
                <div className="pdp-pillar-text">
                  <h4>{t('pdpPurePillar1', '100% Pure & Authentic')}</h4>
                  <p>{t('pdpPurePillar1Desc', 'Extracted naturally to preserve maximum nutrients')}</p>
                </div>
              </div>

              <div className="pdp-pillar-item">
                <div className="pdp-pillar-icon"><Leaf size={18} /></div>
                <div className="pdp-pillar-text">
                  <h4>{t('pdpPurePillar2', 'Chemical & Preservative Free')}</h4>
                  <p>{t('pdpPurePillar2Desc', 'Zero artificial colors, flavors, or adulterants')}</p>
                </div>
              </div>

              <div className="pdp-pillar-item">
                <div className="pdp-pillar-icon"><ShieldCheck size={18} /></div>
                <div className="pdp-pillar-text">
                  <h4>{t('pdpPurePillar3', 'Quality & Lab Tested')}</h4>
                  <p>{t('pdpPurePillar3Desc', 'Tested for highest food safety and purity standards')}</p>
                </div>
              </div>

              <div className="pdp-pillar-item">
                <div className="pdp-pillar-icon"><Sparkles size={18} /></div>
                <div className="pdp-pillar-text">
                  <h4>{t('pdpPurePillar4', 'Direct From Source')}</h4>
                  <p>{t('pdpPurePillar4Desc', 'Farm fresh produce delivered straight to your home')}</p>
                </div>
              </div>
            </div>

            {/* Expandable Tabs & Accordions */}
            <div className="pdp-accordion-wrap">
              
              {/* Accordion 1: Description & Details */}
              <div className="pdp-accordion-item">
                <button
                  type="button"
                  className="pdp-accordion-header"
                  onClick={() => setActiveAccordion(activeAccordion === 'heritage' ? '' : 'heritage')}
                >
                  <span>{t('pdpAccordionInfo', 'Product Information & Details')}</span>
                  <span>{activeAccordion === 'heritage' ? '−' : '+'}</span>
                </button>
                {activeAccordion === 'heritage' && (
                  <div className="pdp-accordion-body">
                    <p>
                      {getProductDesc(product) || (isTamil ? 'இயற்கை நன்மைகள், அசல் நறுமணம் மற்றும் ஊட்டச்சத்துக்கள் குறையாமல் பாரம்பரிய தயாரிப்பு முறையில் தயாரிக்கப்பட்டது.' : 'Produced using traditional processing methods to retain raw goodness, authentic aroma, and essential natural qualities.')}
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Key Benefits */}
              <div className="pdp-accordion-item">
                <button
                  type="button"
                  className="pdp-accordion-header"
                  onClick={() => setActiveAccordion(activeAccordion === 'benefits' ? '' : 'benefits')}
                >
                  <span>{t('pdpAccordionBenefits', 'Key Benefits & Uses')}</span>
                  <span>{activeAccordion === 'benefits' ? '−' : '+'}</span>
                </button>
                {activeAccordion === 'benefits' && (
                  <div className="pdp-accordion-body">
                    <ul className="pdp-benefits-list">
                      <li>
                        <CheckCircle2 size={14} /> 
                        <strong>{isTamil ? 'ஊட்டச்சத்து நிறைந்தது:' : 'Nutrient-Dense:'}</strong> {isTamil ? 'இயற்கையான வைட்டமின்கள் மற்றும் தாதுக்கள் காக்கப்படுகின்றன.' : 'Retains active natural goodness and vitamins.'}
                      </li>
                      <li>
                        <CheckCircle2 size={14} /> 
                        <strong>{isTamil ? 'இயற்கையானது & தூய்மையானது:' : 'Natural & Pure:'}</strong> {isTamil ? 'எந்தவித ரசாயன சுத்திகரிப்பு மற்றும் நிறமூட்டல் இல்லை.' : 'No chemical refining, bleaching, or deodorizing.'}
                      </li>
                      <li>
                        <CheckCircle2 size={14} /> 
                        <strong>{isTamil ? 'சிறந்த சுவை & மணம்:' : 'Great Flavor:'}</strong> {isTamil ? 'பாரம்பரிய சுவையையும் நறுமணத்தையும் சமையலுக்கு வழங்குகிறது.' : 'Imparts authentic taste and rich aroma to daily dishes.'}
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 3: Storage */}
              <div className="pdp-accordion-item">
                <button
                  type="button"
                  className="pdp-accordion-header"
                  onClick={() => setActiveAccordion(activeAccordion === 'usage' ? '' : 'usage')}
                >
                  <span>{t('pdpAccordionStorage', 'Storage & Shelf Life')}</span>
                  <span>{activeAccordion === 'usage' ? '−' : '+'}</span>
                </button>
                {activeAccordion === 'usage' && (
                  <div className="pdp-accordion-body">
                    <p>
                      {isTamil 
                        ? 'நேரடி சூரிய ஒளி மற்றும் ஈரப்பதம் படாத குளிர்ந்த, உலர்ந்த இடத்தில் சேமிக்கவும். பயன்படுத்திய பின் மூடியை இறுக்கமாக மூடவும். தயாரித்த தேதியிலிருந்து 12 மாதங்கள் வரை உகந்தது.' 
                        : 'Store in a cool, dry place away from direct sunlight and moisture. Seal container tightly after use. Best before 12 months from manufacture.'}
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* ════════════════════════════════════════════════════════════
            BOTTOM SECTION: RELATED PRODUCTS (SUGGESTIONS ON SCROLL)
            ════════════════════════════════════════════════════════════ */}
        {relatedProducts.length > 0 && (
          <section className="pdp-related-section">
            <div className="pdp-section-header-row">
              <div>
                <h2 className="pdp-section-title">{t('pdpRelatedTitle', 'Related Products')}</h2>
                <p className="pdp-section-sub">{t('pdpRelatedSub', 'Customers who viewed this item also explored')}</p>
              </div>
              <div className="pdp-carousel-nav">
                <button type="button" onClick={() => scrollRelated('left')} aria-label="Scroll left">
                  <ChevronLeft size={20} />
                </button>
                <button type="button" onClick={() => scrollRelated('right')} aria-label="Scroll right">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="pdp-related-grid" id="relatedProductsGrid">
              {relatedProducts.map((relProduct) => (
                <ProductCard
                  key={relProduct._id}
                  product={relProduct}
                  onBuyNow={(prod, variant, itemKey) => {
                    router.push(`/checkout${itemKey ? `?buyNow=${encodeURIComponent(itemKey)}` : ''}`);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════════
            SEE OUR OTHER PRODUCTS SECTION (EXPLORE MORE ROW)
            ════════════════════════════════════════════════════════════ */}
        {finalOtherProducts.length > 0 && (
          <section className="pdp-related-section pdp-other-products-section">
            <div className="pdp-section-header-row">
              <div>
                <h2 className="pdp-section-title">{isTamil ? 'எங்கள் பிற தயாரிப்புகள்' : 'See Our Other Products'}</h2>
                <p className="pdp-section-sub">{isTamil ? 'வெண்துளிர் இயற்கை விளைபொருட்களின் பிற சிறந்த வகைகள்' : 'Explore more premium natural & organic harvests from our store'}</p>
              </div>
              <div className="pdp-carousel-nav">
                <button type="button" onClick={() => scrollOther('left')} aria-label="Scroll left">
                  <ChevronLeft size={20} />
                </button>
                <button type="button" onClick={() => scrollOther('right')} aria-label="Scroll right">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="pdp-related-grid" id="otherProductsGrid">
              {finalOtherProducts.map((othProduct) => (
                <ProductCard
                  key={othProduct._id || othProduct.id}
                  product={othProduct}
                  onBuyNow={(prod, variant, itemKey) => {
                    router.push(`/checkout${itemKey ? `?buyNow=${encodeURIComponent(itemKey)}` : ''}`);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════════
            CUSTOMER REVIEWS SECTION
            ════════════════════════════════════════════════════════════ */}
        <section className="pdp-reviews-section">
          {/* Section Header */}
          <div className="pdp-reviews-header">
            <div>
              <div className="pdp-reviews-eyebrow">
                <ShieldCheck size={14} />
                <span>100% VERIFIED CUSTOMER EXPERIENCES</span>
              </div>
              <h2 className="pdp-reviews-main-title">
                {isTamil ? 'வாடிக்கையாளர் மதிப்புரைகள் & சான்றுகள்' : 'Customer Reviews & Feedback'}
              </h2>
            </div>

            <button
              type="button"
              className="pdp-write-review-btn-header"
              onClick={handleWriteReview}
              disabled={isCheckingReview}
            >
              <Sparkles size={15} />
              <span>{isCheckingReview ? (isTamil ? 'சரிபார்க்கிறது...' : 'Verifying...') : (isTamil ? 'மதிப்புரை எழுதவும்' : 'Write a Review')}</span>
            </button>
          </div>

          <div className="pdp-reviews-layout">
            {/* Left Column: Modern Rating Breakdown & Guarantee */}
            <div className="pdp-rating-summary-card">
              <div className="pdp-score-display">
                <div className="pdp-score-huge">4.9</div>
                <div className="pdp-score-meta">
                  <div className="pdp-score-stars-row">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={17} fill="#F59E0B" color="#F59E0B" />
                    ))}
                  </div>
                  <span className="pdp-score-subtext">520+ {isTamil ? 'மதிப்பீடுகள்' : 'Verified Ratings'}</span>
                </div>
              </div>

              <div className="pdp-recommend-badge">
                <CheckCircle2 size={14} />
                <span>98% {isTamil ? 'வாடிக்கையாளர்கள் பரிந்துரைக்கிறார்கள்' : 'of customers recommend this'}</span>
              </div>

              {/* Progress bars */}
              <div className="pdp-rating-bars-list">
                <div className="pdp-bar-item">
                  <span className="pdp-bar-label">5 ★</span>
                  <div className="pdp-bar-track">
                    <div className="pdp-bar-progress" style={{ width: '92%' }} />
                  </div>
                  <span className="pdp-bar-pct">92%</span>
                </div>
                <div className="pdp-bar-item">
                  <span className="pdp-bar-label">4 ★</span>
                  <div className="pdp-bar-track">
                    <div className="pdp-bar-progress" style={{ width: '6%' }} />
                  </div>
                  <span className="pdp-bar-pct">6%</span>
                </div>
                <div className="pdp-bar-item">
                  <span className="pdp-bar-label">3 ★</span>
                  <div className="pdp-bar-track">
                    <div className="pdp-bar-progress" style={{ width: '2%' }} />
                  </div>
                  <span className="pdp-bar-pct">2%</span>
                </div>
                <div className="pdp-bar-item">
                  <span className="pdp-bar-label">2 ★</span>
                  <div className="pdp-bar-track">
                    <div className="pdp-bar-progress" style={{ width: '0%' }} />
                  </div>
                  <span className="pdp-bar-pct">0%</span>
                </div>
                <div className="pdp-bar-item">
                  <span className="pdp-bar-label">1 ★</span>
                  <div className="pdp-bar-track">
                    <div className="pdp-bar-progress" style={{ width: '0%' }} />
                  </div>
                  <span className="pdp-bar-pct">0%</span>
                </div>
              </div>

              <div className="pdp-trust-note">
                <ShieldCheck size={13} />
                <span>{isTamil ? 'உறுதிப்படுத்தப்பட்ட வாடிக்கையாளர் மட்டுமே' : 'Only verified buyers who purchased this product can leave a review.'}</span>
              </div>
            </div>

            {/* Right Grid: 4 Symmetrical Premium Review Cards */}
            <div className="pdp-reviews-cards-grid">
              {/* Card 1 */}
              <div className="pdp-luxury-review-card">
                <div className="pdp-card-top-row">
                  <div className="pdp-user-info-group">
                    <div className="pdp-user-avatar-circle">S</div>
                    <div>
                      <h4 className="pdp-user-full-name">Sundaramurthy K.</h4>
                      <div className="pdp-buyer-pill">
                        <Check size={10} />
                        <span>{t('pdpVerifiedBuyer', 'Verified Buyer')} • {isTamil ? 'சென்னை' : 'Chennai'}</span>
                      </div>
                    </div>
                  </div>
                  <span className="pdp-card-timestamp">{isTamil ? '2 நாட்களுக்கு முன்' : '2 days ago'}</span>
                </div>

                <div className="pdp-card-star-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>

                <p className="pdp-card-comment">
                  {isTamil 
                    ? '"மரச்செக்கு எண்ணெயின் அசல் மணம் மற்றும் தூய்மை அருமை. பேக்கிங் மிகவும் பாதுகாப்பாக வந்து சேர்ந்தது!"'
                    : '"Pure authentic wood cold-pressed quality and exceptional freshness. Arrived quickly in leak-proof packaging!"'}
                </p>
              </div>

              {/* Card 2 */}
              <div className="pdp-luxury-review-card">
                <div className="pdp-card-top-row">
                  <div className="pdp-user-info-group">
                    <div className="pdp-user-avatar-circle">P</div>
                    <div>
                      <h4 className="pdp-user-full-name">Priyadharshini R.</h4>
                      <div className="pdp-buyer-pill">
                        <Check size={10} />
                        <span>{t('pdpVerifiedBuyer', 'Verified Buyer')} • {isTamil ? 'கோயம்புத்தூர்' : 'Coimbatore'}</span>
                      </div>
                    </div>
                  </div>
                  <span className="pdp-card-timestamp">{isTamil ? '1 வாரத்திற்கு முன்' : '1 week ago'}</span>
                </div>

                <div className="pdp-card-star-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>

                <p className="pdp-card-comment">
                  {isTamil 
                    ? '"இயற்கையான நறுமணமும் சிறந்த தரமும் நிறைந்துள்ளது. சமையலில் அற்புதமான சுவை கிடைக்கிறது. நிச்சயமாக மீண்டும் வாங்குவேன்!"'
                    : '"Very happy with this order. Truly unrefined aroma and rich golden texture. Imparts rich South Indian flavor to dishes."'}
                </p>
              </div>

              {/* Card 3 */}
              <div className="pdp-luxury-review-card">
                <div className="pdp-card-top-row">
                  <div className="pdp-user-info-group">
                    <div className="pdp-user-avatar-circle">M</div>
                    <div>
                      <h4 className="pdp-user-full-name">Madhavan S.</h4>
                      <div className="pdp-buyer-pill">
                        <Check size={10} />
                        <span>{t('pdpVerifiedBuyer', 'Verified Buyer')} • {isTamil ? 'மதுரை' : 'Madurai'}</span>
                      </div>
                    </div>
                  </div>
                  <span className="pdp-card-timestamp">{isTamil ? '2 வாரங்களுக்கு முன்' : '2 weeks ago'}</span>
                </div>

                <div className="pdp-card-star-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>

                <p className="pdp-card-comment">
                  {isTamil 
                    ? '"உயர்தர தூய்மை மற்றும் அருமையான சுவை. நியாயமான விலையில் கிடைக்கும் உண்மையான இயற்கை தயாரிப்பு."'
                    : '"Top-tier purity and authentic taste. Completely free from chemical processing. Excellent value for genuine organic harvests."'}
                </p>
              </div>

              {/* Card 4 */}
              <div className="pdp-luxury-review-card">
                <div className="pdp-card-top-row">
                  <div className="pdp-user-info-group">
                    <div className="pdp-user-avatar-circle">A</div>
                    <div>
                      <h4 className="pdp-user-full-name">Ananya N.</h4>
                      <div className="pdp-buyer-pill">
                        <Check size={10} />
                        <span>{t('pdpVerifiedBuyer', 'Verified Buyer')} • {isTamil ? 'பெங்களூரு' : 'Bengaluru'}</span>
                      </div>
                    </div>
                  </div>
                  <span className="pdp-card-timestamp">{isTamil ? '3 வாரங்களுக்கு முன்' : '3 weeks ago'}</span>
                </div>

                <div className="pdp-card-star-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>

                <p className="pdp-card-comment">
                  {isTamil 
                    ? '"பாரம்பரிய முறையில் தயார் செய்யப்பட்ட தூய்மையான தரம். குடும்பத்தின் ஆரோக்கியத்திற்கு மிகச் சிறந்தது!"'
                    : '"You can immediately sense the difference in purity and aroma compared to supermarket brands. Will remain a regular customer!"'}
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <React.Suspense
      fallback={
        <div
          style={{
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FDFBF7',
            color: '#1B5E2F',
            fontFamily: 'Inter, sans-serif',
            fontSize: '1.1rem',
          }}
        >
          Loading product...
        </div>
      }
    >
      <ProductDetailPageContent />
    </React.Suspense>
  );
}

