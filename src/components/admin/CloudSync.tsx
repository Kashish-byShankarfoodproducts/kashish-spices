/**
 * ==============================================================================
 * KASHISH MASALE - CloudSync Component (Live Multi-Device Database)
 * ==============================================================================
 * Admin Panel ka sabse important solution:
 * Admin panel ke badlav sabhi phones, laptops aur customers ke screens par
 * bina redeploy kiye turant live dikhane ke liye Supabase Cloud Database sync panel.
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import { supabaseService, SupabaseConfig } from '../../services/supabaseService';
import { useProducts } from '../../context/ProductContext';
import { storageService } from '../../services/storageService';

export const CloudSync: React.FC = () => {
  const { products, siteConfig, refreshData } = useProducts();

  const [config, setConfig] = useState<SupabaseConfig>(() => supabaseService.getConfig());
  const [urlInput, setUrlInput] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [downloadingCode, setDownloadingCode] = useState(false);

  const [notification, setNotification] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const [showSql, setShowSql] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  useEffect(() => {
    const current = supabaseService.getConfig();
    setConfig(current);
    setUrlInput(current.url);
    setKeyInput(current.anonKey);
  }, []);

  const showNotice = (text: string, type: 'success' | 'error' | 'info') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // 1. Test Connection
  const handleTestConnection = async () => {
    setTesting(true);
    const res = await supabaseService.testConnection(urlInput, keyInput);
    setTesting(false);
    if (res.success) {
      showNotice(res.message, 'success');
    } else {
      showNotice(res.message, 'error');
    }
  };

  // 2. Save Config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || !keyInput.trim()) {
      showNotice('Kripya Supabase URL aur Anon Public Key dono bharein.', 'error');
      return;
    }

    setTesting(true);
    const testRes = await supabaseService.testConnection(urlInput, keyInput);
    setTesting(false);

    if (!testRes.success && !window.confirm(`Connection warning: ${testRes.message}\n\nKya aap phir bhi ye credentials save karna chahte hain?`)) {
      return;
    }

    supabaseService.saveConfig(urlInput, keyInput);
    const updated = supabaseService.getConfig();
    setConfig(updated);
    showNotice('Cloud Database credentials safalta-purvak save ho gaye!', 'success');
    await refreshData();
  };

  // 3. Disconnect
  const handleDisconnect = () => {
    if (window.confirm('Kya aap sach me Cloud Database disconnect karna chahte hain?')) {
      supabaseService.clearConfig();
      setConfig(supabaseService.getConfig());
      setUrlInput('');
      setKeyInput('');
      showNotice('Cloud Database disconnect kar diya gaya. Ab website Local Mode (IndexedDB) me chalegi.', 'info');
    }
  };

  // 4. Upload Local Products & Photos to Cloud (Sync)
  const handleSyncToCloud = async () => {
    if (!config.isConfigured) {
      showNotice('Pehle upar Supabase credentials save karein!', 'error');
      return;
    }

    setSyncing(true);
    try {
      const currentProducts = await storageService.getProducts();
      const currentConfig = storageService.getSiteConfig();
      const res = await supabaseService.syncAllToCloud(currentProducts, currentConfig);
      showNotice(`Safalta! ${res.count} masale aur aapki saari photos Cloud Database par upload ho gayi hain! Ab sabke phone me dikhega!`, 'success');
    } catch (err: any) {
      showNotice(`Upload error: ${err?.message || err}`, 'error');
    } finally {
      setSyncing(false);
    }
  };

  // 5. Download Updated defaultData.ts (No-Database Static Publish)
  const handleDownloadDefaultData = async () => {
    setDownloadingCode(true);
    try {
      const currentProducts = await storageService.getProducts();
      const currentConfig = storageService.getSiteConfig();
      const code = storageService.generateDefaultDataCode(currentProducts, currentConfig);

      const blob = new Blob([code], { type: 'text/typescript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'defaultData.ts';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showNotice('defaultData.ts safalta-purvak download ho gaya! Isse project ke src/services/ me replace karke git push karein.', 'success');
    } catch (err: any) {
      showNotice(`Download error: ${err?.message || err}`, 'error');
    } finally {
      setDownloadingCode(false);
    }
  };

  // Copy SQL script
  const sqlScript = `-- 1. Masala Products Table
create table if not exists products (
  id text primary key,
  title text not null,
  "hindiTitle" text,
  category text not null,
  "dietaryType" text not null,
  description text,
  weights jsonb,
  badge text,
  "imageUrl" text,
  images jsonb,
  "inStock" boolean default true,
  featured boolean default false,
  "createdAt" text
);

-- 2. Website Settings & Contact Table
create table if not exists site_config (
  id text primary key default 'main',
  config jsonb not null
);

-- 3. Public Read & Write Policies
alter table products enable row level security;
drop policy if exists "Public full access products" on products;
create policy "Public full access products" on products for all using (true) with check (true);

alter table site_config enable row level security;
drop policy if exists "Public full access site_config" on site_config;
create policy "Public full access site_config" on site_config for all using (true) with check (true);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlScript);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2500);
  };

  return (
    <div>
      {/* Top Banner */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon)', fontSize: '1.5rem' }}>
          Live Cloud Database & Multi-Device Sync (क्लाउड डेटाबेस सिंक)
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--gray-500)', lineHeight: 1.6 }}>
          Admin panel ke saare badlav, naye masale aur uploaded package photos sabhi ke phone aur laptop me live dikhane ka central hub.
        </p>
      </div>

      {/* Notification Alert */}
      {notification && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '10px',
            background:
              notification.type === 'success'
                ? '#d4edda'
                : notification.type === 'error'
                ? '#f8d7da'
                : '#d1ecf1',
            color:
              notification.type === 'success'
                ? '#155724'
                : notification.type === 'error'
                ? '#721c24'
                : '#0c5460',
            border: `1px solid ${
              notification.type === 'success'
                ? '#c3e6cb'
                : notification.type === 'error'
                ? '#f5c6cb'
                : '#bee5eb'
            }`,
            marginBottom: '24px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <i
            className={
              notification.type === 'success'
                ? 'fa-solid fa-circle-check'
                : notification.type === 'error'
                ? 'fa-solid fa-triangle-exclamation'
                : 'fa-solid fa-circle-info'
            }
          ></i>
          <span>{notification.text}</span>
        </div>
      )}

      {/* Connection Status Pill Banner */}
      <div
        style={{
          padding: '16px 20px',
          borderRadius: '12px',
          background: config.isConfigured ? 'rgba(40, 167, 69, 0.08)' : 'rgba(230, 81, 0, 0.08)',
          border: `1.5px solid ${config.isConfigured ? '#28a745' : '#e65100'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: config.isConfigured ? '#28a745' : '#e65100',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              flexShrink: 0,
            }}
          >
            <i className={config.isConfigured ? 'fa-solid fa-cloud-bolt' : 'fa-solid fa-laptop'}></i>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: config.isConfigured ? '#1e7e34' : '#b23b00' }}>
              {config.isConfigured ? '🟢 Live Cloud Database Synced (Active)' : '🟠 Local Mode (IndexedDB Only)'}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--gray-600)', margin: '2px 0 0' }}>
              {config.isConfigured
                ? 'Admin panel ke saare changes duniya ke har phone aur laptop par instant live dikh rahe hain.'
                : 'Abhi changes sirf ISI laptop/browser me save ho rahe hain. Sabke phone me dikhane ke liye Supabase connect karein ya code export karein.'}
            </p>
          </div>
        </div>

        {config.isConfigured && (
          <button
            onClick={handleDisconnect}
            className="btn btn-outline"
            style={{ padding: '6px 14px', fontSize: '0.8rem', color: '#dc3545', borderColor: '#dc3545' }}
          >
            <i className="fa-solid fa-link-slash"></i>
            <span>Disconnect</span>
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Card 1: Supabase Credentials Setup */}
        <div className="admin-card">
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon)', fontSize: '1.15rem', marginBottom: '14px' }}>
            <i className="fa-solid fa-database text-gold" style={{ marginRight: '8px' }}></i>
            1. Supabase Cloud Connection
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '18px', lineHeight: 1.5 }}>
            Apne Supabase project ka URL aur anon public key yahan daalein.
          </p>

          <form onSubmit={handleSaveConfig}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                Supabase Project URL:
              </label>
              <input
                type="url"
                placeholder="https://your-project.supabase.co"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--gray-300)',
                  fontSize: '0.88rem',
                  fontFamily: 'monospace',
                }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                Supabase Anon Public Key:
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--gray-300)',
                  fontSize: '0.88rem',
                  fontFamily: 'monospace',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing || !urlInput.trim() || !keyInput.trim()}
                className="btn btn-outline"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                {testing ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-plug"></i>}
                <span>Test Connection</span>
              </button>

              <button
                type="submit"
                disabled={testing}
                className="btn btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.85rem' }}
              >
                <i className="fa-solid fa-floppy-disk"></i>
                <span>Save & Connect</span>
              </button>
            </div>
          </form>

          {/* Sync Button */}
          {config.isConfigured && (
            <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--gray-200)' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--maroon)', marginBottom: '8px' }}>
                Existing Photos & Spices Sync
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--gray-500)', marginBottom: '12px', lineHeight: 1.5 }}>
                Aapne jo 4 photos aur naye masale is laptop me dale the, unhe 1-click me Cloud Database par upload karein:
              </p>
              <button
                type="button"
                onClick={handleSyncToCloud}
                disabled={syncing}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '10px', fontSize: '0.88rem', justifyContent: 'center' }}
              >
                {syncing ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Cloud par upload ho raha hai...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    <span>Upload Local Products & 4 Photos to Cloud</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Card 2: 100% Free Static Publish (Without Supabase) */}
        <div className="admin-card">
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon)', fontSize: '1.15rem', marginBottom: '14px' }}>
            <i className="fa-solid fa-code text-gold" style={{ marginRight: '8px' }}></i>
            2. Direct Code Publish (No Database Required)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '16px', lineHeight: 1.6 }}>
            Agar aap koi external database (Supabase) setup nahi karna chahte, toh aap apne naye masalo aur 4 photos ko direct <strong>defaultData.ts</strong> file me export kar sakte hain:
          </p>

          <div
            style={{
              background: '#fdfbf7',
              border: '1px dashed var(--gold)',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '18px',
            }}
          >
            <ol style={{ fontSize: '0.82rem', color: 'var(--gray-700)', paddingLeft: '18px', lineHeight: 1.7, margin: 0 }}>
              <li>Niche diye button se <strong>defaultData.ts</strong> download karein.</li>
              <li>Is downloaded file ko apne project folder ke <code>src/services/defaultData.ts</code> me replace kar dein.</li>
              <li>GitHub par commit aur push karein:
                <code style={{ display: 'block', background: '#332b24', color: '#ffe082', padding: '6px 10px', borderRadius: '4px', margin: '6px 0', fontFamily: 'monospace' }}>
                  git commit -am "Update catalog" &amp;&amp; git push
                </code>
              </li>
              <li>Cloudflare Pages 60 seconds me auto-deploy kar dega aur sabhi devices me turant live ho jayega!</li>
            </ol>
          </div>

          <button
            type="button"
            onClick={handleDownloadDefaultData}
            disabled={downloadingCode}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.9rem', justifyContent: 'center' }}
          >
            {downloadingCode ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              <i className="fa-solid fa-file-arrow-down"></i>
            )}
            <span>Download Updated defaultData.ts ({products.length} Products)</span>
          </button>
        </div>
      </div>

      {/* SQL Setup Helper Accordion */}
      <div className="admin-card" style={{ marginTop: '24px' }}>
        <div
          onClick={() => setShowSql(!showSql)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-circle-question text-gold" style={{ fontSize: '1.2rem' }}></i>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--maroon)' }}>
              Supabase 2-Minute Free Setup Guide &amp; SQL Query (क्लिक करके देखें)
            </h4>
          </div>
          <i className={`fa-solid fa-chevron-${showSql ? 'up' : 'down'}`} style={{ color: 'var(--gray-500)' }}></i>
        </div>

        {showSql && (
          <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--gray-200)' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>
              1. <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: 'var(--maroon)', fontWeight: 700, textDecoration: 'underline' }}>supabase.com</a> par jakar Free Account banayein aur "New Project" create karein.
              <br />
              2. Left sidebar me <strong>SQL Editor</strong> par click karein.
              <br />
              3. Niche diya hua SQL script paste karein aur green <strong>Run</strong> button dabayein:
            </p>

            <div style={{ position: 'relative', marginTop: '10px' }}>
              <button
                onClick={handleCopySql}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: 'var(--gold)',
                  color: '#1a1209',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  border: 'none',
                  cursor: 'pointer',
                  zIndex: 2,
                }}
              >
                {sqlCopied ? (
                  <>
                    <i className="fa-solid fa-check"></i> Copied!
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-copy"></i> Copy SQL
                  </>
                )}
              </button>

              <pre
                style={{
                  background: '#1e1e1e',
                  color: '#d4d4d4',
                  padding: '16px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  overflowX: 'auto',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {sqlScript}
              </pre>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', lineHeight: 1.6, marginTop: '14px' }}>
              4. Uske baad Supabase me <strong>Project Settings &gt; API</strong> me jakar <strong>Project URL</strong> aur <strong>anon public key</strong> copy karke upar form me daalein.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
