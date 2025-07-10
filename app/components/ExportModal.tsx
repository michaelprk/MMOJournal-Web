import React, { useState } from 'react';
import type { PokemonBuild } from '../types/pokemon';
import { buildToShowdownFormat } from '../utils/showdown-parser';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  pokemon?: PokemonBuild;
  team?: PokemonBuild[];
  title?: string;
}

export function ExportModal({ isOpen, onClose, pokemon, team, title }: ExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const exportText = team 
    ? team.map(p => buildToShowdownFormat(p)).join('\n\n')
    : pokemon 
    ? buildToShowdownFormat(pokemon)
    : '';

  const displayTitle = title || (team ? 'Team Export' : pokemon ? `${pokemon.name} Export` : 'Export');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback method
      const textArea = document.createElement('textarea');
      textArea.value = exportText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.9))',
          border: '2px solid #ffcb05',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 30px rgba(255, 203, 5, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
          borderBottom: '1px solid rgba(255, 203, 5, 0.3)',
          paddingBottom: '16px',
        }}>
          <h3 style={{ 
            color: '#ffcb05', 
            margin: 0, 
            fontSize: '1.4rem', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            📋 {displayTitle}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid #dc3545',
              color: '#dc3545',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ 
            color: '#ccc', 
            fontSize: '0.9rem', 
            marginBottom: '8px' 
          }}>
            Pokemon Showdown Format:
          </div>
          
          <textarea
            value={exportText}
            readOnly
            style={{
              flex: 1,
              background: 'rgba(0, 0, 0, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              padding: '16px',
              color: '#fff',
              fontSize: '0.9rem',
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              lineHeight: '1.5',
              resize: 'none',
              minHeight: '200px',
              maxHeight: '400px',
              overflow: 'auto',
            }}
            onClick={(e) => e.currentTarget.select()}
          />
        </div>

        {/* Footer */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '12px', 
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 203, 5, 0.3)',
        }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #ccc',
              color: '#ccc',
              padding: '10px 20px',
              borderRadius: '6px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(204, 204, 204, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Close
          </button>
          
          <button
            onClick={handleCopy}
            style={{
              backgroundColor: copied ? '#28a745' : '#ffcb05',
              color: copied ? '#fff' : '#000',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => {
              if (!copied) {
                e.currentTarget.style.backgroundColor = '#e6b800';
              }
            }}
            onMouseLeave={(e) => {
              if (!copied) {
                e.currentTarget.style.backgroundColor = '#ffcb05';
              }
            }}
          >
            {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
          </button>
        </div>
      </div>
    </div>
  );
} 