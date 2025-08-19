import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { shinyHuntService } from '../services/shinyHuntService';
import type { ShinyHuntRow } from '../services/shinyHuntService';
import { PokemonBuildService } from '../services/supabase';
import { getShinySpritePath } from '../types/pokemon';

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
        const [active, complete, pvp] = await Promise.all([
          shinyHuntService.listActive(),
          shinyHuntService.listCompleted(),
          PokemonBuildService.getBuilds().catch(() => []),
        ]);
        setHunts(active);
        setCompleted(complete as any);
        setBuilds(pvp as any);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, initializing, navigate]);

  const y = new Date().getFullYear();
  const [profileUsername, setProfileUsername] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!user?.id) return;
      setProfileLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('user_id', user.id)
          .maybeSingle();
        if (error) throw error;
        if (!ignore) setProfileUsername(data?.username ?? null);
      } catch {
        if (!ignore) setProfileUsername(null);
      } finally {
        if (!ignore) setProfileLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [user?.id]);
  const ytdCompleted = useMemo(() => completed.filter((r: any) => {
    const d = new Date(r.found_at || r.created_at);
    return d.getFullYear() === y && (r as any).is_phase !== true;
  }), [completed, y]);
  const totalShinies = useMemo(() => (completed as any[]).filter((r: any) => (r as any).is_phase !== true).length, [completed]);

  // The dashboard must fit in one screen: height = 100vh - navbar(200px) - footer(38px)
  const DASHBOARD_HEIGHT = 'calc(100vh - 200px - 38px)';

  return (
    <div style={{
      maxWidth: 1400,
      margin: '0 auto',
      padding: '0 16px',
      color: '#fff',
      height: DASHBOARD_HEIGHT,
      display: 'grid',
      gridTemplateRows: '56px 72px 1fr',
      gap: 10,
      overflow: 'hidden',
      paddingTop: 200,
    }}>
      {/* Row A — Header & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#ffd700' }}>
            {(() => {
              if (!user?.id) return 'Welcome back!';
              if (profileLoading) return 'Welcome back, …';
              const name = profileUsername || getUsernameFallback(user.id);
              return `Welcome back, ${name}!`;
            })()}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'nowrap' }}>
          <button onClick={() => navigate('/shiny-hunt?open=start')} style={btn()}>Start New Hunt</button>
          <button onClick={() => navigate('/shiny-hunt?open=phase')} style={btn()}>Add Phase</button>
          <button onClick={() => navigate('/pvp?open=new')} style={btn()}>New PvP Build</button>
          <button onClick={() => navigate('/pvp?open=import')} style={btn()}>Import Pokepaste</button>
        </div>
      </div>

      {/* Row B — Overview metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
        <OverviewCard label="Current Hunts" value={hunts.length} onClick={() => navigate('/shiny-hunt?view=current')} />
        <OverviewCard label={`Shinies (YTD)`} value={ytdCompleted.length} onClick={() => navigate(`/shiny-hunt?view=showcase&year=${y}`)} />
        <OverviewCard label="Total Shinies" value={totalShinies} onClick={() => navigate('/shiny-hunt?view=showcase')} />
        <OverviewCard label="PvP Builds" value={builds.length} onClick={() => navigate('/pvp')} />
      </div>

      {/* Row C — Three equal panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, overflow: 'hidden', alignItems: 'start' }}>
        {/* Panel 1: Continuing Hunts (max 4) */}
        <Panel title="Continuing Hunts" rightLinkLabel={hunts.length > 4 ? 'View all' : undefined} onRightLink={() => navigate('/shiny-hunt?view=current')}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {Array.from({ length: 4 }).map((_, i) => (<Skeleton key={i} height={100} />))}
            </div>
          ) : hunts.length === 0 ? (
            <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Empty text={'No active hunts'} />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {hunts.slice(0, 4).map((h) => (
                <button key={h.id} onClick={() => navigate('/shiny-hunt?view=current')} style={cardStyle()}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img
                      src={getShinySpritePath(h.pokemon_id as any, h.pokemon_name as any)}
                      alt={h.pokemon_name as any}
                      style={{ width: 64, height: 64 }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/shiny-sprites/001_Bulbasaur.gif'; }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 800, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{h.pokemon_name}</div>
                      <div style={{ color: '#bbb', fontSize: 12, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{(h as any).region}{(h as any).area ? ` — ${(h as any).area}` : ''}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Panel>

        {/* Panel 2: Recent Finds (max 6, 3x2) */}
        <Panel title="Recent Finds" rightLinkLabel={ytdCompleted.length > 6 ? 'View all' : undefined} onRightLink={() => navigate(`/shiny-hunt?view=showcase&year=${y}`)}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {Array.from({ length: 6 }).map((_, i) => (<Skeleton key={i} height={84} />))}
            </div>
          ) : ytdCompleted.length === 0 ? (
            <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Empty text={'No finds yet this year'} />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {completed.filter((r: any) => (r as any).is_phase !== true).slice(0, 6).map((r: any) => (
                <button key={r.id} onClick={() => navigate('/shiny-hunt?view=showcase')} style={cardStyle()}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img
                      src={getShinySpritePath(r.pokemon_id as any, r.pokemon_name as any)}
                      alt={r.pokemon_name as any}
                      style={{ width: 56, height: 56, outline: (r.is_alpha || r?.meta?.alpha) ? '2px solid #ffd700' : undefined, outlineOffset: (r.is_alpha || r?.meta?.alpha) ? -2 : undefined }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/shiny-sprites/001_Bulbasaur.gif'; }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 800, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{r.pokemon_name}</div>
                      <div style={{ color: '#bbb', fontSize: 12, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{new Date(r.found_at || r.created_at).toLocaleDateString()} — {r.method}</div>
                    </div>
                    {(r.is_secret_shiny || r?.meta?.secret_shiny) && <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 800, color: '#000', background: '#ffd700', borderRadius: 999, padding: '2px 6px' }}>SECRET</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </Panel>

        {/* Panel 3: PvP — Recent Builds (max 5) */}
        <Panel title="PvP — Recent Builds">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
            {loading && Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height={42} />
            ))}
            {!loading && builds.slice(0, 5).map((b) => (
              <button key={b.id} onClick={() => navigate(`/pvp`)} style={cardStyle()}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                  {/* Mini sprites row - fallback to tier chip if no team exposed */}
                  {Array.isArray(b.team_sprites) && b.team_sprites.length > 0 ? (
                    <div style={{ display: 'flex', gap: 4 }}>
                      {b.team_sprites.slice(0, 6).map((sid: number, idx: number) => (
                        <img key={idx} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${sid}.png`} alt="" width={24} height={24} style={{ imageRendering: 'pixelated' }} />
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: 10, color: '#bbb', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '2px 6px' }}>{b.tier || '—'}</span>
                  )}
                  <div style={{ fontWeight: 800, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{b.name}</div>
                  <div style={{ color: '#bbb', fontSize: 12, marginLeft: 'auto' }}>{new Date(b.updated_at).toLocaleDateString()}</div>
                </div>
              </button>
            ))}
            {!loading && builds.length === 0 && <Empty text={'No recent builds'} />}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function getUsernameFallback(userId: string): string {
  try {
    const cached = window.localStorage.getItem(`profile:username:${userId}`);
    if (cached) return cached;
  } catch {}
  // Fallback placeholder until profile hydrated elsewhere
  return `Trainer`;
}

function OverviewCard({ label, value, onClick }: { label: string; value: number; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{ textAlign: 'left', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,215,0,0.12)', borderRadius: 10, padding: 10, cursor: 'pointer' }}>
      <div style={{ fontSize: 20, fontWeight: 900, color: '#ffd700' }}>{value}</div>
      <div style={{ fontSize: 11, color: '#ccc' }}>{label}</div>
    </button>
  );
}

function btn() {
  return { background: '#ffd700', color: '#000', border: 'none', padding: '6px 10px', borderRadius: 6, fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' } as React.CSSProperties;
}

function Panel({ title, rightLinkLabel, onRightLink, children }: { title: string; rightLinkLabel?: string; onRightLink?: () => void; children: React.ReactNode }) {
  return (
    <section style={{ background: 'rgba(0,0,0,0.20)', border: '1px solid rgba(255,215,0,0.12)', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontWeight: 800, color: '#ffd700' }}>{title}</div>
        {rightLinkLabel && (
          <button onClick={onRightLink} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#ffd700', fontSize: 12, cursor: 'pointer' }}> {rightLinkLabel} </button>
        )}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </section>
  );
}

function cardStyle() {
  return { background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,215,0,0.12)', borderRadius: 10, padding: 8, textAlign: 'left', cursor: 'pointer', width: '100%' } as React.CSSProperties;
}

function Skeleton({ height }: { height: number }) {
  return <div style={{ height, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,215,0,0.08)', borderRadius: 10 }} />;
}

function Empty({ text }: { text: string }) {
  return <div style={{ color: '#888', fontStyle: 'italic', padding: 8, textAlign: 'center' }}>{text}</div>;
}
