'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useUIModal } from '@/components/Providers';
import { 
  ShoppingBag, Eye, Star, Check, Heart, ArrowRight, 
  Flame, Tag, Zap
} from 'lucide-react';
import { getWhatsAppProductOrderUrl } from '@/lib/whatsapp';
import './ProductCard.css';

// Helper to get realistic, unique review count and rating per product
const getProductReviewCount = (p) => {
  if (p?.reviewsCount && p.reviewsCount !== 245 && p.reviewsCount !== 120) return p.reviewsCount;
  if (p?.numReviews && p.numReviews !== 245 && p.numReviews !== 120) return p.numReviews;
  const str = String(p?._id || p?.id || p?.name || 'prod');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const counts = [348, 512, 289, 417, 194, 628, 381, 275, 463, 580, 219, 395, 482, 310, 645];
  return counts[Math.abs(hash) % counts.length];
};

const getProductRating = (p) => {
  if (p?.rating && typeof p.rating === 'number') return Number(p.rating).toFixed(1);
  const str = String(p?._id || p?.id || p?.name || 'prod');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const ratings = ['4.9', '4.8', '5.0', '4.9', '4.8', '4.7', '4.9', '4.8'];
  return ratings[Math.abs(hash) % ratings.length];
};

export default function ProductCard({ product, onQuickView, onBuyNow }) {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const { t, isTamil, getProductName, getCategory } = useLanguage();
  const uiModal = useUIModal?.() || null;
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);
  const [added, setAdded] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [liked, setLiked] = useState(false);

  // Synchronize selectedVariant whenever product or product.variants update
  useEffect(() => {
    if (!product?.variants || product.variants.length === 0) {
      setSelectedVariant(null);
      return;
    }
    setSelectedVariant((prev) => {
      if (prev?.label) {
        const match = product.variants.find((v) => v.label === prev.label);
        if (match) return match;
      }
      return product.variants[0];
    });
  }, [product]);

  const productUrl = `/products/${product?._id || product?.slug || product?.id || ''}`;

  useEffect(() => {
    // Prefetch product and checkout routes for instantaneous 0ms transitions
    if (productUrl) router.prefetch(productUrl);
    router.prefetch('/checkout');
  }, [router, productUrl]);

  if (!product) return null;

  const price = selectedVariant?.price ?? product.price ?? 0;
  let originalPrice = selectedVariant?.originalPrice;
  if (!originalPrice) {
    if (product.originalPrice && product.price && product.originalPrice > product.price) {
      const ratio = product.originalPrice / product.price;
      originalPrice = Math.round(price * ratio);
    } else {
      originalPrice = Math.round(price * 1.25);
    }
  }

  const savings = Math.max(0, originalPrice - price);
  const discountPercent = originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  const ratingVal = getProductRating(product);
  const reviewCount = getProductReviewCount(product);

  const getFallbackImg = (p) => {
    const name = (p?.name || '').toLowerCase();
    const cat = (p?.category || '').toLowerCase();
    if (name.includes('turmeric') || name.includes('manjal') || name.includes('yellow') || name.includes('turm')) return '/assets/hero/turmeric.png';
    if (name.includes('chilli') || name.includes('chili') || name.includes('red')) return '/assets/hero/chilli.png';
    if (name.includes('coriander') || name.includes('mallie')) return '/assets/hero/coriander.png';
    if (name.includes('sambar') || name.includes('masala') || name.includes('garam')) return '/assets/hero/sambar.png';
    if (name.includes('coconut')) return '/assets/hero/oil_coconut.png';
    if (name.includes('groundnut')) return '/assets/hero/oil_groundnut.png';
    if (name.includes('gingelly') || name.includes('sesame')) return '/assets/hero/oil_gingelly.png';
    if (name.includes('oil') || cat.includes('oil')) return '/assets/hero/oil_sunflower.png';
    return '/assets/hero/turmeric.png';
  };

  const currentImage = product.imageUrl || (product.images && product.images[0]) || getFallbackImg(product);
  const hasVariants = product.variants?.length > 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, selectedVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    const url = getWhatsAppProductOrderUrl(product, selectedVariant, 1);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  const handleCardNavigate = (e) => {
    if (e?.target?.closest('button') || e?.target?.closest('a')) return;
    router.push(productUrl);
  };

  // Badge determination: Best Seller, Top Rated, or Custom
  const badgeType = (product.badge || '').toLowerCase();
  const isTopRated = badgeType.includes('top') || badgeType.includes('rated');

  const getBadgeLabel = () => {
    if (isTopRated) return isTamil ? 'உயர்தரம்' : 'Top Rated';
    if (isTamil) {
      if (product.tamilBadge) return product.tamilBadge;
      const b = (product.badge || '').toLowerCase();
      if (b.includes('signature') || b.includes('blend')) return 'கைமுறை கூட்டு';
      if (b.includes('traditional') || b.includes('recipe')) return 'பாரம்பரியம்';
      if (b.includes('stone') || b.includes('milled')) return 'கல் அரைப்பு';
      if (b.includes('natural') || b.includes('color')) return 'இயற்கை நிறம்';
      if (b.includes('curcumin')) return 'குர்குமின் 5.2%';
      if (b.includes('heart') || b.includes('healthy')) return 'ஆரோக்கியம்';
      if (b.includes('cold') || b.includes('wood')) return 'மரச்செக்கு';
      if (b.includes('best') || b.includes('seller')) return 'அதிக விற்பனை';
      return '100% இயற்கை';
    }
    return product.badge || 'Best Seller';
  };

  const badgeText = getBadgeLabel();
  const localizedTitle = getProductName ? getProductName(product) : product.name;
  const localizedCategory = getCategory ? getCategory(product.category) : (product.category || 'Farm Harvest');

  return (
    <div 
      className="product-card" 
      onClick={handleCardNavigate} 
      onMouseEnter={() => router.prefetch(productUrl)}
      style={{ cursor: 'pointer' }}
    >
      
      {/* ── Top Media Showcase Stage ── */}
      <div className="product-card-media">
        
        {/* Top-Left Badge */}
        <div className="product-top-badge">
          {isTopRated ? (
            <span className="badge-top-rated" title={badgeText}>
              <Star size={11} fill="#ffffff" color="#ffffff" />
              <span>{badgeText}</span>
            </span>
          ) : (
            <span className="badge-best-seller" title={badgeText}>
              <Flame size={12} className="flame-icon" fill="#ffffff" color="#ffffff" />
              <span>{badgeText}</span>
            </span>
          )}
        </div>

        {/* Wishlist Floating Button (Top-Right) */}
        <button 
          className={`wishlist-toggle-btn ${liked ? 'is-liked' : ''}`}
          onClick={toggleWishlist}
          title={t('wishlist', 'Save to Wishlist')}
          type="button"
          aria-label="Wishlist"
        >
          <Heart size={16} fill={liked ? '#ef4444' : 'none'} color={liked ? '#ef4444' : '#64748b'} />
        </button>

        {/* Product Image Link */}
        <Link 
          href={productUrl} 
          prefetch={true} 
          className="product-img-box" 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', textDecoration: 'none' }}
        >
          <img 
            src={currentImage} 
            alt={localizedTitle} 
            className="product-img" 
            loading="lazy" 
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getFallbackImg(product);
            }}
          />
        </Link>

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <button 
            className="quick-view-action" 
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
            aria-label="Quick View"
            type="button"
          >
            <Eye size={13} />
            <span>Quick View</span>
          </button>
        )}
      </div>

      {/* ── Product Card Body ── */}
      <div className="product-card-info">
        
        {/* Product Title */}
        <h3 className="product-title-heading" title={localizedTitle}>
          <Link href={productUrl} prefetch={true} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            {localizedTitle}
          </Link>
        </h3>

        {/* Category & Rating Row */}
        <div className="product-meta-row">
          <span className="product-category-text" title={localizedCategory}>
            {localizedCategory}
          </span>
          <div className="product-rating-row">
            <div className="rating-green-pill">
              <span className="rating-val">{ratingVal}</span>
              <Star size={9} fill="#ffffff" color="#ffffff" />
            </div>
            <span className="rating-review-count">({reviewCount})</span>
          </div>
        </div>

        {/* Pricing Row: Realworld E-Commerce (Flipkart & Amazon style with struck-out M.R.P.) */}
        <div className="product-pricing-row">
          <div className="price-main-group">
            <span className="price-current">₹{price.toLocaleString()}</span>
            {originalPrice > price && (
              <span className="price-mrp">
                M.R.P.: <span className="mrp-strike">₹{originalPrice.toLocaleString()}</span>
              </span>
            )}
          </div>

          {discountPercent > 0 && (
            <span className="discount-tag-pill">
              <Tag size={10} />
              <span>{discountPercent}% off</span>
            </span>
          )}
        </div>

        {/* Save Money Pill */}
        {savings > 0 && (
          <div className="savings-highlight-pill">
            <span className="savings-dot">●</span>
            <span>Save ₹{savings.toLocaleString()}</span>
          </div>
        )}

        {/* Variant Weight Selector (if available) */}
        {hasVariants && (
          <div className="product-variant-group">
            {product.variants.map((v) => {
              const isSelected = selectedVariant?.label === v.label;
              return (
                <button
                  key={v.label}
                  className={`variant-option-btn ${isSelected ? 'active' : ''}`}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setSelectedVariant(v); 
                  }}
                  type="button"
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Action Button Cluster (Add to Cart + Instant Buy Now) */}
        <div className="product-button-cluster">
          <button 
            className={`btn-add-cart ${added ? 'added-state' : ''}`} 
            onClick={handleAdd}
            type="button"
            title={t('addToCart', 'Add to Cart')}
          >
            {added ? (
              <>
                <Check size={14} />
                <span className="btn-cart-text">{t('addedToCart', 'Added')}</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span className="btn-cart-text">{t('addToCart', 'Add')}</span>
              </>
            )}
          </button>

          <button 
            className={`btn-buy-instant ${isBuying ? 'is-loading' : ''}`}
            onClick={handleBuyNow}
            disabled={isBuying}
            type="button"
            title={t('buyNow', 'Buy Now')}
          >
            <div className="buy-btn-content">
              <Zap size={14} className="bolt-icon" fill="#facc15" color="#facc15" />
              <span>{isBuying ? (isTamil ? 'செல்கிறது...' : 'Redirecting...') : t('buyNow', 'Buy Now')}</span>
            </div>
            <div className="buy-arrow-circle">
              <ArrowRight size={12} />
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}
