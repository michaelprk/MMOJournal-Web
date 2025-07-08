import { useState } from 'react';
import type { CompetitiveTier } from '../types/pokemon';
import { COMPETITIVE_TIERS, TIER_FULL_NAMES } from '../types/pokemon';

interface TierFilterProps {
  selectedTier?: CompetitiveTier;
  onTierChange: (tier?: CompetitiveTier) => void;
  style?: 'dropdown' | 'tabs';
}

export function TierFilter({ selectedTier, onTierChange, style = 'dropdown' }: TierFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (style === 'tabs') {
    return (
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
        }}
      >
        <button
          onClick={() => onTierChange(undefined)}
          style={{
            backgroundColor: !selectedTier ? '#ffcb05' : 'rgba(255, 203, 5, 0.2)',
            color: !selectedTier ? '#000' : '#ffcb05',
            border: '2px solid #ffcb05',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!selectedTier) return;
            e.currentTarget.style.backgroundColor = 'rgba(255, 203, 5, 0.3)';
          }}
          onMouseLeave={(e) => {
            if (!selectedTier) return;
            e.currentTarget.style.backgroundColor = 'rgba(255, 203, 5, 0.2)';
          }}
        >
          ALL
        </button>
        {COMPETITIVE_TIERS.map((tier) => (
          <button
            key={tier}
            onClick={() => onTierChange(tier)}
            style={{
              backgroundColor: selectedTier === tier ? '#ffcb05' : 'rgba(255, 203, 5, 0.2)',
              color: selectedTier === tier ? '#000' : '#ffcb05',
              border: '2px solid #ffcb05',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (selectedTier === tier) return;
              e.currentTarget.style.backgroundColor = 'rgba(255, 203, 5, 0.3)';
            }}
            onMouseLeave={(e) => {
              if (selectedTier === tier) return;
              e.currentTarget.style.backgroundColor = 'rgba(255, 203, 5, 0.2)';
            }}
            title={TIER_FULL_NAMES[tier]}
          >
            {tier}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: 'rgba(255, 203, 5, 0.2)',
          border: '2px solid #ffcb05',
          color: '#ffcb05',
          padding: '12px 40px 12px 16px',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '200px',
          textAlign: 'left',
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 203, 5, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 203, 5, 0.2)';
        }}
      >
        {selectedTier ? `${selectedTier} - ${TIER_FULL_NAMES[selectedTier]}` : 'SELECT TIER'}
        <span
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: `translateY(-50%) rotate(${isOpen ? '180deg' : '0deg'})`,
            transition: 'transform 0.2s ease',
            fontSize: '0.8rem',
          }}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
            }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              border: '2px solid #ffcb05',
              borderRadius: '8px',
              marginTop: '4px',
              zIndex: 20,
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={() => {
                onTierChange(undefined);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                backgroundColor: !selectedTier ? 'rgba(255, 203, 5, 0.3)' : 'transparent',
                border: 'none',
                color: '#ffcb05',
                padding: '12px 16px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: !selectedTier ? 'bold' : 'normal',
                borderBottom: '1px solid rgba(255, 203, 5, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 203, 5, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = !selectedTier ? 'rgba(255, 203, 5, 0.3)' : 'transparent';
              }}
            >
              All Tiers
            </button>
            {COMPETITIVE_TIERS.map((tier) => (
              <button
                key={tier}
                onClick={() => {
                  onTierChange(tier);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  backgroundColor: selectedTier === tier ? 'rgba(255, 203, 5, 0.3)' : 'transparent',
                  border: 'none',
                  color: '#ffcb05',
                  padding: '12px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: selectedTier === tier ? 'bold' : 'normal',
                  borderBottom: tier !== COMPETITIVE_TIERS[COMPETITIVE_TIERS.length - 1] ? '1px solid rgba(255, 203, 5, 0.2)' : 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 203, 5, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = selectedTier === tier ? 'rgba(255, 203, 5, 0.3)' : 'transparent';
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>{tier}</div>
                  <div style={{ fontSize: '0.8rem', color: '#ccc' }}>{TIER_FULL_NAMES[tier]}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 