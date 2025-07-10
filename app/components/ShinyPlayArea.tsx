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
        <h3>📅 Shiny Calendar</h3>
        <div className="calendar-controls">
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
          <div className="calendar-stats">
            <span className="stat-badge">
              <span className="stat-number">{portfolio.length}</span>
              <span className="stat-label">Total Shinies</span>
            </span>
            <span className="stat-badge">
              <span className="stat-number">{filteredMonths.length}</span>
              <span className="stat-label">Active Months</span>
            </span>
          </div>
        </div>
      </div>
      
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
    </div>
  );
} 