/**
 * ==============================================================================
 * KASHISH MASALE - DataBackup Component
 * ==============================================================================
 * Is component me 3 essential administrative tools hain:
 * 1. Data Backup Download: Saare masalo aur uploaded images ka JSON backup.
 * 2. Data Backup Restore: Purane backup se sara data restore karna.
 * 3. Factory Reset: Website ko original 24 default masalo par wapas lana.
 * 4. Change Password: Admin credentials badalna.
 * ==============================================================================
 */

import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';

export const DataBackup: React.FC = () => {
  const { resetToDefaults } = useProducts();
  const { changePassword } = useAuth();

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 1. Export JSON Backup
  const handleExportBackup = async () => {
    try {
      const jsonStr = await storageService.exportFullBackup();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kashish-spices-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({ text: 'Backup safalta-purvak download ho gaya!', type: 'success' });
      setTimeout(() => setMessage(null), 3500);
    } catch (e) {
      setMessage({ text: 'Backup download karne me error aaya.', type: 'error' });
    }
  };

  // 2. Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const success = await storageService.importFullBackup(content);
        if (success) {
          setMessage({ text: 'Backup safalta-purvak restore ho gaya! Page reload ho raha hai...', type: 'success' });
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setMessage({ text: 'Backup restore nahi ho paya. File format galat hai.', type: 'error' });
        }
      } catch (err) {
        setMessage({ text: 'Backup parse error.', type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  // 3. Reset Factory Defaults
  const handleResetDefaults = async () => {
    if (window.confirm('Kya aap sach me website ko Factory Default (Original 24 masale) par reset karna chahte hain?')) {
      await resetToDefaults();
      setMessage({ text: 'Website original default catalog par reset ho gayi!', type: 'success' });
      setTimeout(() => setMessage(null), 3500);
    }
  };

  // 4. Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Naya password aur confirm password match nahi ho rahe!', type: 'error' });
      return;
    }

    const res = await changePassword(oldPassword, newPassword);
    if (res.success) {
      setMessage({ text: res.message, type: 'success' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setMessage({ text: res.message, type: 'error' });
    }
    setTimeout(() => setMessage(null), 3500);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon)', fontSize: '1.5rem' }}>
          Backup, Security & System Tools
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
          Catalog backup download karein, data restore karein, ya admin password badlein.
        </p>
      </div>

      {message && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            background: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            marginBottom: '20px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <i className={message.type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-triangle-exclamation'}></i>
          <span>{message.text}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Card 1: Backup & Restore */}
        <div className="admin-card">
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem',
              color: 'var(--maroon)',
              marginBottom: '16px',
            }}
          >
            <i className="fa-solid fa-cloud-arrow-down text-gold" style={{ marginRight: '8px' }}></i>
            Database Backup & Restore
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--gray-500)', lineHeight: 1.6, marginBottom: '20px' }}>
            Saare masalo ki jaankari, uploaded photos aur website settings ka complete JSON backup download karein.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn btn-primary" onClick={handleExportBackup} style={{ width: '100%' }}>
              <i className="fa-solid fa-download"></i>
              <span>Download JSON Backup</span>
            </button>

            <div>
              <input
                type="file"
                accept=".json"
                id="importBackupInput"
                style={{ display: 'none' }}
                onChange={handleImportBackup}
              />
              <label
                htmlFor="importBackupInput"
                className="btn btn-outline"
                style={{ width: '100%', textAlign: 'center', cursor: 'pointer', display: 'block' }}
              >
                <i className="fa-solid fa-upload" style={{ marginRight: '6px' }}></i>
                Restore From Backup File
              </label>
            </div>
          </div>
        </div>

        {/* Card 2: Factory Reset */}
        <div className="admin-card">
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem',
              color: 'var(--deep-red)',
              marginBottom: '16px',
            }}
          >
            <i className="fa-solid fa-rotate-left" style={{ marginRight: '8px' }}></i>
            Reset to Factory Default
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--gray-500)', lineHeight: 1.6, marginBottom: '20px' }}>
            Website ko shuruati 24 authentic masalo par restore karein. Isse custom added items replace ho jayenge.
          </p>

          <button
            onClick={handleResetDefaults}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(196, 30, 58, 0.1)',
              color: 'var(--deep-red)',
              border: '2px solid var(--deep-red)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>Restore Factory Default Catalog</span>
          </button>
        </div>

        {/* Card 3: Change Admin Password */}
        <div className="admin-card" style={{ gridColumn: '1 / -1' }}>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem',
              color: 'var(--maroon)',
              marginBottom: '16px',
            }}
          >
            <i className="fa-solid fa-shield-halved text-gold" style={{ marginRight: '8px' }}></i>
            Security: Change Admin Password
          </h3>

          <form onSubmit={handleChangePassword}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  required
                  className="form-control"
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">New Password (Min 6 chars)</label>
                <input
                  type="password"
                  required
                  className="form-control"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  required
                  className="form-control"
                  placeholder="Re-type new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginTop: '18px', textAlign: 'right' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
                <i className="fa-solid fa-key"></i>
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
