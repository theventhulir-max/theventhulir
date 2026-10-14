'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { 
  MapPin, 
  CreditCard, 
  ShoppingBag, 
  CheckCircle2, 
  ArrowRight, 
  Tag, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  User, 
  Phone, 
  Mail, 
  Banknote,
  QrCode,
  PackageCheck,
  Plus,
  Minus,
  Trash2,
  Lock,
  MessageCircle,
  ExternalLink,
  AlertCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { PRESET_COUPONS } from '@/data/constants';
import './CheckoutPage.css';

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

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buyNowParam = searchParams.get('buyNow');
  const { cartItems, updateQty, removeFromCart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  // Selection state for items included in this checkout order
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [hasInitSelection, setHasInitSelection] = useState(false);

  useEffect(() => {
    if (cartItems.length > 0 && !hasInitSelection) {
      if (buyNowParam && cartItems.some(i => i.key === buyNowParam)) {
        setSelectedKeys(new Set([buyNowParam]));
      } else {
        setSelectedKeys(new Set(cartItems.map(i => i.key)));
      }
      setHasInitSelection(true);
    }
  }, [cartItems, buyNowParam, hasInitSelection]);

  const toggleSelectItem = (key) => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedKeys(new Set(cartItems.map(i => i.key)));
  };

  const deselectAll = () => {
    setSelectedKeys(new Set());
  };

  // Filter only items checked by user for this purchase
  const selectedCartItems = cartItems.filter(item => selectedKeys.has(item.key));
  const selectedTotal = selectedCartItems.reduce((s, i) => s + (i.price * i.quantity), 0);
  const selectedCount = selectedCartItems.reduce((s, i) => s + i.quantity, 0);

  // Delivery / Contact Details
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Tamil Nadu',
    zipCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('WhatsApp Order');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState({ type: '', text: '' });
  
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  // Live Catalog Inventory for Real-Time Stock Detection
  const [catalogProducts, setCatalogProducts] = useState([]);

  useEffect(() => {
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
  }, []);

  // Stock status determination for any cart item
  const getStockInfo = (item) => {
    const isErrorMentionedZero = Boolean(
      orderError && 
      orderError.toLowerCase().includes((item.name || '').toLowerCase()) && 
      (orderError.includes('0 unit') || orderError.toLowerCase().includes('remaining in warehouse') || orderError.toLowerCase().includes('out of stock'))
    );

    const matchedProd = catalogProducts.find(p => 
      (p._id && (p._id === item.productId || p._id === item.product || p._id === item._id || p._id === item.id)) ||
      (p.id && (p.id === item.productId || p.id === item.product || p.id === item._id || p.id === item.id)) ||
      (p.name && item.name && p.name.trim().toLowerCase() === item.name.trim().toLowerCase()) ||
      (p.slug && item.slug && p.slug === item.slug)
    );

    let currentStock = matchedProd?.currentStock !== undefined 
      ? matchedProd.currentStock 
      : (item.currentStock !== undefined ? item.currentStock : 50);

    if (isErrorMentionedZero) {
      currentStock = 0;
    }

    const isOutOfStock = currentStock <= 0 || matchedProd?.inStock === false || isErrorMentionedZero;
    const isLimitedStock = !isOutOfStock && currentStock > 0 && currentStock < item.quantity;

    return {
      isOutOfStock,
      isLimitedStock,
      currentStock,
      unitsLeft: Math.max(0, currentStock)
    };
  };

  // Identify out of stock items
  const outOfStockItems = cartItems.filter(item => getStockInfo(item).isOutOfStock);
  const hasOutOfStockSelected = selectedCartItems.some(item => getStockInfo(item).isOutOfStock);

  const handleUncheckOutOfStock = () => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      outOfStockItems.forEach(item => next.delete(item.key));
      return next;
    });
    setOrderError('');
  };

  const handleRemoveOutOfStock = () => {
    outOfStockItems.forEach(item => {
      removeFromCart(item.key);
      setSelectedKeys(prev => {
        const next = new Set(prev);
        next.delete(item.key);
        return next;
      });
    });
    setOrderError('');
  };

  // Auto-fill form when user is logged in
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.deliveryAddress?.address || '',
        city: user.deliveryAddress?.city || '',
        state: user.deliveryAddress?.state || 'Tamil Nadu',
        zipCode: user.deliveryAddress?.zipCode || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setOrderError('');
  };

  // Coupon application
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (PRESET_COUPONS[code]) {
      setAppliedCoupon({ code, ...PRESET_COUPONS[code] });
      setCouponMsg({ type: 'success', text: `✓ Applied: ${PRESET_COUPONS[code].label}` });
      return;
    }

    // Try server coupon verification
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
        setCouponMsg({ type: 'success', text: `✓ Coupon ${code} applied successfully!` });
      } else {
        const errData = await res.json().catch(() => ({}));
        setAppliedCoupon(null);
        setCouponMsg({ type: 'error', text: errData.error || 'Invalid or expired coupon code.' });
      }
    } catch {
      setAppliedCoupon(null);
      setCouponMsg({ type: 'error', text: 'Invalid coupon code.' });
    }
  };

  // Financial Calculations based ONLY on selected items
  const discountAmount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? Math.round((selectedTotal * appliedCoupon.value) / 100)
      : Math.min(appliedCoupon.value, selectedTotal)
    : 0;

  const afterDiscountTotal = Math.max(selectedTotal - discountAmount, 0);
  const shippingCharge = (afterDiscountTotal >= SHIPPING_FREE_THRESHOLD || afterDiscountTotal === 0 || selectedCartItems.length === 0) ? 0 : SHIPPING_FEE;
  const finalPayable = afterDiscountTotal + shippingCharge;

  // Order Submission
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setOrderError('');

    if (!isAuthenticated) {
      setOrderError('Please sign in or register to place your order.');
      router.push('/login?redirect=/checkout');
      return;
    }

    if (cartItems.length === 0) {
      setOrderError('Your cart is empty. Please add products before placing an order.');
      return;
    }

    if (selectedCartItems.length === 0) {
      setOrderError('Please select at least 1 product above to proceed with order.');
      return;
    }

    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.zipCode) {
      setOrderError('Please complete all mandatory delivery fields.');
      return;
    }

    if (hasOutOfStockSelected) {
      const oosItem = outOfStockItems.find(i => selectedKeys.has(i.key));
      const oosName = oosItem?.name || 'Selected product';
      setOrderError(`"${oosName}" has only 0 unit(s) remaining in warehouse. Please uncheck or remove it to place your order.`);
      return;
    }

    setSubmitting(true);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('venthulir_token') : null;
      let razorpayOrderId = null;
      let razorpayPaymentId = null;

      // Online payment handling
      if (paymentMethod === 'UPI / QR Pay' || paymentMethod === 'Online') {
        try {
          const payRes = await fetch('/api/payment/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: finalPayable })
          });
          if (payRes.ok) {
            const payData = await payRes.json();
            razorpayOrderId = payData.orderId || payData.id;
          }
        } catch (e) {
          console.warn('Razorpay order creation fallback:', e);
        }
      }

      const cleanPhone = formData.phone.trim().replace(/\D/g, '');
      const finalEmail = formData.email.trim() || user?.email || (cleanPhone ? `${cleanPhone}@guest.venthulir.com` : 'guest@venthulir.com');

      const orderPayload = {
        customerName: formData.name.trim(),
        customerEmail: finalEmail,
        phone: formData.phone.trim(),
        deliveryAddress: {
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: formData.zipCode.trim()
        },
        items: selectedCartItems.map(item => ({
          product: item.productId || item.product,
          name: item.name,
          variant: item.variant?.label || null,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.image
        })),
        originalAmount: selectedTotal,
        discountAmount,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        shippingCharge,
        totalAmount: finalPayable,
        paymentMethod,
        razorpayOrderId,
        razorpayPaymentId
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (res.ok) {
        const confirmedOrder = data.order || { _id: 'VEN-' + Date.now(), totalAmount: finalPayable };
        setPlacedOrder(confirmedOrder);
        // Remove only the purchased items from cart, keep remaining items safe
        if (selectedCartItems.length === cartItems.length) {
          clearCart();
        } else {
          selectedCartItems.forEach(item => removeFromCart(item.key));
        }

        // Open WhatsApp directly with order message
        try {
          const orderRef = (confirmedOrder._id || confirmedOrder.id || '').toString().slice(-8).toUpperCase();
          const itemsList = selectedCartItems.map(i => `▫️ *${i.name}*${i.variant?.label ? ` (${i.variant.label})` : ''} × ${i.quantity} = ₹${i.price * i.quantity}`).join('\n');
          const waMsg = `🌿 *VENTHULIR ORGANIC ORDER* 🌿\n_Order Reference: #${orderRef}_\n━━━━━━━━━━━━━━━━━━━━━\n\nHello Venthulir, I placed an order via website:\n\n👤 *Name:* ${formData.name.trim()}\n📱 *Phone:* ${formData.phone.trim()}\n📍 *Address:* ${formData.address.trim()}, ${formData.city.trim()}, ${formData.state.trim()} - ${formData.zipCode.trim()}\n\n🛒 *Items:*\n${itemsList}\n\n💰 *Total Payable:* ₹${finalPayable}\n\nPlease confirm my order and dispatch details! 🙏`;
          const waUrl = `https://api.whatsapp.com/send?phone=919486145001&text=${encodeURIComponent(waMsg)}`;
          if (typeof window !== 'undefined') {
            window.open(waUrl, '_blank');
          }
        } catch (e) {
          console.warn('WhatsApp redirect error:', e);
        }
      } else {
        setOrderError(data.error || data.msg || 'Unable to place order. Please verify details.');
      }
    } catch (err) {
      console.error('Order placement error:', err);
      setOrderError('Network connection issue. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── SUCCESS SCREEN ──
  if (placedOrder) {
    const orderRef = (placedOrder._id || placedOrder.id || '').toString().slice(-8).toUpperCase();
    const customerDisplayName = formData.name || user?.name || 'Valued Patron';

    return (
      <div className="checkout-page-root">
        <div className="checkout-success-container" style={{ maxWidth: '640px', padding: '36px 24px' }}>
          <div className="success-badge-crest" style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#059669', width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={36} color="#059669" />
          </div>
          
          <div style={{ display: 'inline-block', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '30px', padding: '4px 14px', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '1px' }}>
              🌿 Farm Harvest Booked Successfully
            </span>
          </div>

          <h1 className="success-order-title" style={{ fontSize: '1.8rem', color: '#0f3d2a', margin: '0 0 8px' }}>
            Congratulations, {customerDisplayName}!
          </h1>
          <p className="success-order-msg" style={{ fontSize: '0.92rem', color: '#52665a', lineHeight: 1.5, margin: '0 0 24px' }}>
            Thank you for choosing pure organic living! Your order has been securely confirmed at our farm origin and is now queued for batch packing.
          </p>

          {/* Detailed Order Information Card */}
          <div className="success-order-meta-box" style={{ background: '#faf9f6', border: '1px solid #e8e2d5', borderRadius: '14px', padding: '20px', textAlign: 'left', marginBottom: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #eee7dc', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: '#788c81', letterSpacing: '0.5px' }}>Order Reference</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f3d2a', fontFamily: 'monospace' }}>#{orderRef}</div>
              </div>
              <span style={{ background: '#dcfce7', color: '#1B5E2F', border: '1px solid #bbf7d0', padding: '4px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: 750, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} /> Confirmed
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', fontSize: '0.86rem', marginBottom: '12px' }}>
              <div>
                <span style={{ color: '#788c81', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Total Payable</span>
                <strong style={{ color: '#b45309', fontSize: '1.1rem' }}>₹{placedOrder.totalAmount || finalPayable}</strong>
                <span style={{ fontSize: '11px', color: '#557262', marginLeft: '4px' }}>({paymentMethod})</span>
              </div>
              <div>
                <span style={{ color: '#788c81', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Estimated Dispatch</span>
                <strong style={{ color: '#0f3d2a' }}>24 to 48 Hours</strong>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #eee7dc', paddingTop: '12px', fontSize: '0.86rem' }}>
              <span style={{ color: '#788c81', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>Delivery Destination</span>
              <span style={{ color: '#0f3d2a', fontWeight: 600, lineHeight: 1.4 }}>
                {formData.address}, {formData.city}, {formData.state} - {formData.zipCode}
              </span>
            </div>

            {(formData.email || user?.email) && (
              <div style={{ marginTop: '12px', background: '#ffffff', border: '1px solid #e4ddd2', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#1B5E2F', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} />
                <span>Confirmation email with digital invoice and tracking link sent to <strong>{formData.email || user?.email}</strong></span>
              </div>
            )}
          </div>

          {/* Action Buttons: WhatsApp Chat, Live Tracking & Continue Shopping */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a 
              href={`https://api.whatsapp.com/send?phone=919486145001&text=${encodeURIComponent(`🌿 Order #${orderRef}: Hello Venthulir, I have booked my order for ₹${placedOrder.totalAmount || finalPayable}. Please confirm dispatch details! 🙏`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-confirm-place-order" 
              style={{ textDecoration: 'none', width: '100%', justifyContent: 'center', fontSize: '0.95rem', padding: '14px 20px', background: '#25D366', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)' }}
            >
              <MessageCircle size={20} />
              <span>Connect & Confirm on WhatsApp (+91 94861 45001)</span>
            </a>

            <Link 
              href="/profile" 
              className="btn-confirm-place-order" 
              style={{ textDecoration: 'none', width: '100%', justifyContent: 'center', fontSize: '0.95rem', padding: '14px 20px', background: 'linear-gradient(135deg, #166534, #14532d)' }}
            >
              <Truck size={18} />
              <span>Track Live Order Status in My Profile</span>
              <ArrowRight size={18} />
            </Link>

            <Link 
              href="/products" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '11px 20px',
                borderRadius: '50px',
                border: '1.5px solid #dce8e0',
                color: '#0f3d2a',
                fontWeight: 700,
                textDecoration: 'none',
                background: '#ffffff',
                fontSize: '0.86rem',
                marginTop: '4px'
              }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── EMPTY CART SCREEN ──
  if (cartItems.length === 0) {
    return (
      <div className="checkout-page-root">
        <div className="checkout-success-container" style={{ padding: '60px 24px' }}>
          <div className="success-badge-crest" style={{ background: '#f8fafc', borderColor: '#e2e8f0', color: '#64748b' }}>
            <ShoppingBag size={36} />
          </div>
          <h2 className="success-order-title" style={{ fontSize: '1.8rem' }}>Your Basket is Empty</h2>
          <p className="success-order-msg">
            You haven&apos;t selected any organic products yet. Explore our cold-pressed oils, single-origin spices, and traditional grains.
          </p>
          <Link href="/products" className="btn-confirm-place-order" style={{ display: 'inline-flex', maxWidth: '280px', margin: '0 auto', textDecoration: 'none' }}>
            <span>Explore All Products</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-root">
      <div className="checkout-page-container">
        
        {/* Top Header & Stepper */}
        <div className="checkout-top-header">
          <h1 className="checkout-top-title">Express Checkout</h1>
          <p className="checkout-top-subtext">
            100% Secure Checkout • Direct Farm Delivery
          </p>

          <div className="checkout-stepper-bar">
            <div className="step-item active">
              <span className="step-num">1</span>
              <span className="step-name">1. Delivery Location</span>
            </div>
            <div className="step-line" />
            <div className="step-item">
              <span className="step-num">2</span>
              <span className="step-name">2. Payment</span>
            </div>
            <div className="step-line" />
            <div className="step-item">
              <span className="step-num">3</span>
              <span className="step-name">3. Place Order</span>
            </div>
          </div>
        </div>

        {/* 2-Column Checkout Layout */}
        <form onSubmit={handlePlaceOrder} className="checkout-layout-grid">
          
          {/* ── LEFT COLUMN: DELIVERY & PAYMENT ── */}
          <div className="checkout-left-col">
            
            {/* Mandatory Sign In Alert */}
            {!isAuthenticated && (
              <div style={{
                background: '#fffbeb',
                border: '1.5px solid #fde68a',
                padding: '16px 20px',
                borderRadius: '12px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Lock size={20} color="#b45309" />
                  </div>
                  <div>
                    <strong style={{ color: '#92400e', fontSize: '0.94rem', display: 'block', fontWeight: 800 }}>
                      Sign-In Required to Place Order
                    </strong>
                    <span style={{ color: '#78350f', fontSize: '0.82rem', lineHeight: 1.4 }}>
                      Please sign in or register to confirm your booking, receive digital invoices, and track live delivery.
                    </span>
                  </div>
                </div>
                <Link 
                  href="/login?redirect=/checkout" 
                  style={{
                    background: 'linear-gradient(135deg, #b45309 0%, #92400e 100%)',
                    color: '#ffffff',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    fontWeight: 750,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(180,83,9,0.25)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span>Sign In / Register</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}

            {/* 1. Delivery Details */}
            <div className="checkout-card">
              <div className="checkout-card-header">
                <div className="checkout-card-icon-wrap">
                  <MapPin size={20} />
                </div>
                <h2 className="checkout-card-title">1. Shipping & Contact Details</h2>
              </div>

              <div className="checkout-form-group">
                <label htmlFor="chk-name">Recipient Full Name *</label>
                <input
                  id="chk-name"
                  name="name"
                  type="text"
                  placeholder="e.g. Ramesh Kannan"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="checkout-2col">
                <div className="checkout-form-group">
                  <label htmlFor="chk-phone">Mobile Phone Number *</label>
                  <input
                    id="chk-phone"
                    name="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="checkout-form-group">
                  <label htmlFor="chk-email">Email Address (Optional for order updates)</label>
                  <input
                    id="chk-email"
                    name="email"
                    type="email"
                    placeholder="ramesh@example.com (optional)"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="checkout-form-group">
                <label htmlFor="chk-address">Street Address / Door No / Landmark *</label>
                <input
                  id="chk-address"
                  name="address"
                  type="text"
                  placeholder="Door No, Street Name, Area"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="checkout-3col">
                <div className="checkout-form-group">
                  <label htmlFor="chk-city">City / District *</label>
                  <input
                    id="chk-city"
                    name="city"
                    type="text"
                    placeholder="e.g. Chennai"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="checkout-form-group">
                  <label htmlFor="chk-state">State *</label>
                  <input
                    id="chk-state"
                    name="state"
                    type="text"
                    placeholder="Tamil Nadu"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="checkout-form-group">
                  <label htmlFor="chk-zip">Pincode *</label>
                  <input
                    id="chk-zip"
                    name="zipCode"
                    type="text"
                    placeholder="600001"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    maxLength={6}
                    required
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="checkout-card">
              <div className="checkout-card-header">
                <div className="checkout-card-icon-wrap">
                  <CreditCard size={20} />
                </div>
                <h2 className="checkout-card-title">2. Select Payment Method</h2>
              </div>

              <div className="payment-methods-grid">
                {/* Order via WhatsApp */}
                <div 
                  className="payment-method-card selected"
                  style={{ borderColor: '#1B5E2F', background: '#f0fdf4' }}
                >
                  <div className="payment-method-title">
                    <MessageCircle size={18} color="#1B5E2F" />
                    <span style={{ color: '#1B5E2F', fontWeight: 700 }}>Order via WhatsApp (+91 94861 45001)</span>
                  </div>
                  <p className="payment-method-desc" style={{ color: '#2d5a3c' }}>
                    Instant order booking directly through our official farm WhatsApp. No advance payment required; our team will confirm dispatch and assist you personally.
                  </p>
                </div>
              </div>

              {/* Mobile Bottom Submit Button */}
              <div className="checkout-mobile-submit-wrapper">
                {orderError && (
                  <div style={{
                    fontSize: '0.84rem',
                    fontWeight: 650,
                    color: '#b91c1c',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    marginBottom: '14px',
                    textAlign: 'center'
                  }}>
                    {orderError}
                  </div>
                )}
                <button
                  type="submit"
                  className="btn-confirm-place-order"
                  disabled={submitting || selectedCartItems.length === 0}
                  style={selectedCartItems.length === 0 ? { opacity: 0.6, cursor: 'not-allowed', background: '#94a3b8' } : {}}
                >
                  {submitting ? (
                    <span>Securing Your Order...</span>
                  ) : selectedCartItems.length === 0 ? (
                    <span>Select Products to Order</span>
                  ) : (
                    <>
                      <MessageCircle size={18} />
                      <span>Confirm Order via WhatsApp ({selectedCount} items) • ₹{finalPayable}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.76rem', color: '#557262', marginTop: '12px' }}>
                  <ShieldCheck size={14} color="#1B5E2F" />
                  <span>Zero Risk • Authenticity Guaranteed</span>
                </div>
              </div>

            </div>

          </div>

          {/* ── RIGHT COLUMN: SUMMARY & CONFIRMATION ── */}
          <div className="checkout-right-col">
            <div className="checkout-card order-summary-card" data-lenis-prevent>
              <div className="checkout-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="checkout-card-icon-wrap">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h2 className="checkout-card-title" style={{ margin: 0 }}>
                      3. Order Items ({selectedCount} of {cartItems.reduce((s, i) => s + i.quantity, 0)})
                    </h2>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      {selectedCartItems.length === cartItems.length 
                        ? 'All cart items selected' 
                        : `${selectedCartItems.length} of ${cartItems.length} items in this order`}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {cartItems.length > 1 && (
                    <button
                      type="button"
                      onClick={selectedCartItems.length === cartItems.length ? deselectAll : selectAll}
                      className="btn-select-toggle"
                    >
                      {selectedCartItems.length === cartItems.length ? 'Deselect All' : 'Select All'}
                    </button>
                  )}
                  <Link 
                    href="/products" 
                    className="btn-add-more-pill"
                  >
                    <Plus size={13} />
                    <span>Add Products</span>
                  </Link>
                </div>
              </div>

              {/* Direct Buy Now Mode Banner (if buyNow query param was active) */}
              {buyNowParam && cartItems.length > 1 && selectedCartItems.length < cartItems.length && (
                <div className="buy-now-mode-banner">
                  <div className="buy-now-banner-text">
                    <Sparkles size={14} color="#b45309" />
                    <span><strong>Direct Buy:</strong> Selected item only. Other cart items remain saved.</span>
                  </div>
                  <button type="button" onClick={selectAll} className="buy-now-include-all-btn">
                    Include All ({cartItems.length})
                  </button>
                </div>
              )}

              {/* Items Mini List with interactive controls */}
              <div className="summary-items-list">
                {cartItems.map((item) => {
                  const isSelected = selectedKeys.has(item.key);
                  const { isOutOfStock, isLimitedStock, unitsLeft } = getStockInfo(item);

                  return (
                    <div 
                      key={item.key} 
                      className={`summary-single-item ${
                        isSelected && !isOutOfStock
                          ? 'is-selected' 
                          : 'is-unselected'
                      }`}
                    >
                      {/* Checkbox */}
                      <label 
                        className={`summary-item-check-label ${isOutOfStock ? 'is-disabled' : ''}`} 
                        title={isOutOfStock ? 'Out of Stock' : (isSelected ? 'Uncheck to exclude from this order' : 'Check to include in this order')}
                      >
                        <input 
                          type="checkbox"
                          checked={isSelected && !isOutOfStock}
                          onChange={() => {
                            if (!isOutOfStock) {
                              toggleSelectItem(item.key);
                            }
                          }}
                          disabled={isOutOfStock}
                          className="summary-item-checkbox"
                        />
                      </label>

                      {/* Thumbnail */}
                      <div className="summary-item-thumb">
                        <img 
                          src={item.image || getFallbackImage(item.name, item.category)} 
                          alt={item.name} 
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = getFallbackImage(item.name, item.category);
                          }}
                        />
                      </div>

                      {/* Details & In-Checkout Actions */}
                      <div className="summary-item-details">
                        <div className="summary-item-header-row">
                          <h5 title={item.name}>
                            {item.name}
                          </h5>
                          <span className="summary-item-total">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                        
                        <div className="summary-item-meta" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                          <span className="summary-item-price-tag">₹{item.price} each</span>
                          {item.variant && <span className="summary-item-variant">• {item.variant.label}</span>}
                          
                          {/* Clean In-Place Real-World Stock Notification */}
                          {isOutOfStock ? (
                            <span style={{ color: '#dc2626', fontSize: '0.74rem', fontWeight: 800, background: '#fee2e2', padding: '1px 7px', borderRadius: '4px' }}>
                              ✕ Out of Stock
                            </span>
                          ) : isLimitedStock ? (
                            <span style={{ color: '#b45309', fontSize: '0.74rem', fontWeight: 750, background: '#fef3c7', padding: '1px 7px', borderRadius: '4px' }}>
                              ⚠️ Only {unitsLeft} left
                            </span>
                          ) : (
                            <span style={{ color: '#16a34a', fontSize: '0.74rem', fontWeight: 750, background: '#ecfdf5', padding: '1px 7px', borderRadius: '4px' }}>
                              ✓ In Stock
                            </span>
                          )}
                        </div>

                        {/* In-Checkout Quantity Stepper & Remove Button */}
                        <div className="summary-item-actions-row">
                          <div className={`summary-qty-stepper ${isOutOfStock ? 'stepper-disabled' : ''}`}>
                            <button 
                              type="button" 
                              onClick={() => updateQty(item.key, item.quantity - 1)}
                              title="Decrease quantity"
                              aria-label="Decrease quantity"
                              disabled={isOutOfStock}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="summary-qty-val">{item.quantity}</span>
                            <button 
                              type="button" 
                              onClick={() => updateQty(item.key, item.quantity + 1)}
                              title="Increase quantity"
                              aria-label="Increase quantity"
                              disabled={isOutOfStock || (isLimitedStock && item.quantity >= unitsLeft)}
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <button 
                            type="button" 
                            className="summary-item-remove-btn" 
                            onClick={() => {
                              removeFromCart(item.key);
                              setSelectedKeys(prev => {
                                const next = new Set(prev);
                                next.delete(item.key);
                                return next;
                              });
                            }}
                            title="Remove item completely"
                            aria-label="Remove item"
                          >
                            <Trash2 size={13} />
                            <span>Remove</span>
                          </button>

                          <span className={`summary-include-tag ${isSelected && !isOutOfStock ? 'included' : 'excluded'}`} style={{ marginLeft: 'auto' }}>
                            {isOutOfStock ? 'Not in Order' : isSelected ? '✓ In Order' : '○ Excluded'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div style={{ paddingTop: '6px' }}>
                  <Link 
                    href="/products" 
                    className="btn-add-more-dashed"
                  >
                    <Plus size={15} />
                    <span>+ Add More Products to Your Order</span>
                  </Link>
                </div>
              </div>

              {/* Warning if no items selected */}
              {selectedCartItems.length === 0 && (
                <div style={{
                  fontSize: '0.82rem',
                  fontWeight: 650,
                  color: '#b45309',
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  marginBottom: '14px',
                  textAlign: 'center'
                }}>
                  ⚠️ No products selected. Please check at least 1 item to proceed.
                </div>
              )}

              {/* Coupon Box */}
              <div className="checkout-coupon-wrap">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. VENTHULIR)"
                  className="checkout-coupon-input"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button 
                  type="button" 
                  className="btn-checkout-coupon"
                  onClick={handleApplyCoupon}
                >
                  Apply
                </button>
              </div>

              {couponMsg.text && (
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: 650,
                  color: couponMsg.type === 'success' ? '#1B5E2F' : '#b91c1c',
                  marginBottom: '12px'
                }}>
                  {couponMsg.text}
                </div>
              )}

              {/* Pricing Breakdown */}
              <div className="checkout-pricing-list">
                <div className="pricing-row">
                  <span>Subtotal ({selectedCount} items)</span>
                  <span>₹{selectedTotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="pricing-row discount-row">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="pricing-row">
                  <span>Delivery Charges</span>
                  <span>{shippingCharge === 0 ? <strong style={{ color: '#1B5E2F' }}>FREE</strong> : `₹${shippingCharge}`}</span>
                </div>

                <div className="pricing-row grand-row">
                  <span>Total Payable</span>
                  <span>₹{finalPayable}</span>
                </div>
              </div>

              {/* Error Box */}
              {orderError && (
                <div style={{
                  fontSize: '0.84rem',
                  fontWeight: 650,
                  color: '#b91c1c',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  marginBottom: '14px',
                  textAlign: 'center'
                }}>
                  {orderError}
                </div>
              )}

              {/* Confirm & Place Order CTA */}
              {!isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => router.push('/login?redirect=/checkout')}
                  className="btn-confirm-place-order"
                  style={{
                    background: '#1B5E2F',
                    color: '#ffffff',
                    border: '1px solid #1B5E2F',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(27, 94, 47, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Lock size={18} />
                  <span>Sign In to Order via WhatsApp • ₹{finalPayable}</span>
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-confirm-place-order"
                  disabled={submitting || selectedCartItems.length === 0}
                  style={selectedCartItems.length === 0 ? { opacity: 0.6, cursor: 'not-allowed', background: '#94a3b8' } : {}}
                >
                  {submitting ? (
                    <span>Securing Your Order...</span>
                  ) : selectedCartItems.length === 0 ? (
                    <span>Select Products to Order</span>
                  ) : (
                    <>
                      <MessageCircle size={18} />
                      <span>Confirm Order via WhatsApp ({selectedCount} items) • ₹{finalPayable}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.76rem', color: '#557262', marginTop: '14px' }}>
                <ShieldCheck size={14} color="#1B5E2F" />
                <span>Zero Risk • Authenticity Guaranteed</span>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="checkout-page-root">
        <div className="checkout-page-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: '#0f3d2a', fontWeight: 650 }}>Loading Venthulir Checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
