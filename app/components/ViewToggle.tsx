import React from 'react';

interface ViewToggleProps {
  currentView: 'cards' | 'list' | 'teams';
  onViewChange: (view: 'cards' | 'list' | 'teams') => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '25px',
        border: '1px solid rgba(255, 203, 5, 0.3)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background slider */}
      <div
        style={{
          position: 'absolute',
          top: '2px',
          left: currentView === 'cards' ? '2px' : currentView === 'list' ? '33.33%' : '66.66%',
          width: 'calc(33.33% - 2px)',
          height: 'calc(100% - 4px)',
          backgroundColor: '#ffcb05',
          borderRadius: '20px',
          transition: 'left 0.3s ease',
          zIndex: 1,
        }}
      />
      
      {/* Cards view button */}
      <button
        onClick={() => onViewChange('cards')}
        style={{
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'transparent',
          border: 'none',
          padding: '10px 20px',
          color: currentView === 'cards' ? '#000' : 'rgba(255, 255, 255, 0.9)',
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'color 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          minWidth: '80px',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '1rem' }}>⚏</span>
        Cards
      </button>
      
      {/* List view button */}
      <button
        onClick={() => onViewChange('list')}
        style={{
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'transparent',
          border: 'none',
          padding: '10px 20px',
          color: currentView === 'list' ? '#000' : 'rgba(255, 255, 255, 0.9)',
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'color 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          minWidth: '80px',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '1rem' }}>☰</span>
        List
      </button>

      {/* Teams view button */}
      <button
        onClick={() => onViewChange('teams')}
        style={{
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'transparent',
          border: 'none',
          padding: '10px 20px',
          color: currentView === 'teams' ? '#000' : 'rgba(255, 255, 255, 0.9)',
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'color 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          minWidth: '80px',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '1rem' }}>🏆</span>
        Teams
      </button>
    </div>
  );
} 