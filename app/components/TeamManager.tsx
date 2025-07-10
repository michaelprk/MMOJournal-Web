import React, { useState, useEffect } from 'react';
import type { PokemonBuild } from '../types/pokemon';

interface Team {
  id: string;
  name: string;
  description?: string;
  pokemon: PokemonBuild[];
}

interface TeamManagerProps {
  builds: PokemonBuild[];
  onUpdateBuild: (buildId: string, teamId?: string, teamName?: string) => void;
}

export function TeamManager({ builds, onUpdateBuild }: TeamManagerProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [showNewTeamForm, setShowNewTeamForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>('');

  // Organize builds into teams
  useEffect(() => {
    const teamMap = new Map<string, Team>();
    const unassignedPokemon: PokemonBuild[] = [];

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
      } else {
        unassignedPokemon.push(build);
      }
    });

    const teamsArray = Array.from(teamMap.values());
    
    // Add unassigned team if there are unassigned Pokemon
    if (unassignedPokemon.length > 0) {
      teamsArray.unshift({
        id: 'unassigned',
        name: 'Unassigned Pokemon',
        pokemon: unassignedPokemon
      });
    }

    setTeams(teamsArray);
  }, [builds]);

  const createNewTeam = () => {
    if (!newTeamName.trim()) return;

    const teamId = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setNewTeamName('');
    setShowNewTeamForm(false);
    setSelectedTeam(teamId);
  };

  const assignPokemonToTeam = (build: PokemonBuild, teamId: string, teamName: string) => {
    onUpdateBuild(build.id, teamId === 'unassigned' ? undefined : teamId, teamId === 'unassigned' ? undefined : teamName);
  };

  const removeFromTeam = (build: PokemonBuild) => {
    onUpdateBuild(build.id, undefined, undefined);
  };

  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 203, 5, 0.3)',
      padding: '20px',
      marginBottom: '20px',
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px' 
      }}>
        <h3 style={{ 
          color: '#ffcb05', 
          margin: 0, 
          fontSize: '1.2rem', 
          fontWeight: 'bold' 
        }}>
          🏆 Team Management
        </h3>
        
        <button
          onClick={() => setShowNewTeamForm(!showNewTeamForm)}
          style={{
            backgroundColor: '#ffcb05',
            color: '#000',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e6b800';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffcb05';
          }}
        >
          + New Team
        </button>
      </div>

      {/* New Team Form */}
      {showNewTeamForm && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px',
          border: '1px solid rgba(255, 203, 5, 0.2)',
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Enter team name..."
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.5)',
                color: '#fff',
                fontSize: '0.9rem',
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  createNewTeam();
                }
              }}
            />
            <button
              onClick={createNewTeam}
              disabled={!newTeamName.trim()}
              style={{
                backgroundColor: newTeamName.trim() ? '#28a745' : 'rgba(128, 128, 128, 0.5)',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                cursor: newTeamName.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
              }}
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowNewTeamForm(false);
                setNewTeamName('');
              }}
              style={{
                backgroundColor: 'transparent',
                color: '#ccc',
                border: '1px solid #ccc',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Teams Display */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {teams.map(team => (
          <div key={team.id} style={{
            background: team.id === 'unassigned' 
              ? 'rgba(128, 128, 128, 0.1)' 
              : 'rgba(255, 203, 5, 0.05)',
            border: `1px solid ${team.id === 'unassigned' ? 'rgba(128, 128, 128, 0.3)' : 'rgba(255, 203, 5, 0.3)'}`,
            borderRadius: '8px',
            padding: '16px',
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '12px' 
            }}>
              <h4 style={{ 
                color: team.id === 'unassigned' ? '#ccc' : '#ffcb05', 
                margin: 0, 
                fontSize: '1rem', 
                fontWeight: 'bold' 
              }}>
                {team.name} ({team.pokemon.length}/6)
              </h4>
              
              {team.id !== 'unassigned' && team.pokemon.length > 0 && (
                <div style={{ fontSize: '0.8rem', color: '#ccc' }}>
                  Team ID: {team.id}
                </div>
              )}
            </div>

            {/* Pokemon in Team */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
              {team.pokemon.map(pokemon => (
                <div key={pokemon.id} style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  <div>
                    <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '500' }}>
                      {pokemon.name}
                    </div>
                    {pokemon.name !== pokemon.species && (
                      <div style={{ color: '#ccc', fontSize: '0.75rem' }}>
                        ({pokemon.species})
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {/* Team Assignment Dropdown */}
                                         <select
                       value={pokemon.team_id || 'unassigned'}
                       onChange={(e) => {
                         const newTeamId = e.target.value;
                         const teamName = newTeamId === 'unassigned' ? undefined : 
                           newTeamId === selectedTeam ? newTeamName : 
                           teams.find(t => t.id === newTeamId)?.name;
                         assignPokemonToTeam(pokemon, newTeamId, teamName || '');
                       }}
                      style={{
                        background: 'rgba(0, 0, 0, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: '#fff',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        maxWidth: '100px',
                      }}
                    >
                      <option value="unassigned">Unassigned</option>
                      {teams.filter(t => t.id !== 'unassigned').map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                      {selectedTeam && !teams.find(t => t.id === selectedTeam) && (
                        <option value={selectedTeam}>{newTeamName}</option>
                      )}
                    </select>
                    
                    {pokemon.team_id && (
                      <button
                        onClick={() => removeFromTeam(pokemon)}
                        style={{
                          background: 'transparent',
                          border: '1px solid #dc3545',
                          color: '#dc3545',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                        }}
                        title="Remove from team"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {team.pokemon.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '20px', 
                color: '#888', 
                fontSize: '0.9rem',
                fontStyle: 'italic'
              }}>
                {team.id === 'unassigned' ? 'All Pokemon are assigned to teams' : 'No Pokemon in this team yet'}
              </div>
            )}
          </div>
        ))}

        {teams.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#ccc', 
            fontSize: '1rem' 
          }}>
            No teams created yet. Create your first team to organize your Pokemon builds!
          </div>
        )}
      </div>
    </div>
  );
} 