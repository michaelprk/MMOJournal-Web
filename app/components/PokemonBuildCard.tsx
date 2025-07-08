import React, { useState, useEffect } from 'react';
import type { PokemonBuild } from '../types/pokemon';
import { getItemSpriteUrl, getFallbackItemSpriteUrl } from '../utils/item-sprites';

interface PokemonBuildCardProps {
  build: PokemonBuild;
  onEdit?: (build: PokemonBuild) => void;
  onDelete?: (id: string) => void;
}

// Move type colors for moves
const MOVE_TYPE_COLORS: Record<string, { background: string; text: string }> = {
  normal: { background: 'linear-gradient(135deg, #A8A878, #C6C6A7)', text: '#000' },
  fire: { background: 'linear-gradient(135deg, #F08030, #F5AC78)', text: '#000' },
  water: { background: 'linear-gradient(135deg, #6890F0, #9DB7F5)', text: '#000' },
  electric: { background: 'linear-gradient(135deg, #F8D030, #F5E078)', text: '#000' },
  grass: { background: 'linear-gradient(135deg, #78C850, #A7DB8D)', text: '#000' },
  ice: { background: 'linear-gradient(135deg, #98D8D8, #BCE6E6)', text: '#000' },
  fighting: { background: 'linear-gradient(135deg, #C03028, #D67873)', text: '#fff' },
  poison: { background: 'linear-gradient(135deg, #A040A0, #C183C1)', text: '#fff' },
  ground: { background: 'linear-gradient(135deg, #E0C068, #EBD69D)', text: '#000' },
  flying: { background: 'linear-gradient(135deg, #A890F0, #C6B7F5)', text: '#000' },
  psychic: { background: 'linear-gradient(135deg, #F85888, #FA92B2)', text: '#000' },
  bug: { background: 'linear-gradient(135deg, #A8B820, #C6D16E)', text: '#000' },
  rock: { background: 'linear-gradient(135deg, #B8A038, #D1C17D)', text: '#000' },
  ghost: { background: 'linear-gradient(135deg, #705898, #A292BC)', text: '#fff' },
  dragon: { background: 'linear-gradient(135deg, #7038F8, #A27DFA)', text: '#fff' },
  dark: { background: 'linear-gradient(135deg, #705848, #A29288)', text: '#fff' },
  steel: { background: 'linear-gradient(135deg, #B8B8D0, #D1D1E0)', text: '#000' },
  fairy: { background: 'linear-gradient(135deg, #EE99AC, #F4BDC9)', text: '#000' },
};

