import React from 'react';

interface SortFilterProps {
  currentSort: 'tier' | 'name' | 'type' | 'newest' | 'oldest';
  onSortChange: (sort: 'tier' | 'name' | 'type' | 'newest' | 'oldest') => void;
}

export function SortFilter({ currentSort, onSortChange }: SortFilterProps) {
  return (
    <div>
      <label 
        htmlFor="sort-select"
        style={{ 
          color: '#ffcb05', 
          display: 'block', 
          marginBottom: '8px', 
          fontSize: '0.9rem',
          fontWeight: 'bold'
        }}
      >
        Sort By
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as 'tier' | 'name' | 'type' | 'newest' | 'oldest')}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          border: '1px solid #ffcb05',
          borderRadius: '8px',
          color: '#fff',
          padding: '10px 14px',
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer',
          width: '200px',
          appearance: 'none',
          backgroundImage: 'linear-gradient(45deg, transparent 50%, #ffcb05 50%), linear-gradient(135deg, #ffcb05 50%, transparent 50%)',
          backgroundPosition: 'calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px)',
          backgroundSize: '5px 5px, 5px 5px',
          backgroundRepeat: 'no-repeat',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 203, 5, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        }}
      >
        <option value="tier" style={{ backgroundColor: '#000', color: '#fff' }}>
          🏆 Tier (OU → UU → Doubles)
        </option>
        <option value="name" style={{ backgroundColor: '#000', color: '#fff' }}>
          🔤 Name (A-Z)
        </option>
        <option value="type" style={{ backgroundColor: '#000', color: '#fff' }}>
          🔥 Type (Fire → Water → Electric...)
        </option>
        <option value="newest" style={{ backgroundColor: '#000', color: '#fff' }}>
          🕒 Newest First
        </option>
        <option value="oldest" style={{ backgroundColor: '#000', color: '#fff' }}>
          📅 Oldest First
        </option>
      </select>
    </div>
  );
} 