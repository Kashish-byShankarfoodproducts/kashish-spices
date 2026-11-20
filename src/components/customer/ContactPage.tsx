/**
 * ==============================================================================
 * KASHISH MASALE - ContactPage Component
 * ==============================================================================
 * Customer & Wholesale Trade Inquiries:
 * - Left Side (Vertically Stacked): 4 Contact Detail Cards (Address, Email, Call, WhatsApp)
 * - Right Side: Trade & Customer Inquiry Form with Web3Forms & hCaptcha Protection
 * - Responsive: Desktop pe side-by-side, mobile pe stacked
 * ==============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';

// TypeScript declaration for window.hcaptcha
declare global {
  interface Window {
    hcaptcha?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string;
          theme?: 'light' | 'dark';
          size?: 'normal' | 'compact';
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        }
      ) => string | number;
      reset: (widgetId?: string | number) => void;
      getResponse: (widgetId?: string | number) => string;
    };
  }
}

interface ContactPageProps {
  onHomeClick: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onHomeClick }) => {
  const { siteConfig } = useProducts();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Distributorship / Bulk Order',
    message: '',
  });

  const [responseMsg, setResponseMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  // hCaptcha state & refs
  const captchaContainerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | number | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const isCaptchaEnabled = siteConfig.hcaptchaEnabled !== false;
  const siteKey = siteConfig.hcaptchaSiteKey?.trim() || '50b2fe65-b00b-4b9e-ad62-3ba471098be2';

  // Initialize hCaptcha widget when component mounts
  useEffect(() => {
    if (!isCaptchaEnabled) return;
    let isMounted = true;

    const renderCaptcha = () => {
      if (!isMounted || !captchaContainerRef.current) return;
      if (window.hcaptcha && widgetIdRef.current === null) {
        try {
          captchaContainerRef.current.innerHTML = '';
          const id = window.hcaptcha.render(captchaContainerRef.current, {
            sitekey: siteKey,
            theme: 'light',
            callback: (token: string) => {
              if (isMounted) setCaptchaToken(token);
            },
            'expired-callback': () => {
              if (isMounted) setCaptchaToken(null);
            },
            'error-callback': () => {
              if (isMounted) setCaptchaToken(null);
            },
          });
          widgetIdRef.current = id;
        } catch (err) {
          console.warn('hCaptcha initialization note:', err);
        }
      }
    };

    if (window.hcaptcha) {
      renderCaptcha();
    } else {
      const interval = setInterval(() => {
        if (window.hcaptcha) {
          clearInterval(interval);
          renderCaptcha();
        }
      }, 250);
      return () => {
        clearInterval(interval);
        isMounted = false;
      };
    }

    return () => {
      isMounted = false;
    };
  }, [isCaptchaEnabled, siteKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponseMsg(null);

    const accessKey = siteConfig.web3formsAccessKey?.trim();
    const activeToken =
      captchaToken ||
      (window.hcaptcha && widgetIdRef.current !== null ? window.hcaptcha.getResponse(widgetIdRef.current) : '');

    // Agar hCaptcha enabled hai aur accessKey set hai, to captcha complete hona zaruri hai
    if (isCaptchaEnabled && accessKey && !activeToken) {
      setResponseMsg({
        text: 'Kripya submit karne se pehle hCaptcha ("I am human") verify karein.',
        type: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      if (accessKey) {
        const payload: Record<string, any> = {
          access_key: accessKey,
          from_name: `${siteConfig.shortBrand || 'Kashish Masale'} Website`,
          name: formData.name,
          phone: formData.phone,
          email: formData.email || 'Not provided',
          subject: `[${siteConfig.shortBrand || 'Kashish Masale'}] ${formData.subject}: ${formData.name}`,
          message: formData.message,
        };

        if (activeToken) {
          payload['h-captcha-response'] = activeToken;
        }

        // Send directly to Web3Forms API
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (result.success) {
          setResponseMsg({
            text: 'Aapka message safalta-purvak bhej diya gaya hai! Inquiry email par deliver ho chuki hai.',
            type: 'success',
          });
          setFormData({
            name: '',
            phone: '',
            email: '',
            subject: 'Distributorship / Bulk Order',
            message: '',
          });
          setCaptchaToken(null);
          if (window.hcaptcha && widgetIdRef.current !== null) {
            try {
              window.hcaptcha.reset(widgetIdRef.current);
            } catch (e) {
              /* ignore */
            }
          }
        } else {
          setResponseMsg({
            text: result.message || 'Error sending inquiry. Please check your Web3Forms access key or captcha.',
            type: 'error',
          });
          if (window.hcaptcha && widgetIdRef.current !== null) {
            try {
              window.hcaptcha.reset(widgetIdRef.current);
            } catch (e) {
              /* ignore */
            }
          }
        }
      } else {
        // Fallback simulation when access key is not yet set
        setResponseMsg({
          text: 'Inquiry submit ho gayi hai! (Tip: Admin Panel -> Live Website Customizer me apni Web3Forms key daal kar isse sidha apne email par receive karein).',
          type: 'success',
        });
        setFormData({
          name: '',
          phone: '',
          email: '',
          subject: 'Distributorship / Bulk Order',
          message: '',
        });
        setCaptchaToken(null);
        if (window.hcaptcha && widgetIdRef.current !== null) {
          try {
            window.hcaptcha.reset(widgetIdRef.current);
          } catch (e) {
            /* ignore */
          }
        }
      }
    } catch (err) {
      setResponseMsg({
        text: 'Network error. Kripya apna internet check karein ya direct WhatsApp par sampark karein.',
        type: 'error',
      });
    } finally {
      setLoading(false);
      setTimeout(() => setResponseMsg(null), 7000);
    }
  };

  return (
    <div>
      {/* 1. Page Hero Banner with Spice Flatlay Blend */}
      <section
        style={{
          position: 'relative',
          background:
            'linear-gradient(90deg, rgba(45, 6, 6, 0.93) 0%, rgba(85, 12, 14, 0.84) 45%, rgba(40, 5, 5, 0.88) 100%), url("/images/spice-bg.jpg") right center / cover no-repeat',
          color: 'white',
          padding: '60px 0 40px 0',
          textAlign: 'center',
          borderBottom: '2px solid var(--gold)',
          overflow: 'hidden',
        }}
      >
        <div className="container">
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.5rem',
              color: '#FFFFFF',
              marginBottom: '8px',
            }}
          >
            Get in Touch
          </h1>
          <p style={{ color: 'var(--cream)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto 16px auto' }}>
            We'd love to hear from you. For wholesale distribution, retail queries, or bulk inquiries.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <span
              onClick={onHomeClick}
              style={{ color: 'var(--gold-light)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Home
            </span>
            <i className="fa-solid fa-angle-right" style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}></i>
            <span style={{ color: 'white' }}>Contact Us</span>
          </div>
        </div>
      </section>

      {/* 2. Main Contact Section: Left Side Details + Right Side Form */}
      <section className="section bg-cream">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '36px',
              alignItems: 'start',
            }}
          >
            {/* =========================================================
                LEFT SIDE: 4 Detail Cards Stacked Vertically
                ========================================================= */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Card 1: Address */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1.5px solid rgba(212, 160, 23, 0.35)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  gap: '16px',
                  transition: 'transform 0.2s, border-color 0.2s',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(212, 160, 23, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold)',
                    fontSize: '1.3rem',
                    flexShrink: 0,
                  }}
                >
                  <i className="fa-solid fa-building"></i>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px', color: 'var(--gray-700)' }}>
                    Address
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--gray-500)', lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--maroon)' }}>{siteConfig.companyName}</strong>
                    <br />
                    {siteConfig.address}
                  </p>
                </div>
              </div>

              {/* Card 2: Email Us */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1.5px solid rgba(212, 160, 23, 0.35)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(212, 160, 23, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold)',
                    fontSize: '1.3rem',
                    flexShrink: 0,
                  }}
                >
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px', color: 'var(--gray-700)' }}>
                    Email Us
                  </h4>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--maroon)',
                      fontWeight: 600,
                      wordBreak: 'break-all',
                      display: 'block',
                    }}
                  >
                    {siteConfig.email}
                  </a>
                  <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginTop: '4px' }}>
                    Response within 24 business hours
                  </p>
                </div>
              </div>

              {/* Card 3: Call Us */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1.5px solid rgba(212, 160, 23, 0.35)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(212, 160, 23, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold)',
                    fontSize: '1.3rem',
                    flexShrink: 0,
                  }}
                >
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px', color: 'var(--gray-700)' }}>
                    Call Us
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.9rem' }}>
                    <a href={`tel:${siteConfig.primaryPhone}`} style={{ color: 'var(--maroon)', fontWeight: 700 }}>
                      {siteConfig.primaryPhone}
                    </a>
                    <a href={`tel:${siteConfig.secondaryPhone}`} style={{ color: 'var(--gray-600)', fontWeight: 600 }}>
                      {siteConfig.secondaryPhone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 4: WhatsApp */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1.5px solid rgba(212, 160, 23, 0.35)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(37, 211, 102, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#25D366',
                    fontSize: '1.5rem',
                    flexShrink: 0,
                  }}
                >
                  <i className="fa-brands fa-whatsapp"></i>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px', color: 'var(--gray-700)' }}>
                    WhatsApp
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '8px' }}>
                    Instant wholesale and dispatch chat
                  </p>
                  <a
                    href={`https://wa.me/${siteConfig.whatsappNumber}?text=Hello%20Shankar%20Food%20Products`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#25D366',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                    }}
                  >
                    <span>Chat on WhatsApp</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* =========================================================
                RIGHT SIDE: Fill-up Form (Trade & Customer Inquiry Form)
                ========================================================= */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.98)',
                borderRadius: '20px',
                border: '2px solid var(--gold)',
                padding: '36px 30px',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <span className="subtitle">Send a Message</span>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon)', fontSize: '1.75rem', marginTop: '4px' }}>
                  Trade & Customer Inquiry Form
                </h2>
              </div>

              {responseMsg && (
                <div
                  style={{
                    padding: '14px 18px',
                    borderRadius: '10px',
                    background: responseMsg.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: responseMsg.type === 'success' ? '#155724' : '#721c24',
                    border: `1.5px solid ${responseMsg.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                    marginBottom: '22px',
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <i
                    className={
                      responseMsg.type === 'success'
                        ? 'fa-solid fa-circle-check text-forest-green'
                        : 'fa-solid fa-circle-exclamation text-deep-red'
                    }
                  ></i>
                  <span>{responseMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      className="form-control"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. name@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Inquiry Subject</label>
                    <select
                      className="form-control"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="Distributorship / Bulk Order">Distributorship / Bulk Order</option>
                      <option value="Retail Inquiry">Retail Inquiry</option>
                      <option value="Product Quality & Feedback">Product Quality & Feedback</option>
                      <option value="Other Query">Other Query</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label">Your Message / Requirement *</label>
                  <textarea
                    required
                    rows={4}
                    className="form-control"
                    placeholder="Kripya apne order ya sawal ke baare me likhein..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                {/* hCaptcha Verification Widget */}
                {isCaptchaEnabled && (
                  <div
                    style={{
                      marginBottom: '22px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(247, 243, 233, 0.6)',
                      padding: '16px 12px 10px 12px',
                      borderRadius: '12px',
                      border: '1px dashed rgba(212, 160, 23, 0.45)',
                    }}
                  >
                    <div ref={captchaContainerRef} style={{ minHeight: '78px', display: 'flex', justifyContent: 'center' }}></div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <i className="fa-solid fa-shield-halved text-gold"></i>
                      <span>Protected by hCaptcha spam prevention</span>
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 700 }}
                >
                  {loading ? (
                    <span>Sending message...</span>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane"></i>
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
