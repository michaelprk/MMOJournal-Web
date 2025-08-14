import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AccountSettingsModal from './AccountSettingsModal';

export function AuthBar() {
  const { user, initializing, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (initializing || !user) return null;

  const handleSignOut = async () => {
    try {
      setBusy(true);
      await signOut();
    } finally {
      setBusy(false);
      window.location.assign('/login');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 8,
        right: 8,
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.6)',
        color: '#fff',
        padding: '6px 10px',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: '0.9rem',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
      }}
    >
      <span>Signed in</span>
      <button
        onClick={() => setSettingsOpen(true)}
        disabled={busy}
        style={{
          backgroundColor: 'transparent',
          color: '#ffcb05',
          border: '1px solid rgba(255,203,5,0.5)',
          borderRadius: 4,
          padding: '4px 8px',
          fontWeight: 700,
          cursor: busy ? 'not-allowed' : 'pointer',
          opacity: busy ? 0.7 : 1
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,203,5,0.15)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        Account
      </button>
      <button
        onClick={handleSignOut}
        disabled={busy}
        style={{
          backgroundColor: '#ffcb05',
          color: '#000',
          border: 'none',
          borderRadius: 4,
          padding: '4px 8px',
          fontWeight: 700,
          cursor: busy ? 'not-allowed' : 'pointer',
          opacity: busy ? 0.7 : 1
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e6b800')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffcb05')}
      >
        {busy ? 'Signing out...' : 'Sign out'}
      </button>
      <AccountSettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}


