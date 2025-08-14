import React from 'react';

interface SortFilterProps {
  currentSort: 'tier' | 'name' | 'type' | 'newest' | 'oldest';
  onSortChange: (sort: 'tier' | 'name' | 'type' | 'newest' | 'oldest') => void;
}

export function SortFilter({ currentSort, onSortChange }: SortFilterProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Sort:</span>
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as 'tier' | 'name' | 'type' | 'newest' | 'oldest')}
        style={{
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          background: 'rgba(0, 0, 0, 0.4)',
          color: 'white',
          fontSize: '0.875rem',
        }}
      >
        <option value="tier">Tier</option>
        <option value="name">Name (A-Z)</option>
        <option value="type">Type</option>
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    </div>
  );
} 