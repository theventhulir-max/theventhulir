'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { X, Plus, Minus, ShoppingBag, Tag, Truck, Trash2, ArrowRight, ShieldCheck, Sparkles, AlertCircle, MessageCircle } from 'lucide-react';
import { PRESET_COUPONS } from '@/data/constants';
import { getWhatsAppCartOrderUrl } from '@/lib/whatsapp';
import './CartDrawer.css';

const SHIPPING_FREE_THRESHOLD = 499;
const SHIPPING_FEE = 60;

const getFallbackImage = (name = '', category = '') => {
  const lowerName = (name || '').toLowerCase();
  const lowerCat = (category || '').toLowerCase();

  if (lowerName.includes('turmeric') || lowerName.includes('manjal') || lowerName.includes('yellow') || lowerName.includes('turm')) return '/assets/hero/turmeric.png';
  if (lowerName.includes('chilli') || lowerName.includes('chili') || lowerName.includes('red') || lowerName.includes('milagai')) return '/assets/hero/chilli.png';
  if (lowerName.includes('coriander') || lowerName.includes('mallie') || lowerName.includes('dhaniya') || lowerName.includes('kothamalli')) return '/assets/hero/coriander.png';
  if (lowerName.includes('sambar') || lowerName.includes('masala') || lowerName.includes('garam') || lowerName.includes('rasam')) return '/assets/hero/sambar.png';
  if (lowerName.includes('coconut') || lowerName.includes('thengai')) return '/assets/hero/oil_coconut.png';
  if (lowerName.includes('groundnut') || lowerName.includes('kadalai')) return '/assets/hero/oil_groundnut.png';
  if (lowerName.includes('gingelly') || lowerName.includes('sesame') || lowerName.includes('nallennai') || lowerName.includes('til')) return '/assets/hero/oil_gingelly.png';
  if (lowerName.includes('oil') || lowerCat.includes('oil')) return '/assets/hero/oil_sunflower.png';
  return '/assets/hero/turmeric.png';
};

