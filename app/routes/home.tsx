import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { shinyHuntService } from '../services/shinyHuntService';
import type { ShinyHuntRow } from '../services/shinyHuntService';

export default function Home() {
  const navigate = useNavigate();
  const { user, initializing } = useAuth();

  const [loading, setLoading] = useState(true);
  const [hunts, setHunts] = useState<ShinyHuntRow[]>([]);
  const [completed, setCompleted] = useState<ShinyHuntRow[]>([]);
  const [builds, setBuilds] = useState<any[]>([]);

  useEffect(() => {
    if (initializing) return;
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    (async () => {
      try {
        const [active, complete] = await Promise.all([
          shinyHuntService.listActive(),
          shinyHuntService.listCompleted(),
        ]);
        setHunts(active);
        setCompleted(complete as any);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, initializing, navigate]);

  const y = new Date().getFullYear();
  const ytdCompleted = useMemo(() => completed.filter((r: any) => {
    const d = new Date(r.found_at || r.created_at);
    return d.getFullYear() === y;
  }), [completed, y]);
  const ytdSecret = useMemo(() => ytdCompleted.filter((r: any) => (r as any).is_secret_shiny || (r as any)?.meta?.secret_shiny).length, [ytdCompleted]);
  const ytdAlpha = useMemo(() => ytdCompleted.filter((r: any) => (r as any).is_alpha || (r as any)?.meta?.alpha).length, [ytdCompleted]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16, color: '#fff' }}>
      {/* Header strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,215,0,0.12)', borderRadius: 10, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#ffd700' }}>Home</div>
          <div style={{ fontSize: 12, color: '#ccc' }}>Welcome{user?.email ? `, ${user.email}` : ''}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/shiny-hunt?open=start')} style={btn()}>Start New Hunt</button>
          <button onClick={() => navigate('/shiny-hunt?open=phase')} style={btn()}>Add Phase</button>
          <button onClick={() => navigate('/pvp?open=new')} style={btn()}>New PvP Build</button>
          <button onClick={() => navigate('/pvp?open=import')} style={btn()}>Import Pokepaste</button>
        </div>
      </div>

      {/* Overview cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8, marginBottom: 12 }}>
        {card('Current Hunts', hunts.length, () => navigate('/shiny-hunt'))}
        {card(`Shinies ${y}`, ytdCompleted.length, () => navigate(`/shiny-hunt`))}
        {card('Secret (YTD)', ytdSecret, () => navigate('/shiny-hunt'))}
        {card('Alpha (YTD)', ytdAlpha, () => navigate('/shiny-hunt'))}
        {card('PvP Builds', builds.length, () => navigate('/pvp'))}
      </div>

      {/* Two-column body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <Section title="Continuing Hunts">
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {hunts.slice(0, 12).map((h) => (
                <div key={h.id} style={{ minWidth: 140, background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,215,0,0.12)', borderRadius: 10, padding: 8 }}>
                  <div style={{ fontWeight: 800 }}>{h.pokemon_name}</div>
                  <div style={{ color: '#bbb', fontSize: 12 }}>{(h as any).region}{(h as any).area ? ` — ${(h as any).area}` : ''}</div>
                </div>
              ))}
              {hunts.length === 0 && <Empty text={loading ? 'Loading…' : 'No active hunts'} />}
            </div>
          </Section>

          <Section title="Recent Finds">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ytdCompleted.slice(0, 5).map((r: any) => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,215,0,0.12)', borderRadius: 10, padding: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 6, outline: (r.is_alpha || r?.meta?.alpha) ? '2px solid #ffd700' : undefined, outlineOffset: (r.is_alpha || r?.meta?.alpha) ? -2 : undefined, background: 'rgba(255,255,255,0.06)' }} />
                  <div style={{ fontWeight: 800 }}>{r.pokemon_name}</div>
                  <div style={{ color: '#bbb', fontSize: 12 }}>{new Date(r.found_at || r.created_at).toLocaleDateString()} — {r.method}</div>
                  {(r.is_secret_shiny || r?.meta?.secret_shiny) && <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 800, color: '#000', background: '#ffd700', borderRadius: 999, padding: '2px 6px' }}>SECRET</span>}
                </div>
              ))}
              {ytdCompleted.length === 0 && <Empty text={loading ? 'Loading…' : 'No finds yet this year'} />}
            </div>
          </Section>

          <Section title="This Month">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {renderMiniMonth(ytdCompleted)}
            </div>
          </Section>
        </div>

        <div>
          <Section title="Recent Builds">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {builds.slice(0, 5).map((b) => (
                <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,215,0,0.12)', borderRadius: 10, padding: 8 }}>
                  <div style={{ fontWeight: 800 }}>{b.name}</div>
                  <div style={{ color: '#bbb', fontSize: 12, marginLeft: 'auto' }}>{new Date(b.updated_at).toLocaleString()}</div>
                </div>
              ))}
              {builds.length === 0 && <Empty text={loading ? 'Loading…' : 'No recent builds'} />}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function btn() {
  return { background: '#ffd700', color: '#000', border: 'none', padding: '6px 10px', borderRadius: 6, fontWeight: 800, cursor: 'pointer' } as React.CSSProperties;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,215,0,0.12)', borderRadius: 10, padding: 10, marginBottom: 12 }}>
      <div style={{ fontWeight: 800, color: '#ffd700', marginBottom: 8 }}>{title}</div>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <div style={{ color: '#888', fontStyle: 'italic', padding: 8 }}>{text}</div>;
}

function renderMiniMonth(items: any[]) {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const mondayFirstOffset = (first.getDay() + 6) % 7;
  const totalCells = mondayFirstOffset + daysInMonth;
  const rows = totalCells <= 35 ? 5 : 6;
  const cells = rows * 7;
  const counts: Record<number, number> = {};
  items.forEach((r) => {
    const d = new Date(r.found_at || r.created_at);
    if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
      const day = d.getDate();
      counts[day] = (counts[day] || 0) + 1;
    }
  });
  return Array.from({ length: cells }).map((_, i) => {
    const dayNum = i - mondayFirstOffset + 1;
    const inMonth = dayNum >= 1 && dayNum <= daysInMonth;
    const count = inMonth ? counts[dayNum] || 0 : 0;
    return (
      <div key={i} style={{ aspectRatio: '1/1', background: inMonth ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, position: 'relative' }}>
        <div style={{ fontSize: 10, padding: 4, opacity: inMonth ? 0.9 : 0.4 }}>{inMonth ? dayNum : ''}</div>
        {count > 0 && <span style={{ position: 'absolute', right: 6, bottom: 6, width: 6, height: 6, borderRadius: 999, background: '#ffd700' }} />}
      </div>
    );
  });
}
