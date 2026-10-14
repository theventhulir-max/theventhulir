'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useUIModal } from '@/components/Providers';
import { 
  Search, X, ArrowUpDown, Leaf, Droplets, 
  ShieldCheck, Package, ShoppingCart, Plus, Minus, Star 
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { INITIAL_PRODUCTS } from '@/data/initialCatalog';
import { getWhatsAppProductOrderUrl } from '@/lib/whatsapp';
import './ProductsPage.css';

const API = '/api';

function ProductsPageContent({ onCheckout }) {
  const { addToCart, setIsCartOpen } = useCart();
  const { t, isTamil, getCategory, getProductName, getProductDesc } = useLanguage();
  const uiModal = useUIModal?.() || null;
  const handleCheckout = onCheckout || uiModal?.openCheckout;
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Quick View Modal State
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [zoomState, setZoomState] = useState({ isZoomed: false, x: 50, y: 50 });

  // Sync state from URL query params (e.g. ?category=Spice%20Powders or ?search=oil)
  useEffect(() => {
    const cat = searchParams?.get('category');
    const search = searchParams?.get('search');
    if (cat) {
      setActiveCategory(cat);
    } else {
      setActiveCategory('All');
    }
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  const handleZoomMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomState({ isZoomed: true, x, y });
  };

  const handleZoomMouseLeave = () => {
    setZoomState({ isZoomed: false, x: 50, y: 50 });
  };

  const handleOpenQuickView = (product) => {
    setQuickViewProduct(product);
    setSelectedVariant(product.variants?.[0] || null);
    setQuantity(1);
    setActiveImgIndex(0);
    setZoomState({ isZoomed: false, x: 50, y: 50 });
    document.body.style.overflow = 'hidden';
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
    setSelectedVariant(null);
    setQuantity(1);
    setActiveImgIndex(0);
    setZoomState({ isZoomed: false, x: 50, y: 50 });
    document.body.style.overflow = '';
  };

  const fetchCatalog = useCallback(async (cat, query, sort) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (cat && cat !== 'All') params.set('category', cat);
      if (query && query.trim()) params.set('search', query.trim());
      if (sort) params.set('sort', sort);
      params.set('limit', '60');

      const res = await fetch(`${API}/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Catalog fetch error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const timer = setTimeout(() => {
        fetchCatalog(activeCategory, searchQuery, sortBy);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      fetchCatalog(activeCategory, searchQuery, sortBy);
    }
  }, [activeCategory, searchQuery, sortBy, fetchCatalog]);

  const categories = ['All', 'Spices & Powders', 'Masala Blends'];

  const handleCategoryFilterClick = (catName) => {
    setActiveCategory(catName);
    if (catName === 'All') {
      router.push('/products', { scroll: false });
    } else {
      router.push(`/products?category=${encodeURIComponent(catName)}`, { scroll: false });
    }
  };

  const filteredProducts = products
    .filter((p) => {
      let matchCategory = true;
      if (activeCategory && activeCategory !== 'All' && activeCategory !== 'all') {
        matchCategory = pMatchesCategory(activeCategory, p.category || '');
      }

      const matchSearch = !searchQuery || 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.badge && p.badge.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      // Default: newest products first
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeA && timeB && timeA !== timeB) return timeB - timeA;
      if (timeA && !timeB) return -1;
      if (!timeA && timeB) return 1;
      return (b._id || b.id || '').localeCompare(a._id || a.id || '');
    });

  const qvImages = quickViewProduct
    ? (quickViewProduct.images?.length ? quickViewProduct.images : [quickViewProduct.imageUrl].filter(Boolean))
    : [];
  const qvPrice = selectedVariant?.price ?? quickViewProduct?.price ?? 0;
  let qvOriginalPrice = selectedVariant?.originalPrice;
  if (!qvOriginalPrice && quickViewProduct) {
    if (quickViewProduct.originalPrice && quickViewProduct.price && quickViewProduct.originalPrice > quickViewProduct.price) {
      const ratio = quickViewProduct.originalPrice / quickViewProduct.price;
      qvOriginalPrice = Math.round(qvPrice * ratio);
    } else {
      qvOriginalPrice = Math.round(qvPrice * 1.25);
    }
  }
  const qvSavings = Math.max(0, (qvOriginalPrice || 0) - qvPrice);
  const qvDiscount = (qvOriginalPrice && qvOriginalPrice > qvPrice)
    ? Math.round(((qvOriginalPrice - qvPrice) / qvOriginalPrice) * 100)
    : 0;

  return (
    <div className="products-page-root">
      {/* Main Catalog Section */}
      <section className="products-catalog-section">
        <div className="container">
          
          {/* Top Controls: Omnisearch & Sort */}
          <div className="catalog-toolbar">
            <div className="catalog-search-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder={isTamil ? "மசாலா, எண்ணெய், விரலி மஞ்சள், சாம்பார் பொடி..." : "Search oils, turmeric, chilli, sambar..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="catalog-sort-wrapper">
              <ArrowUpDown size={15} className="sort-icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="featured">{isTamil ? "முக்கிய தயாரிப்புகள்" : "Featured & Bestsellers"}</option>
                <option value="price-asc">{isTamil ? "விலை: குறைந்தது முதல் அதிகம்" : "Price: Low to High"}</option>
                <option value="price-desc">{isTamil ? "விலை: அதிகம் முதல் குறைந்தது" : "Price: High to Low"}</option>
                <option value="rating">{isTamil ? "உயர்ந்த மதிப்பீடு (★)" : "Highest Rated (★)"}</option>
                <option value="name">{isTamil ? "பெயர் வரிசை (A-Z)" : "Product Name (A-Z)"}</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="catalog-category-pills">
            {categories.map((cat) => {
              const isPillActive = 
                (cat === 'All' && (activeCategory === 'All' || !activeCategory)) ||
                (cat !== 'All' && activeCategory && activeCategory !== 'All' && pMatchesCategory(cat, activeCategory));
              const displayLabel = cat === 'All' ? (isTamil ? 'அனைத்து பொருட்கள்' : 'All') : getCategory(cat);
              return (
                <button
                  key={cat}
                  className={`category-pill-btn ${isPillActive ? 'active' : ''}`}
                  onClick={() => handleCategoryFilterClick(cat)}
                >
                  {displayLabel}
                </button>
              );
            })}
          </div>

          {/* Results Count & Active Filter Indicator */}
          <div className="catalog-results-info">
            <span>{isTamil ? <>காட்டப்படும் பொருட்கள்: <strong>{filteredProducts.length}</strong></> : <>Showing <strong>{filteredProducts.length}</strong> products</>}</span>
            {(activeCategory !== 'All' || searchQuery) && (
              <button 
                className="btn-clear-filters"
                onClick={() => {
                  handleCategoryFilterClick('All');
                  setSearchQuery('');
                  setSortBy('featured');
                }}
              >
                {isTamil ? 'வடிகட்டிகளை அழிக்க' : 'Reset All Filters'}
              </button>
            )}
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="catalog-empty-state">
              <Package size={48} />
              <h3>{isTamil ? 'பொருந்திய விளைபொருட்கள் கிடைக்கவில்லை' : 'No products match your criteria'}</h3>
              <p>{isTamil ? 'தேடல் சொல்லை மாற்றவும் அல்லது வேறு பிரிவைத் தேர்ந்தெடுக்கவும்.' : 'Try clearing your search keyword or selecting a different category.'}</p>
              <button
                className="btn-reset-catalog"
                onClick={() => {
                  handleCategoryFilterClick('All');
                  setSearchQuery('');
                }}
              >
                {isTamil ? 'அனைத்து பொருட்களையும் காண்க' : 'Show All Products'}
              </button>
            </div>
          ) : (
            <div className="catalog-products-grid">
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

      {/* Trust Strip */}
      <section className="catalog-trust-strip">
        <div className="container">
          <div className="trust-strip-grid">
            <div className="trust-strip-item">
              <Leaf size={22} className="trust-icon" />
              <div>
                <strong>{isTamil ? '100% அசல் இயற்கை' : '100% Single-Origin'}</strong>
                <span>{isTamil ? 'தமிழ்நாட்டு பாரம்பரிய விதைகள் & மசாலா' : 'Native Tamil Seeds & Spices'}</span>
              </div>
            </div>
            <div className="trust-strip-item">
              <Droplets size={22} className="trust-icon" />
              <div>
                <strong>{isTamil ? 'வாகை மரச்செக்கு தயாரிப்பு' : 'Wooden Chekku Pressed'}</strong>
                <span>{isTamil ? '40°C-க்கும் குறைவான குளிர்ந்த பிழிதல்' : 'Cold extracted below 40°C'}</span>
              </div>
            </div>
            <div className="trust-strip-item">
              <ShieldCheck size={22} className="trust-icon" />
              <div>
                <strong>{isTamil ? 'ரசாயனம் அற்ற தூய்மை' : 'Zero Chemical Additives'}</strong>
                <span>{isTamil ? '100% ஆய்வகப் பரிசோதனை & FSSAI தரம்' : '100% Lab Tested & FSSAI Pure'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="quickview-overlay" onClick={handleCloseQuickView}>
          <div className="quickview-modal animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <button className="quickview-close-btn" onClick={handleCloseQuickView} aria-label="Close modal">
              <X size={20} />
            </button>

            <div className="quickview-grid">
              
              {/* Product Gallery */}
              <div className="quickview-gallery">
                <div 
                  className={`quickview-main-img-wrap ${zoomState.isZoomed ? 'is-zoomed' : ''}`}
                  onMouseMove={handleZoomMouseMove}
                  onMouseLeave={handleZoomMouseLeave}
                >
                  <img
                    src={qvImages[activeImgIndex] || quickViewProduct.imageUrl}
                    alt={getProductName(quickViewProduct)}
                    className="quickview-main-img"
                    style={{
                      transformOrigin: `${zoomState.x}% ${zoomState.y}%`,
                      transform: zoomState.isZoomed ? 'scale(2.35)' : 'scale(1)',
                      transition: zoomState.isZoomed ? 'transform 0.08s ease-out' : 'transform 0.3s ease',
                    }}
                  />
                  {quickViewProduct.badge && (
                    <span className="quickview-badge-tag">{isTamil ? (quickViewProduct.tamilBadge || '100% இயற்கை') : quickViewProduct.badge}</span>
                  )}
                  <div className={`qv-zoom-badge ${zoomState.isZoomed ? 'hide' : ''}`}>
                    <Search size={11} />
                    <span>{t('pdpHoverZoom', 'Hover to Zoom')}</span>
                  </div>
                </div>

                {qvImages.length > 1 && (
                  <div className="quickview-thumbnails">
                    {qvImages.map((img, idx) => (
                      <button
                        key={idx}
                        className={`qv-thumb-btn ${idx === activeImgIndex ? 'active' : ''}`}
                        onClick={() => setActiveImgIndex(idx)}
                      >
                        <img src={img} alt={`View ${idx + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="quickview-details">
                <div className="qv-category-line">
                  <span className="qv-category">{getCategory(quickViewProduct.category)}</span>
                  <div className="qv-rating">
                    <Star size={13} fill="#c9a84c" color="#c9a84c" />
                    <span>{quickViewProduct.rating || 4.9} ({quickViewProduct.reviewsCount || 250}+ {isTamil ? 'மதிப்பீடுகள்' : 'reviews'})</span>
                  </div>
                </div>

                <h2 className="qv-product-name">{getProductName(quickViewProduct)}</h2>

                <div className="qv-price-row">
                  <span className="qv-price">₹{qvPrice.toLocaleString()}</span>
                  {qvOriginalPrice > qvPrice && (
                    <span className="qv-mrp-group">
                      M.R.P.: <span className="qv-strike-price">₹{qvOriginalPrice.toLocaleString()}</span>
                    </span>
                  )}
                  {qvDiscount > 0 && (
                    <span className="qv-discount-pill">{qvDiscount}% OFF</span>
                  )}
                </div>
                {qvSavings > 0 && (
                  <div className="qv-savings-badge">
                    <span>Save ₹{qvSavings.toLocaleString()} on this item</span>
                  </div>
                )}
                <span className="qv-tax-note">{t('pdpTaxNotice', 'Inclusive of all taxes • Free shipping > ₹499')}</span>

                <p className="qv-description">{getProductDesc(quickViewProduct)}</p>

                {/* Variants */}
                {quickViewProduct.variants?.length > 0 && (
                  <div className="qv-variants-section">
                    <label className="qv-label">{t('pdpSelectSize', 'Select Pack Size:')}</label>
                    <div className="qv-variant-pills">
                      {quickViewProduct.variants.map((v) => (
                        <button
                          key={v.label}
                          className={`qv-variant-pill ${selectedVariant?.label === v.label ? 'active' : ''}`}
                          onClick={() => setSelectedVariant(v)}
                        >
                          <span className="qv-var-label">{v.label}</span>
                          <span className="qv-var-price">₹{v.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & Add to Cart */}
                <div className="qv-action-row">
                  <div className="qv-qty-picker">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="qv-action-buttons-grid">
                    <button
                      className="qv-add-cart-btn"
                      onClick={() => {
                        for (let i = 0; i < quantity; i++) {
                          addToCart(quickViewProduct, selectedVariant);
                        }
                        handleCloseQuickView();
                      }}
                      type="button"
                    >
                      <ShoppingCart size={16} />
                      <span>{t('addToCart', 'Add to Cart')}</span>
                    </button>

                    <button
                      className="qv-buy-now-btn"
                      onClick={() => {
                        const url = getWhatsAppProductOrderUrl(quickViewProduct, selectedVariant, quantity);
                        handleCloseQuickView();
                        window.open(url, '_blank', 'noopener,noreferrer');
                      }}
                      type="button"
                    >
                      <span>{t('buyNow', 'Buy Now')} • ₹{qvPrice * quantity}</span>
                    </button>
                  </div>
                </div>

                {/* Micro guarantees */}
                <div className="qv-guarantees-row">
                  <div className="qv-guarantee-item">
                    <Leaf size={14} color="#15803d" />
                    <span>{t('pdpPurePillar1', '100% Pure & Unadulterated')}</span>
                  </div>
                  <div className="qv-guarantee-item">
                    <Droplets size={14} color="#b45309" />
                    <span>{t('pdpPromise2', 'Traditional Chekku Cold Extraction')}</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function pMatchesCategory(cat1, cat2) {
  if (!cat1 || !cat2) return false;
  const c1 = cat1.toLowerCase().trim();
  const c2 = cat2.toLowerCase().trim();
  if (c1 === c2 || c1 === 'all' || c2 === 'all') return true;
  if ((c1.includes('spice') || c1.includes('powder')) && (c2.includes('spice') || c2.includes('powder'))) return true;
  if (c1.includes('oil') && c2.includes('oil')) return true;
  if (c1.includes('masala') && c2.includes('masala')) return true;
  if ((c1.includes('grain') || c1.includes('rice') || c1.includes('millet')) && (c2.includes('grain') || c2.includes('rice') || c2.includes('millet'))) return true;
  if ((c1.includes('sweet') || c1.includes('sugar') || c1.includes('jaggery') || c1.includes('honey')) && (c2.includes('sweet') || c2.includes('sugar') || c2.includes('jaggery') || c2.includes('honey'))) return true;
  if (c1.includes('herb') && c2.includes('herb')) return true;
  return false;
}

export default function ProductsPage(props) {
  return (
    <Suspense fallback={<div className="products-page-root"><div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>Loading catalog...</div></div>}>
      <ProductsPageContent {...props} />
    </Suspense>
  );
}
