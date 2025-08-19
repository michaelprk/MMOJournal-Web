import { useState, useEffect, useMemo } from 'react';
import type { PokemonBuild } from '../../types/pokemon';
import { PokemonBuildService } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { TeamView } from '../../components/TeamView';

interface Team {
  id: string;
  name: string;
  pokemon: PokemonBuild[];
}

export default function TeamsPage() {
  const { user, initializing } = useAuth();
  const [builds, setBuilds] = useState<PokemonBuild[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);

  // Load Pokemon builds
  useEffect(() => {
    if (initializing) return;
    if (!user) {
      window.location.href = '/login';
      return;
    }
    loadBuilds();
  }, [user, initializing]);

  const loadBuilds = async () => {
    try {
      setIsLoading(true);
      const data = await PokemonBuildService.getBuilds();
      setBuilds(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load Pokemon builds:', err);
      setError('Failed to load Pokemon builds. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBuild = async (build: PokemonBuild) => {
    // For now, redirect to the main PVP page for editing
    window.location.href = '/pvp';
  };

  const handleDeleteBuild = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this Pokemon build?')) {
      try {
        await PokemonBuildService.deleteBuild(id);
        await loadBuilds();
      } catch (err) {
        console.error('Failed to delete Pokemon build:', err);
        alert('Failed to delete Pokemon build. Please try again.');
      }
    }
  };

  // Organize builds into teams
  const organizeIntoTeams = (): Team[] => {
    const teamMap = new Map<string, Team>();
    
    builds.forEach(build => {
      if (build.team_id && build.team_name) {
        if (!teamMap.has(build.team_id)) {
          teamMap.set(build.team_id, {
            id: build.team_id,
            name: build.team_name,
            pokemon: []
          });
        }
        teamMap.get(build.team_id)!.pokemon.push(build);
      }
    });

    return Array.from(teamMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  };

  const teams = organizeIntoTeams();

  const teamIds = useMemo(() => new Set(teams.map(t => t.id)), [teams]);

  // Sync with URL param (?edit=<teamId>) after data loads
  useEffect(() => {
    if (isLoading) return;
    try {
      const url = new URL(window.location.href);
      const editParam = url.searchParams.get('edit');
      if (editParam) {
        if (teamIds.has(editParam)) {
          setEditingTeamId(editParam);
        } else {
          // Invalid team id, clear param/state
          url.searchParams.delete('edit');
          window.history.replaceState(null, '', url.toString());
          setEditingTeamId(null);
        }
      } else {
        setEditingTeamId(null);
      }
    } catch {}
  }, [isLoading, teamIds]);

  const openEditTeamName = (teamId: string) => {
    setEditingTeamId(teamId);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('edit', teamId);
      window.history.replaceState(null, '', url.toString());
    } catch {}
  };

  const closeEditTeamName = () => {
    setEditingTeamId(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('edit');
      window.history.replaceState(null, '', url.toString());
    } catch {}
  };

  const handleEditTeamName = async (teamId: string, newName: string) => {
    try {
      const pokemonInTeam = builds.filter(build => build.team_id === teamId);
      for (const pokemon of pokemonInTeam) {
        await PokemonBuildService.updateBuild(pokemon.id, {
          team_name: newName
        });
      }
      setBuilds(prev => prev.map(b => (b.team_id === teamId ? { ...b, team_name: newName } : b)));
    } catch (err) {
      console.error('Failed to update team name:', err);
    } finally {
      closeEditTeamName();
    }
  };

  return (
    <>
      {/* Header Section */}
      <div
        style={{
          position: 'fixed',
          top: '280px', // Below navbar with extra spacing
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30,
          padding: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '1400px',
          width: 'calc(100% - 64px)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            color: '#ffcb05',
            fontSize: '2.2rem',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            letterSpacing: '0.5px',
          }}>
            🏆 Team Showcase 🏆
          </h1>
          <p style={{
            color: '#ccc',
            fontSize: '1rem',
            margin: 0,
            opacity: 0.9,
          }}>
            View and manage your competitive Pokemon teams
          </p>
        </div>
      </div>

      {/* Navigation Link */}
      <div
        style={{
          position: 'fixed',
          top: '280px',
          right: '50%',
          transform: 'translateX(calc(700px - 48px))', // Position relative to centered container
          zIndex: 31,
        }}
      >
        <a
          href="/pvp"
          style={{
            backgroundColor: 'rgba(255, 203, 5, 0.2)',
            color: '#ffcb05',
            border: '1px solid #ffcb05',
            padding: '10px 16px',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ffcb05';
            e.currentTarget.style.color = '#000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 203, 5, 0.2)';
            e.currentTarget.style.color = '#ffcb05';
          }}
        >
          ← Back to PVP
        </a>
      </div>

      {/* Main Content Container */}
      <div
        style={{
          position: 'fixed',
          top: '380px', // Below header with adjusted spacing
          left: 0,
          right: 0,
          height: 'calc(100vh - 380px)',
          backgroundColor: 'transparent',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto',
          padding: '1.5rem',
          minHeight: '100%',
          width: '100%',
        }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div
                style={{
                  color: '#ffcb05',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                }}
              >
                Loading teams...
              </div>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div
                style={{
                  color: '#ff6b6b',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                }}
              >
                {error}
              </div>
              <button
                onClick={loadBuilds}
                style={{
                  backgroundColor: '#ffcb05',
                  color: '#000',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Try Again
              </button>
            </div>
          ) : teams.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px', 
              color: '#ccc',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 203, 5, 0.3)',
            }}>
              <h3 style={{ 
                color: '#ffcb05', 
                fontSize: '1.8rem', 
                margin: '0 0 20px 0' 
              }}>
                🏆 No Teams Created Yet
              </h3>
              <p style={{ fontSize: '1.1rem', marginBottom: '12px' }}>
                You haven't created any teams yet. Teams help you organize your Pokemon builds for specific strategies.
              </p>
              <p style={{ fontSize: '1rem', marginBottom: '24px', opacity: 0.8 }}>
                To create teams, visit the main PVP page and use the team management tools.
              </p>
              <a
                href="/pvp"
                style={{
                  backgroundColor: '#ffcb05',
                  color: '#000',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e6b800';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffcb05';
                }}
              >
                Go to PVP Page
              </a>
            </div>
          ) : (
            <>
              {/* Teams Stats */}
              <div style={{ 
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'center',
                gap: '24px',
                flexWrap: 'wrap',
              }}>
                <div style={{
                  background: 'rgba(255, 203, 5, 0.1)',
                  border: '1px solid rgba(255, 203, 5, 0.3)',
                  borderRadius: '8px',
                  padding: '16px 24px',
                  textAlign: 'center',
                }}>
                  <div style={{ color: '#ffcb05', fontSize: '1.8rem', fontWeight: 'bold' }}>
                    {teams.length}
                  </div>
                  <div style={{ color: '#ccc', fontSize: '0.9rem' }}>
                    Total Teams
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 203, 5, 0.1)',
                  border: '1px solid rgba(255, 203, 5, 0.3)',
                  borderRadius: '8px',
                  padding: '16px 24px',
                  textAlign: 'center',
                }}>
                  <div style={{ color: '#ffcb05', fontSize: '1.8rem', fontWeight: 'bold' }}>
                    {teams.reduce((acc, team) => acc + team.pokemon.length, 0)}
                  </div>
                  <div style={{ color: '#ccc', fontSize: '0.9rem' }}>
                    Team Members
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 203, 5, 0.1)',
                  border: '1px solid rgba(255, 203, 5, 0.3)',
                  borderRadius: '8px',
                  padding: '16px 24px',
                  textAlign: 'center',
                }}>
                  <div style={{ color: '#ffcb05', fontSize: '1.8rem', fontWeight: 'bold' }}>
                    {teams.filter(team => team.pokemon.length === 6).length}
                  </div>
                  <div style={{ color: '#ccc', fontSize: '0.9rem' }}>
                    Complete Teams
                  </div>
                </div>
              </div>

              {/* Teams Display */}
              <TeamView
                teams={teams}
                onEdit={handleEditBuild}
                onDelete={handleDeleteBuild}
                onEditTeamName={handleEditTeamName}
                editingTeamId={editingTeamId}
                onRequestEditTeamName={openEditTeamName}
                onCancelEditTeamName={closeEditTeamName}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
} 