import React, { useState } from 'react';
import type { ShinyPortfolio } from '../types/pokemon';
import { getShinySpritePath, getPokemonColors } from '../types/pokemon';

interface ShinyCalendarProps {
  portfolio: ShinyPortfolio[];
}

interface MonthData {
  month: number;
  year: number;
  monthName: string;
  shinies: ShinyPortfolio[];
}

export default function ShinyCalendar({ portfolio }: ShinyCalendarProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'showcase'>('calendar');
  const [hoveredShiny, setHoveredShiny] = useState<ShinyPortfolio | null>(null);
  
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>View:</span>
            <button
              onClick={() => setViewMode(viewMode === 'calendar' ? 'showcase' : 'calendar')}
              style={{
                backgroundColor: 'rgba(255, 215, 0, 0.2)',
                color: '#ffd700',
                border: '1px solid #ffd700',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
              }}
            >
              {viewMode === 'calendar' ? '🖼️ Showcase' : '📅 Calendar'}
            </button>
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
              
              <div className="month-shinies">
                {monthData.shinies.map((shiny, shinyIndex) => {
                  const pokemonColors = getPokemonColors(shiny.pokemonId);
                  const dayOfMonth = new Date(shiny.dateFound).getDate();
                  const isRecent = new Date(shiny.dateFound).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000);
                  
                  return (
                    <div 
                      key={shiny.id} 
                      className={`calendar-shiny ${isRecent ? 'recent' : ''}`}
                      style={{
                        animationDelay: `${(index * 0.1) + (shinyIndex * 0.05)}s`
                      }}
                    >
                      <div className="shiny-date-marker">
                        <span className="day-number">{dayOfMonth}</span>
                      </div>
                      
                      <div className="shiny-display">
                        <div 
                          className="shiny-glow-ring"
                          style={{
                            boxShadow: `0 0 20px ${pokemonColors.glowLight}, inset 0 0 20px ${pokemonColors.glowLight}`
                          }}
                        ></div>
                        
                        <img 
                          src={getShinySpritePath(shiny.pokemonId, shiny.pokemonName)}
                          alt={`Shiny ${shiny.pokemonName}`}
                          className="calendar-sprite"
                          style={{
                            filter: `drop-shadow(0 0 10px ${pokemonColors.glow}) drop-shadow(0 0 20px ${pokemonColors.glowLight})`,
                          }}
                          onError={(e) => {
                            e.currentTarget.src = '/images/shiny-sprites/001_Bulbasaur.gif';
                          }}
                        />
                        
                        {isRecent && <div className="recent-badge">NEW!</div>}
                      </div>
                      
                      <div className="shiny-info">
                        <div className="shiny-name">{shiny.pokemonName}</div>
                        <div className="shiny-method">{shiny.method}</div>
                        {shiny.encounterCount && (
                          <div className="shiny-encounters">{shiny.encounterCount.toLocaleString()} enc</div>
                        )}
                      </div>
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '16px',
            padding: '20px',
            position: 'relative'
          }}>
            {portfolio.map((shiny, index) => {
              const pokemonColors = getPokemonColors(shiny.pokemonId);
              const isRecent = new Date(shiny.dateFound).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000);
              
              return (
                <div 
                  key={shiny.id}
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: `2px solid ${pokemonColors.glowLight}`,
                    borderRadius: '12px',
                    padding: '12px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    animationDelay: `${index * 0.05}s`,
                    animation: 'fadeInScale 0.6s ease forwards',
                    opacity: 0,
                    transform: 'scale(0.8)',
                  }}
                  onMouseEnter={() => setHoveredShiny(shiny)}
                  onMouseLeave={() => setHoveredShiny(null)}
                  onMouseMove={(e) => {
                    if (hoveredShiny?.id === shiny.id) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      
                      e.currentTarget.style.transform = `scale(1.1) perspective(1000px) rotateX(${(y - rect.height/2) * 0.1}deg) rotateY(${(x - rect.width/2) * -0.1}deg)`;
                      e.currentTarget.style.boxShadow = `0 8px 25px ${pokemonColors.glow}, 0 0 30px ${pokemonColors.glowLight}`;
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = `0 4px 12px rgba(0,0,0,0.3)`;
                  }}
                >
                  {isRecent && (
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
                      color: '#fff',
                      fontSize: '0.6rem',
                      fontWeight: 'bold',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      animation: 'bounce 2s infinite'
                    }}>
                      NEW!
                    </div>
                  )}
                  
                  <img 
                    src={getShinySpritePath(shiny.pokemonId, shiny.pokemonName)}
                    alt={`Shiny ${shiny.pokemonName}`}
                    style={{
                      width: '64px',
                      height: '64px',
                      filter: `drop-shadow(0 0 15px ${pokemonColors.glow}) drop-shadow(0 0 25px ${pokemonColors.glowLight})`,
                      marginBottom: '8px'
                    }}
                    onError={(e) => {
                      e.currentTarget.src = '/images/shiny-sprites/001_Bulbasaur.gif';
                    }}
                  />
                  
                  <div style={{
                    color: '#fff',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    marginBottom: '4px'
                  }}>
                    {shiny.pokemonName}
                  </div>
                  
                  <div style={{
                    color: pokemonColors.glowLight,
                    fontSize: '0.7rem',
                    opacity: 0.8
                  }}>
                    {new Date(shiny.dateFound).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Hover Information Tooltip */}
          {hoveredShiny && (
            <div style={{
              position: 'fixed',
              top: '50%',
              right: '20px',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.95)',
              border: `2px solid ${getPokemonColors(hoveredShiny.pokemonId).glowLight}`,
              borderRadius: '12px',
              padding: '16px',
              minWidth: '250px',
              zIndex: 1000,
              animation: 'slideInRight 0.3s ease',
              boxShadow: `0 8px 25px ${getPokemonColors(hoveredShiny.pokemonId).glow}`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <img 
                  src={getShinySpritePath(hoveredShiny.pokemonId, hoveredShiny.pokemonName)}
                  alt={`Shiny ${hoveredShiny.pokemonName}`}
                  style={{
                    width: '48px',
                    height: '48px',
                    filter: `drop-shadow(0 0 10px ${getPokemonColors(hoveredShiny.pokemonId).glow})`
                  }}
                />
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '1.1rem' }}>
                    {hoveredShiny.pokemonName}
                  </h4>
                  <div style={{ color: getPokemonColors(hoveredShiny.pokemonId).glowLight, fontSize: '0.8rem' }}>
                    #{hoveredShiny.pokemonId.toString().padStart(3, '0')}
                  </div>
                </div>
              </div>
              
              <div style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: '1.4' }}>
                <div style={{ marginBottom: '6px' }}>
                  <strong style={{ color: '#ffd700' }}>Method:</strong> {hoveredShiny.method}
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <strong style={{ color: '#ffd700' }}>Date Found:</strong> {new Date(hoveredShiny.dateFound).toLocaleDateString()}
                </div>
                {hoveredShiny.nature && (
                  <div style={{ marginBottom: '6px' }}>
                    <strong style={{ color: '#ffd700' }}>Nature:</strong> {hoveredShiny.nature}
                  </div>
                )}
                {hoveredShiny.encounterCount && (
                  <div style={{ marginBottom: '6px' }}>
                    <strong style={{ color: '#ffd700' }}>Encounters:</strong> {hoveredShiny.encounterCount.toLocaleString()}
                  </div>
                )}
                {hoveredShiny.notes && (
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                    <strong style={{ color: '#ffd700' }}>Notes:</strong><br />
                    <em style={{ color: '#aaa' }}>{hoveredShiny.notes}</em>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 