export default function CartDrawer({ onCheckout }) {
  const { cartItems, updateQty, removeFromCart, clearCart, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const { t, isTamil } = useLanguage();
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError]   = useState('');
  const [catalogProducts, setCatalogProducts] = useState([]);

  useEffect(() => {
    if (isCartOpen) {
      fetch('/api/products?nocache=true&limit=100')
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data?.products && Array.isArray(data.products)) {
            setCatalogProducts(data.products);
          } else if (Array.isArray(data)) {
            setCatalogProducts(data);
          }
        })
        .catch(() => {});
    }
  }, [isCartOpen]);

  const getStockInfo = (item) => {
    const matchedProd = catalogProducts.find(p => 
      (p._id && (p._id === item.productId || p._id === item.product || p._id === item._id || p._id === item.id)) ||
      (p.id && (p.id === item.productId || p.id === item.product || p.id === item._id || p.id === item.id)) ||
      (p.name && item.name && p.name.trim().toLowerCase() === item.name.trim().toLowerCase()) ||
      (p.slug && item.slug && p.slug === item.slug)
    );

    const currentStock = matchedProd?.currentStock !== undefined 
      ? matchedProd.currentStock 
      : (item.currentStock !== undefined ? item.currentStock : 50);

    const isOutOfStock = currentStock <= 0 || matchedProd?.inStock === false;
    return { isOutOfStock, currentStock };
  };

  // Lock background body scroll while CartDrawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const applyCouponCode = async (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) return;

    if (PRESET_COUPONS[code]) {
      setAppliedCoupon({ code, ...PRESET_COUPONS[code] });
      setCouponError('');
      setCouponInput(code);
      return;
    }

    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      if (res.ok) {
        const data = await res.json();
        const discountType = data.discountType || 'percent';
        const discountVal = data.discountValue || data.discountPercentage || 10;
        setAppliedCoupon({
          code,
          type: discountType,
          value: discountVal,
          label: `${discountVal}${discountType === 'percent' ? '%' : '₹'} OFF`
        });
        setCouponError('');
        setCouponInput(code);
      } else {
        const errData = await res.json().catch(() => ({}));
        setAppliedCoupon(null);
        setCouponError(errData.error || 'Invalid or expired coupon code');
      }
    } catch {
      setAppliedCoupon(null);
      setCouponError('Invalid coupon code');
    }
  };

  const discount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? Math.round(cartTotal * appliedCoupon.value / 100)
      : Math.min(appliedCoupon.value, cartTotal)
    : 0;

  const afterDiscount = Math.max(cartTotal - discount, 0);
  const shippingFee   = afterDiscount >= SHIPPING_FREE_THRESHOLD || cartItems.length === 0 ? 0 : SHIPPING_FEE;
  const grandTotal    = afterDiscount + shippingFee;
  const totalMrp = cartItems.reduce((acc, item) => {
    const orig = item.variant?.originalPrice || item.originalPrice || Math.round(item.price * 1.25);
    return acc + (orig * item.quantity);
  }, 0);
  const totalSavings = Math.max(0, (totalMrp - cartTotal) + discount);
  const totalItemCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
      <div className="cart-drawer animate-slide-right" data-lenis-prevent>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-top">
            <div className="cart-header-title">
              <div className="cart-title-icon-wrap">
                <ShoppingBag size={18} />
              </div>
              <span>Your Basket</span>
              {totalItemCount > 0 && (
                <span className="cart-count-pill">{totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}</span>
              )}
            </div>
            <button className="cart-close" onClick={() => setIsCartOpen(false)} aria-label="Close cart">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Items List */}
        <div 
          className="cart-items"
        >
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon-wrap">
                <ShoppingBag size={42} strokeWidth={1.5} />
              </div>
              <h4>{t('cartEmptyTitle', 'Your basket is empty')}</h4>
              <p>{t('cartEmptySub', 'Explore our organic stone-ground spices, wood cold-pressed oils, and traditional staples.')}</p>
              <button className="btn-empty-shop" onClick={() => setIsCartOpen(false)}>
                <span>{isTamil ? 'பொருட்களை வாங்குக' : 'Start Shopping'}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            cartItems.map(item => {
              const { isOutOfStock } = getStockInfo(item);
              const origPrice = item.variant?.originalPrice || item.originalPrice || Math.round(item.price * 1.25);
              return (
                <div key={item.key} className="cart-item">
                  <div className="cart-item-img">
                    <img 
                      src={item.image || getFallbackImage(item.name, item.category)} 
                      alt={item.name} 
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getFallbackImage(item.name, item.category);
                      }}
                    />
                  </div>

                  <div className="cart-item-info">
                    <div className="cart-item-title-row">
                      <h5 className="cart-item-name" title={item.name}>{item.name}</h5>
                      <button 
                        className="remove-btn" 
                        onClick={() => removeFromCart(item.key)}
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="cart-item-submeta">
                      {item.variant && (
                        <span className="cart-item-variant">{item.variant.label}</span>
                      )}
                      <div className="cart-item-unit-price-group">
                        <span className="cart-item-unit-price">₹{item.price}</span>
                        {origPrice > item.price && (
                          <span className="cart-item-strike-price">₹{origPrice}</span>
                        )}
                      </div>
                    </div>

                    {/* Clean stock status line */}
                    <div className="cart-item-stock-status">
                      {isOutOfStock ? (
                        <span className="cart-stock-tag oos">Out of Stock</span>
                      ) : (
                        <span className="cart-stock-tag in-stock">In Stock</span>
                      )}
                    </div>

                    <div className="cart-item-bottom-row">
                      <div className="cart-item-total-group">
                        <span className="cart-item-total-price">₹{item.price * item.quantity}</span>
                        {origPrice > item.price && (
                          <span className="cart-item-total-strike">₹{origPrice * item.quantity}</span>
                        )}
                      </div>
                      
                      {isOutOfStock ? (
                        <span className="cart-oos-action-hint">Currently unavailable</span>
                      ) : (
                        <div className="qty-control">
                          <button 
                            onClick={() => updateQty(item.key, item.quantity - 1)}
                            title="Decrease quantity"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span>{item.quantity}</span>
                          <button 
                            onClick={() => updateQty(item.key, item.quantity + 1)}
                            title="Increase quantity"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            {/* Totals */}
            <div className="cart-totals">
              <div className="total-row">
                <span>Subtotal ({totalItemCount} items)</span>
                <span>₹{cartTotal}</span>
              </div>
              {totalSavings > 0 && (
                <div className="total-row savings-highlight-row">
                  <span>🎉 Total Savings</span>
                  <span className="savings-amount">Save ₹{totalSavings}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="total-row discount">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>−₹{discount}</span>
                </div>
              )}
              <div className="total-row">
                <span>Delivery</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="free-ship-badge">FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>
              <div className="total-row grand">
                <div>
                  <span className="grand-label">Total Payable</span>
                  <span className="tax-included-note">Inclusive of all taxes</span>
                </div>
                <span className="grand-amount">₹{grandTotal}</span>
              </div>
            </div>

            {/* Primary CTA */}
            <button 
              className="checkout-cta" 
              onClick={() => {
                const url = getWhatsAppCartOrderUrl(cartItems, grandTotal);
                setIsCartOpen(false);
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
              style={{ background: '#1B5E2F', borderColor: '#1B5E2F' }}
            >
              <MessageCircle size={18} color="#ffffff" />
              <span>{isTamil ? `வாட்ஸ்அப்பில் வாங்கவும் • ₹${grandTotal}` : `Buy Now on WhatsApp • ₹${grandTotal}`}</span>
              <ArrowRight size={17} />
            </button>

            {/* Secondary Navigation */}
            <div className="cart-footer-sublinks">
              <a
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                className="btn-detailed-cart-link"
              >
                <span>View Detailed Cart &amp; Save for Later</span>
                <ArrowRight size={13} />
              </a>
            </div>

            {/* Micro Trust Indicators */}
            <div className="cart-trust-row">
              <div className="trust-item">
                <ShieldCheck size={13} />
                <span>100% Authentic</span>
              </div>
              <span>•</span>
              <div className="trust-item">
                <Truck size={13} />
                <span>Fast Dispatch</span>
              </div>
              <span>•</span>
              <div className="trust-item">
                <Sparkles size={13} />
                <span>Farm Direct</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
