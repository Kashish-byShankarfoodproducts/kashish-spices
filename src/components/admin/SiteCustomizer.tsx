/**
 * ==============================================================================
 * KASHISH MASALE - SiteCustomizer Component
 * ==============================================================================
 * Admin Panel ka Full Website Customization Panel!
 * 
 * Features:
 * 1. Global Brand Logo Upload (Navbar, Footer, About Section, Admin Portal)
 * 2. Brand Identity (Full Name, Short Brand, Hindi Tagline, FSSAI Number, Since Year)
 * 3. Contact Info (Phones, WhatsApp, Email, Factory Address)
 * 4. About Story & Heritage paragraphs
 * 5. Animated Counter Stats
 * 
 * Saare badlav IndexedDB aur LocalStorage me save hote hain aur bina reload
 * kiye poori website par live dikhte hain!
 * ==============================================================================
 */

import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { SiteConfig } from '../../types';
import { storageService } from '../../services/storageService';

export const SiteCustomizer: React.FC = () => {
  const { siteConfig, updateSiteConfig } = useProducts();
  const [formData, setFormData] = useState<SiteConfig>({ ...siteConfig });
  const [savedNotice, setSavedNotice] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleChange = (field: keyof SiteConfig, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Helper to detect background color from corners of an image
  const detectImageBgColor = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = Math.min(img.width, 100);
            canvas.height = Math.min(img.height, 100);
            const ctx = canvas.getContext('2d');
            if (!ctx) return resolve('#FAF8ED');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            // Sample corners
            const c1 = ctx.getImageData(0, 0, 1, 1).data;
            const c2 = ctx.getImageData(canvas.width - 1, 0, 1, 1).data;
            const c3 = ctx.getImageData(0, canvas.height - 1, 1, 1).data;
            const c4 = ctx.getImageData(canvas.width - 1, canvas.height - 1, 1, 1).data;
            // Average corner colors
            const r = Math.round((c1[0] + c2[0] + c3[0] + c4[0]) / 4);
            const g = Math.round((c1[1] + c2[1] + c3[1] + c4[1]) / 4);
            const b = Math.round((c1[2] + c2[2] + c3[2] + c4[2]) / 4);
            const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
            resolve(hex);
          } catch (err) {
            resolve('#FAF8ED');
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Brand Logo File Upload Handler
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const [base64, detectedColor] = await Promise.all([
        storageService.compressAndReadImage(file, 600, 600, 0.95),
        detectImageBgColor(file),
      ]);
      setFormData((prev) => ({
        ...prev,
        logoUrl: base64,
        logoBgColor: detectedColor,
      }));
    } catch (err) {
      alert('Logo upload karne me error aaya. Kripya doosri file chunein.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    handleChange('logoUrl', '');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteConfig(formData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon)', fontSize: '1.5rem' }}>
          Live Website Customizer
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
          Bina code change kiye website ka brand logo, phone numbers, text, FSSAI number aur story update karein.
        </p>
      </div>

      {savedNotice && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            background: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            marginBottom: '20px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <i className="fa-solid fa-circle-check"></i>
          <span>Website settings aur Brand Logo safalta-purvak update ho gaye hain!</span>
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Section 0: BRAND LOGO UPLOAD (Directly as requested by user!) */}
        <div className="admin-card" style={{ border: '2px solid var(--gold)', background: 'rgba(212, 160, 23, 0.05)' }}>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.2rem',
              color: 'var(--maroon)',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <i className="fa-solid fa-image text-gold"></i>
            <span>Global Brand Logo Upload</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginBottom: '18px' }}>
            Yahan jo logo upload karenge wo website ke <strong>Header Navbar</strong>, <strong>Footer</strong>, <strong>About Section</strong> aur <strong>Admin Portal</strong> me sabhi jagah ek sath lag jayega!
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              flexWrap: 'wrap',
              background: 'var(--cream-card)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px dashed var(--gold)',
            }}
          >
            {/* Logo Preview */}
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: formData.logoBgColor || '#FAF8ED',
                border: '2px solid var(--gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-gold)',
                padding: '4px',
                flexShrink: 0,
              }}
            >
              {formData.logoUrl ? (
                <img
                  src={formData.logoUrl}
                  alt="Brand Logo Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.15)' }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--gold-dark)', fontWeight: 800, fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>
                  K
                </div>
              )}
            </div>

            {/* Upload Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="file"
                accept="image/*"
                id="brandLogoUploadInput"
                style={{ display: 'none' }}
                onChange={handleLogoUpload}
              />
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <label
                  htmlFor="brandLogoUploadInput"
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <span>{uploadingLogo ? 'Processing...' : 'Upload Brand Logo (PNG / JPG)'}</span>
                </label>

                {formData.logoUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(196, 30, 58, 0.1)',
                      color: 'var(--deep-red)',
                      border: '1px solid var(--deep-red)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    <i className="fa-solid fa-trash" style={{ marginRight: '6px' }}></i>
                    Remove Logo
                  </button>
                )}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>
                Recommended: Square image with transparent background (e.g. 500x500 PNG)
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Brand & Hero Settings */}
        <div className="admin-card">
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem',
              color: 'var(--maroon)',
              marginBottom: '16px',
              borderBottom: '1px solid var(--gray-200)',
              paddingBottom: '8px',
            }}
          >
            1. Brand Identity & Header
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <label className="form-label">Full Brand Header Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.brandName}
                onChange={(e) => handleChange('brandName', e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Short Brand Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.shortBrand}
                onChange={(e) => handleChange('shortBrand', e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">English Tagline</label>
              <input
                type="text"
                className="form-control"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Hindi Tagline</label>
              <input
                type="text"
                className="form-control"
                value={formData.taglineHindi}
                onChange={(e) => handleChange('taglineHindi', e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">FSSAI License Number</label>
              <input
                type="text"
                className="form-control"
                value={formData.fssaiNumber}
                onChange={(e) => handleChange('fssaiNumber', e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Established Year (Since)</label>
              <input
                type="text"
                className="form-control"
                value={formData.sinceYear}
                onChange={(e) => handleChange('sinceYear', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Social Settings */}
        <div className="admin-card">
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem',
              color: 'var(--maroon)',
              marginBottom: '16px',
              borderBottom: '1px solid var(--gray-200)',
              paddingBottom: '8px',
            }}
          >
            2. Contact Details & WhatsApp Order
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <label className="form-label">Company / Firm Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Primary Phone (Calling)</label>
              <input
                type="text"
                className="form-control"
                value={formData.primaryPhone}
                onChange={(e) => handleChange('primaryPhone', e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Secondary Phone</label>
              <input
                type="text"
                className="form-control"
                value={formData.secondaryPhone}
                onChange={(e) => handleChange('secondaryPhone', e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">WhatsApp Number (e.g. 919213544074)</label>
              <input
                type="text"
                className="form-control"
                value={formData.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-envelope-open-text text-gold"></i>
                <span>Web3Forms Access Key (Inquiries Sidha Email Par Pane Ke Liye)</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 12345678-abcd-1234-abcd-123456789abc"
                value={formData.web3formsAccessKey || ''}
                onChange={(e) => handleChange('web3formsAccessKey', e.target.value)}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '4px', display: 'block' }}>
                Apni free key <a href="https://web3forms.com" target="_blank" rel="noreferrer" style={{ color: 'var(--maroon)', textDecoration: 'underline', fontWeight: 700 }}>web3forms.com</a> par apna email daal kar lein aur yahan paste karein. Website se koi bhi inquiry aayegi toh turant aapke email par notification aa jayega!
              </span>
            </div>

            <div style={{ gridColumn: '1 / -1', background: 'rgba(212, 160, 23, 0.08)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(212, 160, 23, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-shield-halved text-gold"></i>
                  <span style={{ fontWeight: 700 }}>hCaptcha Spam Protection (Web3Forms ke liye)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={formData.hcaptchaEnabled ?? true}
                    onChange={(e) => handleChange('hcaptchaEnabled', e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--maroon)' }}
                  />
                  <span>Active</span>
                </label>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--gray-600)', marginBottom: '10px', lineHeight: 1.4 }}>
                Web3Forms dashboard me agar aapne hCaptcha on kiya hai, toh website ke contact form me automatically robot-checking box add ho jayega.
              </p>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '4px', display: 'block' }}>
                  hCaptcha Site Key (Default Web3Forms key: <code>50b2fe65-b00b-4b9e-ad62-3ba471098be2</code>):
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
                  value={formData.hcaptchaSiteKey || ''}
                  onChange={(e) => handleChange('hcaptchaSiteKey', e.target.value)}
                />
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Physical Address</label>
              <input
                type="text"
                className="form-control"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Story & Stats */}
        <div className="admin-card">
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem',
              color: 'var(--maroon)',
              marginBottom: '16px',
              borderBottom: '1px solid var(--gray-200)',
              paddingBottom: '8px',
            }}
          >
            3. About Story & Counter Stats
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">About Story Heading</label>
            <input
              type="text"
              className="form-control"
              value={formData.aboutHeading}
              onChange={(e) => handleChange('aboutHeading', e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">About Paragraph 1</label>
            <textarea
              rows={3}
              className="form-control"
              value={formData.aboutParagraph1}
              onChange={(e) => handleChange('aboutParagraph1', e.target.value)}
            ></textarea>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">About Paragraph 2</label>
            <textarea
              rows={3}
              className="form-control"
              value={formData.aboutParagraph2}
              onChange={(e) => handleChange('aboutParagraph2', e.target.value)}
            ></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
            <div>
              <label className="form-label">Natural Ingredients %</label>
              <input
                type="number"
                className="form-control"
                value={formData.statNaturalPercent}
                onChange={(e) => handleChange('statNaturalPercent', parseInt(e.target.value, 10))}
              />
            </div>

            <div>
              <label className="form-label">City Distributors Count</label>
              <input
                type="number"
                className="form-control"
                value={formData.statDistributors}
                onChange={(e) => handleChange('statDistributors', parseInt(e.target.value, 10))}
              />
            </div>

            <div>
              <label className="form-label">Pure Promise %</label>
              <input
                type="number"
                className="form-control"
                value={formData.statPurePromise}
                onChange={(e) => handleChange('statPurePromise', parseInt(e.target.value, 10))}
              />
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div style={{ textAlign: 'right', marginTop: '24px' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '14px 36px', fontSize: '1.05rem' }}>
            <i className="fa-solid fa-floppy-disk"></i>
            <span>Save All Website Customizations</span>
          </button>
        </div>
      </form>
    </div>
  );
};
