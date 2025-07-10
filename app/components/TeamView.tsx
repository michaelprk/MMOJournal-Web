import React from 'react';
import type { PokemonBuild } from '../types/pokemon';
import { TIER_COLORS } from '../types/pokemon';
import { buildToShowdownFormat } from '../utils/showdown-parser';

interface Team {
  id: string;
  name: string;
  pokemon: PokemonBuild[];
}

interface TeamViewProps {
  teams: Team[];
  onEdit?: (build: PokemonBuild) => void;
  onDelete?: (id: string) => void;
}

function PokemonMiniCard({ build, onEdit, onDelete }: { build: PokemonBuild; onEdit?: (build: PokemonBuild) => void; onDelete?: (id: string) => void; }) {
  const tierColor = TIER_COLORS[build.tier];

  const formatPokemonName = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/nidoranf/g, 'nidoran-f')
      .replace(/nidoranm/g, 'nidoran-m')
      .replace(/farfetchd/g, 'farfetchd')
      .replace(/mrmime/g, 'mrmime');
  };

  const spriteUrl = `https://img.pokemondb.net/sprites/home/normal/${formatPokemonName(build.species)}.png`;
  const fallbackSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png`;

  const handleExportToShowdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const showdownFormat = buildToShowdownFormat(build);
    navigator.clipboard.writeText(showdownFormat).then(() => {
      console.log('Pokemon build copied to clipboard in Showdown format!');
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
      const textArea = document.createElement('textarea');
      textArea.value = showdownFormat;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
  };

  return (
    <div
      style={{
        background: `linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6))`,
        border: `2px solid ${tierColor.background}`,
        borderRadius: '8px',
        padding: '12px',
        transition: 'all 0.3s ease',
        position: 'relative',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 4px 15px rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.4)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Pokemon Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <img
          src={spriteUrl}
          alt={build.species}
          style={{
            width: '40px',
            height: '40px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))',
          }}
          onError={(e) => {
            e.currentTarget.src = fallbackSpriteUrl;
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h5 style={{ 
            color: '#fff', 
            margin: '0 0 2px 0', 
            fontSize: '0.9rem', 
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {build.name}
          </h5>
          {build.name !== build.species && (
            <div style={{ color: '#ddd', fontSize: '0.75rem' }}>
              ({build.species})
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <span
              style={{
                backgroundColor: tierColor.background,
                color: tierColor.text,
                padding: '1px 4px',
                borderRadius: '3px',
                fontSize: '0.65rem',
                fontWeight: 'bold',
              }}
            >
              {build.tier}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div style={{ fontSize: '0.75rem', color: '#ccc', marginBottom: '8px' }}>
        <div><strong>Nature:</strong> {build.nature}</div>
        <div><strong>Ability:</strong> {build.ability}</div>
        {build.item && <div><strong>Item:</strong> {build.item}</div>}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
        <button
          onClick={handleExportToShowdown}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #28a745',
            color: '#28a745',
            padding: '2px 6px',
            borderRadius: '3px',
            fontSize: '0.65rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontWeight: '600',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title="Export to Pokemon Showdown format"
        >
          📋
        </button>
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(build);
            }}
            style={{
              backgroundColor: 'transparent',
              border: `1px solid ${tierColor.background}`,
              color: tierColor.background,
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '0.65rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: '600',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.2)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ✏️
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(build.id);
            }}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #dc3545',
              color: '#dc3545',
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '0.65rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: '600',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}

function TeamCard({ team, onEdit, onDelete }: { team: Team; onEdit?: (build: PokemonBuild) => void; onDelete?: (id: string) => void; }) {
  const exportTeamToShowdown = () => {
    const teamExport = team.pokemon
      .map(pokemon => buildToShowdownFormat(pokemon))
      .join('\n\n');
    
    navigator.clipboard.writeText(teamExport).then(() => {
      console.log('Team exported to clipboard in Showdown format!');
    }).catch(err => {
      console.error('Failed to copy team to clipboard:', err);
      const textArea = document.createElement('textarea');
      textArea.value = teamExport;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
  };

  return (
    <div
      style={{
        background: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 203, 5, 0.3)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
      }}
    >
      {/* Team Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px' 
      }}>
        <div>
          <h3 style={{ 
            color: '#ffcb05', 
            margin: 0, 
            fontSize: '1.3rem', 
            fontWeight: 'bold' 
          }}>
            {team.name}
          </h3>
          <p style={{ 
            color: '#ccc', 
            margin: '4px 0 0 0', 
            fontSize: '0.9rem' 
          }}>
            {team.pokemon.length}/6 Pokemon
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={exportTeamToShowdown}
            disabled={team.pokemon.length === 0}
            style={{
              backgroundColor: team.pokemon.length > 0 ? '#28a745' : 'rgba(128, 128, 128, 0.5)',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: team.pokemon.length > 0 ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => {
              if (team.pokemon.length > 0) {
                e.currentTarget.style.backgroundColor = '#218838';
              }
            }}
            onMouseLeave={(e) => {
              if (team.pokemon.length > 0) {
                e.currentTarget.style.backgroundColor = '#28a745';
              }
            }}
            title="Export entire team to Pokemon Showdown format"
          >
            📋 Export Team
          </button>
        </div>
      </div>

      {/* Pokemon Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        minHeight: team.pokemon.length === 0 ? '100px' : 'auto',
      }}>
        {team.pokemon.map(pokemon => (
          <PokemonMiniCard
            key={pokemon.id}
            build={pokemon}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        
        {/* Empty slots for incomplete teams */}
        {Array.from({ length: Math.max(0, 6 - team.pokemon.length) }, (_, index) => (
          <div
            key={`empty-${index}`}
            style={{
              background: 'rgba(128, 128, 128, 0.1)',
              border: '2px dashed rgba(128, 128, 128, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              minHeight: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#888',
              fontSize: '0.8rem',
              fontStyle: 'italic',
            }}
          >
            Empty Slot
          </div>
        ))}
      </div>

      {team.pokemon.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#888', 
          fontSize: '1rem',
          fontStyle: 'italic'
        }}>
          No Pokemon in this team yet. Assign Pokemon using the Team Management section above.
        </div>
      )}
    </div>
  );
}

export function TeamView({ teams, onEdit, onDelete }: TeamViewProps) {
  const realTeams = teams.filter(team => team.id !== 'unassigned');

  return (
    <div>
      {realTeams.length === 0 ? (
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
            fontSize: '1.5rem', 
            margin: '0 0 16px 0' 
          }}>
            🏆 No Teams Created Yet
          </h3>
          <p style={{ fontSize: '1rem', marginBottom: '8px' }}>
            Create your first team using the Team Management section above to organize your Pokemon builds.
          </p>
          <p style={{ fontSize: '0.9rem' }}>
            Teams help you group Pokemon for specific strategies and can be exported together to Pokemon Showdown.
          </p>
        </div>
      ) : (
        realTeams.map(team => (
          <TeamCard
            key={team.id}
            team={team}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
} 