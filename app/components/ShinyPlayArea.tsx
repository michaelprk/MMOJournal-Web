import React, { useState } from 'react';
import type { ShinyPortfolio } from '../types/pokemon';
import { getPokemonColors } from '../types/pokemon';
import ShinyTile, { type ShinyHoverDetails } from './shiny/ShinyTile';

interface ShinyCalendarProps {
  portfolio: ShinyPortfolio[];
  onEdit?: (row: ShinyPortfolio) => void;
}

interface MonthData {
  month: number;
  year: number;
  monthName: string;
  shinies: ShinyPortfolio[];
}

export default function ShinyCalendar({ portfolio, onEdit }: ShinyCalendarProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'showcase'>('calendar');
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'rarity'>('date');
  
  if (portfolio.length === 0) {
    return (
      <div className="shiny-calendar">
        <div className="calendar-header">
          <h3>📅 Shiny Calendar</h3>
          <p>Your shiny hunting timeline will appear here!</p>
        </div>
        <div className="empty-calendar">
          <div className="empty-calendar-grid">
            <div className="empty-month">
              <div className="month-header">Jan</div>
              <div className="empty-days"></div>
            </div>
            <div className="empty-month">
              <div className="month-header">Feb</div>
              <div className="empty-days"></div>
            </div>
            <div className="empty-month">
              <div className="month-header">Mar</div>
              <div className="empty-days"></div>
            </div>
            <div className="empty-month">
              <div className="month-header">Apr</div>
              <div className="empty-days"></div>
            </div>
          </div>
          <p>Start hunting to fill your calendar!</p>
        </div>
      </div>
    );
  }

  // Group shinies by month and year
  const groupedData: { [key: string]: MonthData } = {};
  
  portfolio.forEach(shiny => {
    const date = new Date(shiny.dateFound);
    const month = date.getMonth();
    const year = date.getFullYear();
    const key = `${year}-${month}`;
    
    if (!groupedData[key]) {
      groupedData[key] = {
        month,
        year,
        monthName: date.toLocaleString('default', { month: 'long' }),
        shinies: []
      };
    }
    
    groupedData[key].shinies.push(shiny);
  });

  // Sort by year and month
  const sortedMonths = Object.values(groupedData).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year; // Most recent year first
    return b.month - a.month; // Most recent month first
  });

  // Get available years
  const availableYears = [...new Set(sortedMonths.map(m => m.year))].sort((a, b) => b - a);

  // Filter by selected year if any
  const filteredMonths = selectedYear ? sortedMonths.filter(m => m.year === selectedYear) : sortedMonths;

  return (
    <div className="shiny-calendar">
      <div className="calendar-header">
        <h3>{viewMode === 'calendar' ? '📅 Shiny Calendar' : '✨ Shiny Showcase'}</h3>
        <div className="calendar-controls">
          {/* View Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>View:</span>
            <span style={{ fontSize: '0.8rem', color: '#ccc', minWidth: 90, textAlign: 'right' }}>{viewMode === 'calendar' ? 'Calendar' : 'Showcase'}</span>
            <label style={{ position: 'relative', display: 'inline-block', width: 46, height: 24 }}>
              <input
                type="checkbox"
                checked={viewMode === 'showcase'}
                onChange={() => setViewMode(viewMode === 'calendar' ? 'showcase' : 'calendar')}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(255, 215, 0, 0.25)', border: '1px solid #ffd700', borderRadius: 999,
                  transition: '0.2s'
                }}
              />
              <span
                style={{
                  position: 'absolute', height: 18, width: 18, left: viewMode === 'showcase' ? 26 : 4, bottom: 3,
                  backgroundColor: '#ffd700', borderRadius: '50%', transition: '0.2s'
                }}
              />
            </label>
          </div>
          
          {viewMode === 'calendar' && (
            <div className="year-selector">
              <label>Year:</label>
              <select 
                value={selectedYear || 'all'} 
                onChange={(e) => setSelectedYear(e.target.value === 'all' ? null : parseInt(e.target.value))}
              >
                <option value="all">All Years</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}
          
          <div className="calendar-stats">
            <span className="stat-badge">
              <span className="stat-number">{portfolio.length}</span>
              <span className="stat-label">Total Shinies</span>
            </span>
            {viewMode === 'calendar' && (
              <span className="stat-badge">
                <span className="stat-number">{filteredMonths.length}</span>
                <span className="stat-label">Active Months</span>
              </span>
            )}
          </div>
        </div>
      </div>
      
      {viewMode === 'calendar' ? (
        /* Calendar View */
        <div className="calendar-timeline">
          {filteredMonths.map((monthData, index) => (
            <div key={`${monthData.year}-${monthData.month}`} className="calendar-month">
              <div className="month-header">
                <div className="month-info">
                  <h4>{monthData.monthName} {monthData.year}</h4>
                  <span className="month-count">{monthData.shinies.length} shinies</span>
                </div>
                <div className="month-decoration"></div>
              </div>
              <div className="month-shinies" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
                {monthData.shinies.map((shiny, shinyIndex) => {
                  const details: ShinyHoverDetails = {
                    id: shiny.id,
                    pokemonId: shiny.pokemonId,
                    pokemonName: shiny.pokemonName,
                    method: shiny.method as any,
                    date: shiny.dateFound,
                    nature: shiny.nature || null,
                    encounters: shiny.encounterCount ?? null,
                    notes: shiny.notes || null,
                    isPhase: (shiny as any).is_phase || false,
                  };
                  return (
                    <div key={shiny.id} style={{ animationDelay: `${(index * 0.1) + (shinyIndex * 0.05)}s` }}>
                      <ShinyTile
                        details={details}
                        size={56}
                        showName
                        onEdit={(d) => onEdit?.({
                          id: d.id,
                          pokemonId: d.pokemonId,
                          pokemonName: d.pokemonName,
                          method: (d.method || shiny.method) as any,
                          dateFound: shiny.dateFound,
                          nature: shiny.nature,
                          encounterCount: shiny.encounterCount,
                          ivs: shiny.ivs,
                          notes: shiny.notes,
                          createdAt: shiny.createdAt,
                          updatedAt: shiny.updatedAt,
                        })}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Showcase View */
        <div className="shiny-showcase">
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <label style={{ color: '#ffd700', fontSize: '0.9rem' }}>Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6, padding: '6px 8px' }}
            >
              <option value="date">Date</option>
              <option value="type">Type</option>
              <option value="rarity">Rarity</option>
            </select>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '16px',
            padding: '20px',
            position: 'relative'
          }}>
            {portfolio
              .slice()
              .sort((a, b) => {
                if (sortBy === 'date') return new Date(b.dateFound).getTime() - new Date(a.dateFound).getTime();
                if (sortBy === 'type') return a.pokemonName.localeCompare(b.pokemonName);
                if (sortBy === 'rarity') return 0;
                return 0;
              })
              .map((shiny, index) => {
                const details: ShinyHoverDetails = {
                  id: shiny.id,
                  pokemonId: shiny.pokemonId,
                  pokemonName: shiny.pokemonName,
                  method: shiny.method as any,
                  date: shiny.dateFound,
                  region: (shiny as any).region ?? null,
                  area: (shiny as any).area ?? null,
                  rarity: (shiny as any).rarity ?? null,
                  nature: (shiny as any).nature ?? null,
                  encounters: shiny.encounterCount ?? null,
                  notes: shiny.notes ?? null,
                  isPhase: (shiny as any).is_phase || false,
                };
                return (
                  <div key={shiny.id} style={{ animationDelay: `${index * 0.05}s`, animation: 'fadeInScale 0.6s ease forwards', opacity: 0 }}>
                    <ShinyTile details={details} size={64} showName onEdit={() => onEdit && onEdit(shiny)} />
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
} 