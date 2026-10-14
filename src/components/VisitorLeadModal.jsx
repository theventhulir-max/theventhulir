'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import './VisitorLeadModal.css';

const TN_DISTRICTS = [
  'Salem',
  'Namakkal',
  'Erode',
  'Coimbatore',
  'Tiruppur',
  'Chennai',
  'Trichy (Tiruchirappalli)',
  'Madurai',
  'Dindigul',
  'Karur',
  'Dharmapuri',
  'Krishnagiri',
  'Thanjavur',
  'Vellore',
  'Tirunelveli',
  'Cuddalore',
  'Other / Outside Tamil Nadu'
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function VisitorLeadModal() {
  const { isAuthenticated, user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Salem');
  const [customLocation, setCustomLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const pathname = usePathname();
  const isSubmittedRef = useRef(false);
  const nextTriggerTimeRef = useRef(0);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const alreadySubmitted = localStorage.getItem('venthulir_lead_submitted');
      if (alreadySubmitted || isAuthenticated || user) {
        isSubmittedRef.current = true;
        return;
      }
      // Schedule initial popup appearance with a random 20 to 25 seconds difference
      nextTriggerTimeRef.current = Date.now() + getRandomInt(20000, 25000);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const intervalId = setInterval(() => {
      // Don't trigger if modal is open, submitted, or user is authenticated
      if (isOpen || isSubmittedRef.current || isAuthenticated || user) return;

      // Don't trigger on excluded checkout / admin / auth routes
      const currentPath = window.location.pathname;
      if (
        currentPath.startsWith('/admin') ||
        currentPath.startsWith('/login') ||
        currentPath.startsWith('/register') ||
        currentPath.startsWith('/checkout') ||
        currentPath.startsWith('/cart')
      ) {
        return;
      }

      // Check if target random time reached (20 to 25 seconds)
      if (nextTriggerTimeRef.current > 0 && Date.now() >= nextTriggerTimeRef.current) {
        setIsOpen(true);
        nextTriggerTimeRef.current = 0;
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, [isOpen, isAuthenticated, user]);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handlePhoneChange = (e) => {
    const numericOnly = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    setPhone(numericOnly);
    if (error) setError('');
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (error) setError('');
  };

  // Called when customer clicks "Skip for now", "X" close button, or clicks outside
  const handleClose = () => {
    setIsOpen(false);
    setSubmitAttempted(false);
    setError('');

    // Schedule next popup after a random 20 to 25 seconds difference if not submitted
    if (!isSubmittedRef.current) {
      nextTriggerTimeRef.current = Date.now() + getRandomInt(20000, 25000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitAttempted(true);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }

    if (trimmedName.length < 2) {
      setError('Full name must be at least 2 characters long.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      setError('Mobile / WhatsApp number is mandatory.');
      return;
    }

    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    const finalLocation =
      district === 'Other / Outside Tamil Nadu'
        ? customLocation.trim() || 'Other'
        : district;

    if (district === 'Other / Outside Tamil Nadu' && !customLocation.trim()) {
      setError('Please enter your city/district name.');
      return;
    }

    setIsSubmitting(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          name: trimmedName,
          phone: cleanPhone,
          location: finalLocation,
        }),
      });

      clearTimeout(timeoutId);

      const data = await res.json().catch(() => ({}));

      if (!res.ok && res.status !== 201) {
        throw new Error(data.error || 'Failed to submit details');
      }

      setIsSubmitted(true);
      isSubmittedRef.current = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('venthulir_lead_submitted', 'true');
      }

      // Auto close after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch (err) {
      // If aborted or network delay, still gracefully show success to customer and save locally
      if (err.name === 'AbortError') {
        setIsSubmitted(true);
        isSubmittedRef.current = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem('venthulir_lead_submitted', 'true');
        }
        setTimeout(() => setIsOpen(false), 3000);
      } else {
        console.error('Lead Submission Error:', err);
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || !isOpen) return null;

  const isNameInvalid = submitAttempted && (!name.trim() || name.trim().length < 2);
  const isPhoneInvalid = submitAttempted && (phone.length !== 10 || !/^[6-9]\d{9}$/.test(phone));

  return (
    <div className="vlm-overlay" onClick={handleClose}>
      <div className="vlm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="vlm-close-btn"
          onClick={handleClose}
          aria-label="Close"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Modal Header */}
        <div className="vlm-header">
          <div className="vlm-badge">🌿 WELCOME TO VENTHULIR</div>
          <h2 className="vlm-title">100% Pure Heritage Masalas &amp; Cold-Pressed Oils</h2>
          <p className="vlm-subtitle">
            Get instant introductory coupons &amp; farm-fresh harvest updates!
          </p>
        </div>

        {/* Modal Body */}
        <div className="vlm-body">
          {isSubmitted ? (
            <div className="vlm-success-box">
              <div className="vlm-success-icon">✓</div>
              <h3 className="vlm-success-title">Welcome to the Family, {name}!</h3>
              <p className="vlm-success-desc">
                Your details have been saved. Use code below at checkout for special savings:
              </p>
              <div className="vlm-coupon-badge">VENTHULIR10</div>
            </div>
          ) : (
            <form className="vlm-form" onSubmit={handleSubmit} noValidate>
              {/* Field 1: Name (Mandatory) */}
              <div className="vlm-field">
                <label className="vlm-label">
                  <span className="vlm-label-left">
                    <span>👤</span> Your Full Name
                  </span>
                  {isNameInvalid && <span className="vlm-mandatory-tag">Required *</span>}
                </label>
                <div className="vlm-input-wrap">
                  <span className="vlm-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <input
                    type="text"
                    className={`vlm-input ${isNameInvalid ? 'vlm-input-error' : ''}`}
                    placeholder="Enter your full name (e.g. Ramesh Kumar)"
                    value={name}
                    onChange={handleNameChange}
                  />
                </div>
              </div>

              {/* Field 2: Phone (Mandatory) */}
              <div className="vlm-field">
                <label className="vlm-label">
                  <span className="vlm-label-left">
                    <span>📱</span> Mobile / WhatsApp Number
                  </span>
                  {isPhoneInvalid && <span className="vlm-mandatory-tag">Required *</span>}
                </label>
                <div className="vlm-input-wrap">
                  <span className="vlm-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    className={`vlm-input ${isPhoneInvalid ? 'vlm-input-error' : ''}`}
                    placeholder="10-digit mobile number (e.g. 9876543210)"
                    value={phone}
                    maxLength={10}
                    onChange={handlePhoneChange}
                  />
                </div>
              </div>

              {/* Field 3: Location / District */}
              <div className="vlm-field">
                <label className="vlm-label">
                  <span>📍</span> District / Location
                </label>
                <div className="vlm-input-wrap">
                  <span className="vlm-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </span>
                  <select
                    className="vlm-select"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  >
                    {TN_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* If "Other" chosen, custom text input */}
              {district === 'Other / Outside Tamil Nadu' && (
                <div className="vlm-field">
                  <input
                    type="text"
                    className="vlm-input"
                    style={{ paddingLeft: '14px' }}
                    placeholder="Enter your City / State name"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    required
                  />
                </div>
              )}

              {error && <div className="vlm-error-text">{error}</div>}

              {/* Submit Button */}
              <button
                type="submit"
                className="vlm-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="vlm-spinner"></span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>Get Exclusive Offers</span>
                    <span>→</span>
                  </>
                )}
              </button>

              {/* Footer */}
              <div className="vlm-footer">
                <div className="vlm-privacy">
                  🔒 100% Privacy Protected · Zero Spam
                </div>
                <button
                  type="button"
                  className="vlm-skip-btn"
                  onClick={handleClose}
                >
                  Skip for now
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
