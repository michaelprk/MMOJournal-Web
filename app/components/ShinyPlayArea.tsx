import React, { useMemo, useRef, useState, useEffect } from 'react';
import type { ShinyPortfolio } from '../types/pokemon';
import { getPokemonColors, getShinySpritePath } from '../types/pokemon';
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
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null); // 0-11
  const [viewMode, setViewMode] = useState<'calendar' | 'showcase'>('calendar');
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'rarity'>('date');
  const [openDay, setOpenDay] = useState<null | { monthIndex: number; day: number; anchor: { x: number; y: number; w: number; h: number } }>(null);
  const isEmpty = portfolio.length === 0;
  
  // no early returns before hooks; render empty state later

  // Group shinies by month and year
  const groupedData: { [key: string]: MonthData } = {};
  for (const shiny of portfolio) {
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
  }

  // Sort by year and month
  const sortedMonths = Object.values(groupedData).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year; // Most recent year first
    return b.month - a.month; // Most recent month first
  });

  // Year bounds and defaults
  const { minYear, maxYear } = useMemo(() => {
    let minY = 2010;
    let maxY = new Date().getFullYear();
    if (portfolio.length > 0) {
      const years = portfolio.map((p) => new Date(p.dateFound).getFullYear());
      minY = Math.min(...years, minY);
      maxY = Math.max(...years, maxY);
      // Cap to current year for max as requested
      maxY = Math.min(maxY, new Date().getFullYear());
    }
    return { minYear: minY, maxYear: maxY };
  }, [portfolio]);
  useEffect(() => {
    if (selectedYear === null) {
      setSelectedYear(new Date().getFullYear());
    }
  }, [selectedYear]);
  const yearTotal = useMemo(() => {
    if (selectedYear == null) return 0;
    return portfolio.reduce((acc, p) => acc + (new Date(p.dateFound).getFullYear() === selectedYear ? 1 : 0), 0);
  }, [portfolio, selectedYear]);
  const goPrevYear = () => setSelectedYear((y) => (y == null ? null : Math.max(minYear, y - 1)));
  const goNextYear = () => setSelectedYear((y) => (y == null ? null : Math.min(maxYear, y + 1)));

  // Filter by selected year if any
  const filteredMonths = selectedYear ? sortedMonths.filter(m => m.year === selectedYear) : sortedMonths;
  const monthsByYear = selectedYear
    ? Array.from({ length: 12 }, (_, i) => ({
        month: i,
        year: selectedYear,
        monthName: new Date(selectedYear, i, 1).toLocaleString('default', { month: 'long' }),
        shinies: filteredMonths.find(m => m.month === i)?.shinies || []
      }))
    : [];

  // Build memoized per-month day index for counts and items
  type DayIndex = { counts: Record<number, number>; items: Record<number, ShinyPortfolio[]> };
  const monthDayIndex: DayIndex[] = useMemo(() => {
    return monthsByYear.map(({ month, year, shinies }) => {
      const counts: Record<number, number> = {};
      const items: Record<number, ShinyPortfolio[]> = {};
      shinies.forEach(s => {
        const d = new Date(s.dateFound);
        if (d.getFullYear() === year && d.getMonth() === month) {
          const day = d.getDate();
          counts[day] = (counts[day] || 0) + 1;
          (items[day] ||= []).push(s);
        }
      });
      return { counts, items };
    });
  }, [monthsByYear]);

  // Close popover on escape or outside click
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenDay(null); };
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-day-popover]')) return;
      if (target.closest('[data-day-cell]')) return; // clicking another cell is handled separately
      setOpenDay(null);
    };
    if (openDay) {
      window.addEventListener('keydown', onKey);
      window.addEventListener('mousedown', onClick);
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [openDay]);

  return (
    <div className="shiny-calendar">
      <div className="calendar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '8px 12px', border: '1px solid rgba(255,215,0,0.12)', borderRadius: 10, background: 'rgba(0,0,0,0.35)' }}>
        {/* Left: View toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>View</span>
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

        {/* Center: Year controls */}
        <div className="year-selector" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            aria-label="Previous Year"
            onClick={goPrevYear}
            disabled={selectedYear == null || selectedYear <= minYear}
            aria-disabled={selectedYear == null || selectedYear <= minYear}
            style={{ background: 'transparent', color: '#ffd700', border: 'none', padding: '4px 8px', cursor: (selectedYear == null || selectedYear <= minYear) ? 'not-allowed' : 'pointer' }}
            onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !(selectedYear == null || selectedYear <= minYear)) { e.preventDefault(); goPrevYear(); } }}
          >
            ◀
          </button>
          <div aria-live="polite" style={{ color: '#fff', fontWeight: 800 }}>{selectedYear ?? ''}</div>
          <button
            aria-label="Next Year"
            onClick={goNextYear}
            disabled={selectedYear == null || selectedYear >= maxYear}
            aria-disabled={selectedYear == null || selectedYear >= maxYear}
            style={{ background: 'transparent', color: '#ffd700', border: 'none', padding: '4px 8px', cursor: (selectedYear == null || selectedYear >= maxYear) ? 'not-allowed' : 'pointer' }}
            onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !(selectedYear == null || selectedYear >= maxYear)) { e.preventDefault(); goNextYear(); } }}
          >
            ▶
          </button>
        </div>

        {/* Right: Total Shinies for selected year */}
        <div className="calendar-stats" style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 56, padding: '4px 8px', border: '1px solid rgba(255,215,0,0.35)', borderRadius: 999, background: 'rgba(255,215,0,0.08)' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffd700', lineHeight: 1 }}>{yearTotal}</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>Total</span>
          </span>
        </div>
      </div>
      
      {viewMode === 'calendar' ? (
        // Calendar View redesigned: Year header + 12 month cards with mini calendars
        <div>
          {isEmpty && (
            <div style={{ color: '#ccc', fontSize: '0.9rem', margin: '12px 0' }}>Start hunting to fill your calendar!</div>
          )}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 12,
          }}>
            {monthsByYear.map((m, idx) => {
              const first = new Date(m.year, m.month, 1);
              const daysInMonth = new Date(m.year, m.month + 1, 0).getDate();
              // Monday-first index (0..6): Mon=0 ... Sun=6
              const mondayFirstOffset = (first.getDay() + 6) % 7;
              const totalCells = mondayFirstOffset + daysInMonth;
              const rows = totalCells <= 35 ? 5 : 6;
              const cells = rows * 7;
              const dayIndex = monthDayIndex[idx];
              return (
                <div key={`m-${m.year}-${m.month}`} style={{
                  background: 'rgba(0,0,0,0.35)',
                  border: '1px solid rgba(255,215,0,0.15)',
                  borderRadius: 10,
                  padding: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: rows === 5 ? 220 : 260
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <button
                      onClick={() => setSelectedMonth(m.month)}
                      style={{ background: 'transparent', border: 'none', color: '#fff', fontWeight: 800, cursor: 'pointer', textAlign: 'left' }}
                    >
                      {m.monthName}
                    </button>
                    <span style={{ fontSize: '0.75rem', color: '#ffd700', background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.3)', padding: '2px 6px', borderRadius: 999 }}>
                      {m.shinies.length}
                    </span>
                  </div>

                  {/* Weekday header */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
                    {['M','T','W','T','F','S','S'].map((w) => (
                      <div key={w} style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>{w}</div>
                    ))}
                  </div>

                  {/* Day grid */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                      {Array.from({ length: cells }).map((_, i) => {
                        const dayNum = i - mondayFirstOffset + 1;
                        const inMonth = dayNum >= 1 && dayNum <= daysInMonth;
                        const count = inMonth ? (dayIndex?.counts?.[dayNum] || 0) : 0;
                        return (
                          <button
                            key={`d-${i}`}
                            data-day-cell
                            onKeyDown={(e) => {
                              if (!inMonth) return;
                              const step = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' ? -7 : e.key === 'ArrowDown' ? 7 : 0;
                              if (step !== 0) {
                                e.preventDefault();
                                const next = i + step;
                                const nextBtn = (e.currentTarget.parentElement?.children?.[next] as HTMLButtonElement | undefined);
                                nextBtn?.focus();
                              }
                              if (e.key === 'Enter' || e.key === ' ') {
                                if (count > 0) {
                                  const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                                  setOpenDay({ monthIndex: idx, day: dayNum, anchor: { x: rect.left + rect.width / 2, y: rect.top + rect.height, w: rect.width, h: rect.height } });
                                }
                              }
                            }}
                            onClick={(e) => {
                              if (count === 0 || !inMonth) return;
                              const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                              setOpenDay({ monthIndex: idx, day: dayNum, anchor: { x: rect.left + rect.width / 2, y: rect.top + rect.height, w: rect.width, h: rect.height } });
                            }}
                            style={{
                              aspectRatio: '1 / 1',
                              background: inMonth ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.04)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              borderRadius: 8,
                              padding: 6,
                              color: inMonth ? '#fff' : 'rgba(255,255,255,0.3)',
                              position: 'relative',
                              cursor: inMonth ? 'pointer' : 'default',
                              outline: 'none',
                            }}
                          >
                            <div style={{ fontSize: 11, opacity: inMonth ? 0.9 : 0.4 }}>{inMonth ? dayNum : ''}</div>
                            {count > 0 && (
                              <div style={{ position: 'absolute', right: 6, bottom: 6 }}>
                                {count === 1 ? (
                                  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 999, background: '#ffd700' }} />
                                ) : (
                                  <span style={{ fontSize: 10, fontWeight: 800, color: '#000', background: '#ffd700', borderRadius: 999, padding: '0 5px' }}>{count}</span>
                                )}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Day popover */}
                    {openDay && openDay.monthIndex === idx && (
                      <DayPopover
                        key={`pop-${idx}-${openDay.day}`}
                        anchor={openDay.anchor}
                        items={(monthDayIndex[idx]?.items?.[openDay.day] || [])}
                        onClose={() => setOpenDay(null)}
                        onEdit={onEdit}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
                  nature: (shiny as any).nature ?? (shiny as any)?.meta?.nature ?? null,
                  gender: (shiny as any)?.gender || (shiny as any)?.meta?.gender || null,
                  encounters: shiny.encounterCount ?? (shiny as any)?.total_encounters ?? null,
                  ivs: (shiny as any)?.ivs || (shiny as any)?.meta?.ivs || null,
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

function DayPopover({ anchor, items, onClose, onEdit }: { anchor: { x: number; y: number; w: number; h: number }; items: ShinyPortfolio[]; onClose: () => void; onEdit?: (row: ShinyPortfolio) => void; }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  useEffect(() => {
    const margin = 10;
    const width = 280;
    const height = Math.min(320, 80 + items.length * 64);
    let top = anchor.y + margin;
    let left = anchor.x - width / 2;
    if (left + width > window.innerWidth - 8) left = window.innerWidth - width - 8;
    if (left < 8) left = 8;
    if (top + height > window.innerHeight - 8) top = anchor.y - height - margin - anchor.h;
    if (top < 8) top = 8;
    setPos({ top, left });
  }, [anchor, items.length]);
  const colors = getPokemonColors(items[0]?.pokemonId || 1);
  if (!pos) return null;
  return (
    <div data-day-popover style={{ position: 'fixed', top: pos.top, left: pos.left, width: 280, maxHeight: 360, overflowY: 'auto', background: 'rgba(0,0,0,0.82)', border: `2px solid ${colors.glowLight}`, borderRadius: 10, padding: 10, zIndex: 50, boxShadow: `0 8px 25px ${colors.glow}`, animation: 'fadeInScale 120ms ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ color: '#ffd700', fontWeight: 800, fontSize: 14 }}>Shinies ({items.length})</div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((s) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6 }}>
            <img src={getShinySpritePath(s.pokemonId, s.pokemonName)} alt={s.pokemonName} style={{ width: 40, height: 40 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.pokemonName}</div>
              <div style={{ color: '#ffd700', fontSize: 11 }}>{s.method}</div>
            </div>
            {onEdit && (
              <button onClick={() => onEdit(s)} style={{ background: '#ffd700', color: '#000', border: 'none', padding: '6px 10px', borderRadius: 6, fontWeight: 800, cursor: 'pointer' }}>Edit</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}