export function PokemonBuildCard({ build, onEdit, onDelete }: PokemonBuildCardProps) {
  const [imageError, setImageError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [moveTypes, setMoveTypes] = useState<Record<string, string>>({});
  const [itemImageError, setItemImageError] = useState(false);

  // Format Pokemon name for URLs (lowercase, no special characters, handle special cases)
  const formatPokemonName = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/nidoranf/g, 'nidoran-f')
      .replace(/nidoranm/g, 'nidoran-m')
      .replace(/farfetchd/g, 'farfetchd')
      .replace(/mrmime/g, 'mrmime');
  };

  // Use static sprites with fallback
  const spriteUrl = `https://img.pokemondb.net/sprites/home/normal/${formatPokemonName(build.species)}.png`;
  const fallbackSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png`;

  // Fetch move types
  useEffect(() => {
    const fetchMoveTypes = async () => {
      const types: Record<string, string> = {};
      for (const move of build.moves) {
        if (move && !types[move]) {
          try {
            const response = await fetch(`https://pokeapi.co/api/v2/move/${move.toLowerCase().replace(/\s+/g, '-')}`);
            if (response.ok) {
              const data = await response.json();
              types[move] = data.type.name;
            }
          } catch (error) {
            console.error(`Error fetching type for move ${move}:`, error);
            types[move] = 'normal';
          }
        }
      }
      setMoveTypes(types);
    };

    fetchMoveTypes();
  }, [build.moves]);

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '12px',
        padding: '16px',
        border: '2px solid rgba(255, 203, 5, 0.3)',
        transition: 'all 0.3s ease',
        minHeight: '200px',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Front View */}
      <div
        style={{
          opacity: showDetails ? 0 : 1,
          visibility: showDetails ? 'hidden' : 'visible',
          transition: 'all 0.3s ease',
          height: '100%',
        }}
      >
        {/* Edit/Delete Buttons - Only on front view */}
        <div style={{ 
          position: 'absolute', 
          top: '12px', 
          right: '12px', 
          display: 'flex', 
          gap: '6px',
          zIndex: 10,
        }}>
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(build);
              }}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #ffcb05',
                color: '#ffcb05',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '600',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 203, 5, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Edit
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
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
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
              Del
            </button>
          )}
        </div>

        {/* Header with Sprite and Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ flexShrink: 0 }}>
            <img
              src={imageError ? fallbackSpriteUrl : spriteUrl}
              alt={build.species}
              style={{
                width: '64px',
                height: '64px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
              }}
              onError={() => setImageError(true)}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                color: '#ffcb05',
                margin: '0 0 4px 0',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {build.name}
            </h3>
            {build.name !== build.species && (
              <p style={{ color: '#aaa', margin: '0 0 8px 0', fontSize: '0.9rem' }}>
                ({build.species})
              </p>
            )}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span
                style={{
                  backgroundColor: '#ffcb05',
                  color: '#000',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}
              >
                {build.tier}
              </span>
              <span style={{ color: '#ccc', fontSize: '0.85rem' }}>
                Level {build.level}
              </span>
            </div>
          </div>
        </div>

        {/* Basic Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          <div>
            <span style={{ color: '#aaa', fontSize: '0.85rem' }}>Nature:</span>
            <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '500' }}>{build.nature}</div>
          </div>
          <div>
            <span style={{ color: '#aaa', fontSize: '0.85rem' }}>Ability:</span>
            <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {build.ability}
            </div>
          </div>
        </div>

        {build.item && (
          <div style={{ marginBottom: '12px' }}>
            <span style={{ color: '#aaa', fontSize: '0.85rem' }}>Item:</span>
            <div style={{ 
              color: '#fff', 
              fontSize: '0.9rem', 
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <img
                src={itemImageError ? getFallbackItemSpriteUrl(build.item) : getItemSpriteUrl(build.item)}
                alt={build.item}
                className="item-icon"
                style={{
                  width: '20px',
                  height: '20px',
                  objectFit: 'contain',
                }}
                onError={() => setItemImageError(true)}
              />
              <span>{build.item}</span>
            </div>
          </div>
        )}

        {build.description && (
          <div>
            <span style={{ color: '#aaa', fontSize: '0.85rem' }}>Description:</span>
            <div style={{
              color: '#ddd',
              fontSize: '0.8rem',
              lineHeight: 1.3,
              marginTop: '4px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical' as any,
            }}>
              {build.description}
            </div>
          </div>
        )}

        {/* Toggle Button - Bottom of card */}
        <div style={{ 
          position: 'absolute',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ color: '#888', fontSize: '0.7rem', fontStyle: 'italic' }}>
            View Details
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(!showDetails);
            }}
            style={{
              backgroundColor: 'rgba(255, 203, 5, 0.2)',
              border: '1px solid #ffcb05',
              color: '#ffcb05',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.7rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: '600',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 203, 5, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 203, 5, 0.2)';
            }}
          >
            Show Stats
          </button>
        </div>
      </div>

      {/* Detailed Stats View - Back of card */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          borderRadius: '12px',
          padding: '16px',
          opacity: showDetails ? 1 : 0,
          visibility: showDetails ? 'visible' : 'hidden',
          transition: 'all 0.3s ease',
          border: '2px solid rgba(255, 203, 5, 0.6)',
          boxShadow: '0 8px 25px rgba(255, 203, 5, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Compact Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '16px', 
          borderBottom: '1px solid rgba(255, 203, 5, 0.3)',
          paddingBottom: '8px'
        }}>
          <div>
            <h3 style={{ color: '#ffcb05', margin: '0', fontSize: '1.1rem', fontWeight: 'bold' }}>
              {build.name}
            </h3>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
              <span style={{
                backgroundColor: '#ffcb05',
                color: '#000',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
              }}>
                {build.tier}
              </span>
              <span style={{ color: '#ccc', fontSize: '0.8rem' }}>
                Level {build.level}
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(false);
            }}
            style={{
              backgroundColor: 'rgba(255, 203, 5, 0.2)',
              border: '1px solid #ffcb05',
              color: '#ffcb05',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.7rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: '600',
            }}
          >
            ← Back
          </button>
        </div>

        {/* Two Column Layout for Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
          {/* Left Column - IVs */}
          <div>
            <h4 style={{ color: '#ffcb05', margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: 'bold' }}>Individual Values</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', fontSize: '0.75rem' }}>
              {[
                { label: 'HP', value: build.ivs.hp },
                { label: 'ATK', value: build.ivs.attack },
                { label: 'DEF', value: build.ivs.defense },
                { label: 'SPA', value: build.ivs.sp_attack },
                { label: 'SPD', value: build.ivs.sp_defense },
                { label: 'SPE', value: build.ivs.speed },
              ].map((stat, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '3px 6px', 
                  backgroundColor: 'rgba(255, 203, 5, 0.1)', 
                  borderRadius: '3px',
                  border: '1px solid rgba(255, 203, 5, 0.2)'
                }}>
                  <span style={{ color: '#aaa' }}>{stat.label}:</span>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - EVs */}
          <div>
            <h4 style={{ color: '#ffcb05', margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: 'bold' }}>Effort Values</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', fontSize: '0.75rem' }}>
              {[
                { label: 'HP', value: build.evs.hp },
                { label: 'ATK', value: build.evs.attack },
                { label: 'DEF', value: build.evs.defense },
                { label: 'SPA', value: build.evs.sp_attack },
                { label: 'SPD', value: build.evs.sp_defense },
                { label: 'SPE', value: build.evs.speed },
              ].map((stat, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '3px 6px', 
                  backgroundColor: 'rgba(255, 203, 5, 0.1)', 
                  borderRadius: '3px',
                  border: '1px solid rgba(255, 203, 5, 0.2)'
                }}>
                  <span style={{ color: '#aaa' }}>{stat.label}:</span>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{stat.value}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '6px', fontSize: '0.65rem', color: '#888', textAlign: 'right' }}>
              Total: {Object.values(build.evs).reduce((sum, val) => sum + val, 0)}/510
            </div>
          </div>
        </div>

        {/* Moves Section */}
        <div style={{ marginBottom: '12px' }}>
          <h4 style={{ color: '#ffcb05', margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: 'bold' }}>Moveset</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
            {build.moves.slice(0, 4).map((move, index) => {
              const moveType = moveTypes[move] || 'normal';
              const typeColor = MOVE_TYPE_COLORS[moveType] || MOVE_TYPE_COLORS.normal;
              
              return (
                <div
                  key={index}
                  style={{
                    background: typeColor.background,
                    color: typeColor.text,
                    fontSize: '0.7rem',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontWeight: '600',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                  title={move}
                >
                  {move}
                </div>
              );
            })}
          </div>
        </div>

        {/* Build Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <div style={{ padding: '6px 8px', backgroundColor: 'rgba(255, 203, 5, 0.1)', borderRadius: '6px', border: '1px solid rgba(255, 203, 5, 0.2)' }}>
            <span style={{ color: '#aaa', fontSize: '0.7rem' }}>Nature:</span>
            <div style={{ color: '#fff', fontWeight: '600', fontSize: '0.75rem' }}>{build.nature}</div>
          </div>
          <div style={{ padding: '6px 8px', backgroundColor: 'rgba(255, 203, 5, 0.1)', borderRadius: '6px', border: '1px solid rgba(255, 203, 5, 0.2)' }}>
            <span style={{ color: '#aaa', fontSize: '0.7rem' }}>Ability:</span>
            <div style={{ color: '#fff', fontWeight: '600', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {build.ability}
            </div>
          </div>
          {build.item && (
            <div style={{ padding: '6px 8px', backgroundColor: 'rgba(255, 203, 5, 0.1)', borderRadius: '6px', border: '1px solid rgba(255, 203, 5, 0.2)' }}>
              <span style={{ color: '#aaa', fontSize: '0.7rem' }}>Item:</span>
              <div style={{ 
                color: '#fff', 
                fontWeight: '600', 
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <img
                  src={itemImageError ? getFallbackItemSpriteUrl(build.item) : getItemSpriteUrl(build.item)}
                  alt={build.item}
                  className="item-icon"
                  style={{
                    width: '14px',
                    height: '14px',
                    objectFit: 'contain',
                    flexShrink: 0,
                  }}
                  onError={() => setItemImageError(true)}
                />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{build.item}</span>
              </div>
            </div>
          )}
        </div>

        {build.description && (
          <div style={{ marginTop: '8px', padding: '8px', backgroundColor: 'rgba(255, 203, 5, 0.1)', borderRadius: '6px', border: '1px solid rgba(255, 203, 5, 0.2)' }}>
            <span style={{ color: '#aaa', fontSize: '0.7rem' }}>Description:</span>
            <div style={{ color: '#ddd', fontSize: '0.7rem', lineHeight: 1.3, marginTop: '4px' }}>
              {build.description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 