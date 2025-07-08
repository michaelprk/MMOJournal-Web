import React, { useState, useEffect } from 'react';
import type { PokemonBuild } from '../types/pokemon';
import { getItemSpriteUrls } from '../utils/item-sprites';
import { TIER_COLORS } from '../types/pokemon';

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

// Gender Icon Component
function GenderIcon({ gender }: { gender?: 'M' | 'F' | 'U' }) {
  if (!gender) return null;
  
  const getGenderDisplay = () => {
    switch (gender) {
      case 'M':
        return { icon: '♂', color: '#6890F0', title: 'Male' };
      case 'F':
        return { icon: '♀', color: '#F85888', title: 'Female' };
      case 'U':
        return { icon: '◯', color: '#A8A8A8', title: 'Genderless' };
      default:
        return null;
    }
  };
  
  const genderDisplay = getGenderDisplay();
  if (!genderDisplay) return null;
  
  return (
    <span
      title={genderDisplay.title}
      style={{
        color: genderDisplay.color,
        fontSize: '1.1rem',
        fontWeight: 'bold',
        marginLeft: '6px',
        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
      }}
    >
      {genderDisplay.icon}
    </span>
  );
}

// Item Image Component with comprehensive fallback
function ItemImage({ itemName, className, style }: { itemName: string; className?: string; style?: React.CSSProperties }) {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const itemUrls = getItemSpriteUrls(itemName);

  const handleImageError = () => {
    if (currentUrlIndex < itemUrls.length - 1) {
      setCurrentUrlIndex(currentUrlIndex + 1);
    }
  };

  // Reset to first URL when item changes
  useEffect(() => {
    setCurrentUrlIndex(0);
  }, [itemName]);

  if (!itemName || itemUrls.length === 0) {
    return null;
  }

  return (
    <img
      src={itemUrls[currentUrlIndex]}
      alt={itemName}
      className={className}
      style={style}
      onError={handleImageError}
    />
  );
}

export function PokemonBuildCard({ build, onEdit, onDelete }: PokemonBuildCardProps) {
  const [imageError, setImageError] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'stats' | 'moves'>('main');
  const [moveTypes, setMoveTypes] = useState<Record<string, string>>({});

  const tierColor = TIER_COLORS[build.tier];

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

  // This useEffect is no longer needed as ItemImage component handles resets

  const getNextView = () => {
    if (currentView === 'main') return 'stats';
    if (currentView === 'stats') return 'moves';
    return 'main';
  };

  const getPreviousView = () => {
    if (currentView === 'main') return 'moves';
    if (currentView === 'stats') return 'main';
    return 'stats';
  };

  const getViewDisplayName = (view: 'main' | 'stats' | 'moves') => {
    if (view === 'main') return 'Overview';
    if (view === 'stats') return 'Stats';
    return 'Moves';
  };

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: '12px',
        padding: '16px',
        border: `3px solid ${tierColor.background}`,
        transition: 'all 0.3s ease',
        minHeight: '200px',
        width: '100%',
        overflow: 'hidden',
        boxShadow: `0 4px 15px rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`,
      }}
    >
      {/* Main View */}
      <div
        style={{
          opacity: currentView === 'main' ? 1 : 0,
          transform: currentView === 'main' ? 'translateX(0)' : 'translateX(-20px)',
          transition: 'all 0.3s ease',
          position: currentView === 'main' ? 'relative' : 'absolute',
          width: '100%',
          pointerEvents: currentView === 'main' ? 'auto' : 'none',
        }}
      >
        <div>
          {/* Edit/Delete Buttons */}
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
                  border: `1px solid ${tierColor.background}`,
                  color: tierColor.background,
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
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
                  color: '#fff',
                  margin: '0 0 4px 0',
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {build.name}
                <GenderIcon gender={build.gender} />
              </h3>
              {build.name !== build.species && (
                <p style={{ color: '#ddd', margin: '0 0 8px 0', fontSize: '0.9rem' }}>
                  ({build.species})
                </p>
              )}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span
                  style={{
                    backgroundColor: tierColor.background,
                    color: tierColor.text,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  {build.tier}
                </span>
                <span style={{ color: '#ddd', fontSize: '0.85rem' }}>
                  Level {build.level}
                </span>
              </div>
            </div>
          </div>

          {/* Basic Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            <div>
              <span style={{ color: '#bbb', fontSize: '0.85rem' }}>Nature:</span>
              <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '500' }}>{build.nature}</div>
            </div>
            <div>
              <span style={{ color: '#bbb', fontSize: '0.85rem' }}>Ability:</span>
              <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {build.ability}
              </div>
            </div>
          </div>

          {build.item && (
            <div style={{ marginBottom: '12px' }}>
              <span style={{ color: '#bbb', fontSize: '0.85rem' }}>Item:</span>
              <div style={{ 
                color: '#fff', 
                fontSize: '0.9rem', 
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <ItemImage
                  itemName={build.item}
                  className="item-icon"
                  style={{
                    width: '20px',
                    height: '20px',
                    objectFit: 'contain',
                  }}
                />
                <span>{build.item}</span>
              </div>
            </div>
          )}

          {/* Navigation Arrows - Bottom of card */}
          <div style={{ 
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentView(getPreviousView());
              }}
              style={{
                background: `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`,
                border: `1px solid ${tierColor.background}`,
                color: tierColor.background,
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '600',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.5)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`;
              }}
              title={`Go to ${getViewDisplayName(getPreviousView())}`}
            >
              ←
            </button>
            <span style={{ color: '#ccc', fontSize: '0.7rem', fontStyle: 'italic', padding: '0 8px' }}>
              {getViewDisplayName(currentView)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentView(getNextView());
              }}
              style={{
                background: `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`,
                border: `1px solid ${tierColor.background}`,
                color: tierColor.background,
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '600',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.5)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`;
              }}
              title={`Go to ${getViewDisplayName(getNextView())}`}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Stats View */}
      <div
        style={{
          opacity: currentView === 'stats' ? 1 : 0,
          transform: currentView === 'stats' ? 'translateX(0)' : 'translateX(20px)',
          transition: 'all 0.3s ease',
          position: currentView === 'stats' ? 'relative' : 'absolute',
          width: '100%',
          pointerEvents: currentView === 'stats' ? 'auto' : 'none',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Compact Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '16px', 
          borderBottom: `1px solid ${tierColor.background}`,
          paddingBottom: '8px'
        }}>
          <div>
            <h3 style={{ color: '#fff', margin: '0', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              {build.name}
              <GenderIcon gender={build.gender} />
            </h3>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
              <span style={{
                backgroundColor: tierColor.background,
                color: tierColor.text,
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
              }}>
                {build.tier}
              </span>
              <span style={{ color: '#ddd', fontSize: '0.8rem' }}>
                Level {build.level}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentView(getPreviousView());
              }}
              style={{
                background: `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`,
                border: `1px solid ${tierColor.background}`,
                color: tierColor.background,
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '600',
              }}
              title={`Go to ${getViewDisplayName(getPreviousView())}`}
            >
              ←
            </button>
            <span style={{ color: '#ccc', fontSize: '0.7rem', fontStyle: 'italic', padding: '0 8px' }}>
              {getViewDisplayName(currentView)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentView(getNextView());
              }}
              style={{
                background: `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`,
                border: `1px solid ${tierColor.background}`,
                color: tierColor.background,
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '600',
              }}
              title={`Go to ${getViewDisplayName(getNextView())}`}
            >
              →
            </button>
          </div>
        </div>

        {/* Two Column Layout for Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
          {/* Left Column - IVs */}
          <div>
            <h4 style={{ color: tierColor.background, margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: 'bold' }}>Individual Values</h4>
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
                  backgroundColor: `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.2)`, 
                  borderRadius: '3px',
                  border: `1px solid rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`
                }}>
                  <span style={{ color: '#bbb' }}>{stat.label}:</span>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - EVs */}
          <div>
            <h4 style={{ color: tierColor.background, margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: 'bold' }}>Effort Values</h4>
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
                  backgroundColor: `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.2)`, 
                  borderRadius: '3px',
                  border: `1px solid rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`
                }}>
                  <span style={{ color: '#bbb' }}>{stat.label}:</span>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{stat.value}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '6px', fontSize: '0.65rem', color: '#aaa', textAlign: 'right' }}>
              Total: {Object.values(build.evs).reduce((sum, val) => sum + val, 0)}/510
            </div>
          </div>
        </div>

        {/* Build Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <div style={{ 
            padding: '6px 8px', 
            backgroundColor: `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.2)`, 
            borderRadius: '6px', 
            border: `1px solid rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)` 
          }}>
            <span style={{ color: '#bbb', fontSize: '0.7rem' }}>Nature:</span>
            <div style={{ color: '#fff', fontWeight: '600', fontSize: '0.75rem' }}>{build.nature}</div>
          </div>
          <div style={{ 
            padding: '6px 8px', 
            backgroundColor: `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.2)`, 
            borderRadius: '6px', 
            border: `1px solid rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)` 
          }}>
            <span style={{ color: '#bbb', fontSize: '0.7rem' }}>Ability:</span>
            <div style={{ color: '#fff', fontWeight: '600', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {build.ability}
            </div>
          </div>
          {build.item && (
            <div style={{ 
              padding: '6px 8px', 
              backgroundColor: `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.2)`, 
              borderRadius: '6px', 
              border: `1px solid rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)` 
            }}>
              <span style={{ color: '#bbb', fontSize: '0.7rem' }}>Item:</span>
              <div style={{ 
                color: '#fff', 
                fontWeight: '600', 
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <ItemImage
                  itemName={build.item}
                  className="item-icon"
                  style={{
                    width: '14px',
                    height: '14px',
                    objectFit: 'contain',
                    flexShrink: 0,
                  }}
                />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{build.item}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Moves View */}
      <div
        style={{
          opacity: currentView === 'moves' ? 1 : 0,
          transform: currentView === 'moves' ? 'translateX(0)' : 'translateX(20px)',
          transition: 'all 0.3s ease',
          position: currentView === 'moves' ? 'relative' : 'absolute',
          width: '100%',
          pointerEvents: currentView === 'moves' ? 'auto' : 'none',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Compact Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '16px', 
          borderBottom: `1px solid ${tierColor.background}`,
          paddingBottom: '8px'
        }}>
          <div>
            <h3 style={{ color: '#fff', margin: '0', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              {build.name}
              <GenderIcon gender={build.gender} />
            </h3>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
              <span style={{
                backgroundColor: tierColor.background,
                color: tierColor.text,
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
              }}>
                {build.tier}
              </span>
              <span style={{ color: '#ddd', fontSize: '0.8rem' }}>
                Level {build.level}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentView(getPreviousView());
              }}
              style={{
                background: `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`,
                border: `1px solid ${tierColor.background}`,
                color: tierColor.background,
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '600',
              }}
              title={`Go to ${getViewDisplayName(getPreviousView())}`}
            >
              ←
            </button>
            <span style={{ color: '#ccc', fontSize: '0.7rem', fontStyle: 'italic', padding: '0 8px' }}>
              {getViewDisplayName(currentView)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentView(getNextView());
              }}
              style={{
                background: `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`,
                border: `1px solid ${tierColor.background}`,
                color: tierColor.background,
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '600',
              }}
              title={`Go to ${getViewDisplayName(getNextView())}`}
            >
              →
            </button>
          </div>
        </div>

        {/* Moves Section */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ color: tierColor.background, margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 'bold' }}>Moveset</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {build.moves.slice(0, 4).map((move, index) => {
              const moveType = moveTypes[move] || 'normal';
              const typeColor = MOVE_TYPE_COLORS[moveType] || MOVE_TYPE_COLORS.normal;
              
              return (
                <div
                  key={index}
                  style={{
                    background: typeColor.background,
                    color: typeColor.text,
                    fontSize: '0.8rem',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    textAlign: 'center',
                    fontWeight: '600',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title={move}
                >
                  {move}
                </div>
              );
            })}
          </div>
        </div>

        {/* Description Section - Only if description exists */}
        {build.description && (
          <div style={{ 
            padding: '12px', 
            backgroundColor: `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.2)`, 
            borderRadius: '8px', 
            border: `1px solid rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)` 
          }}>
            <h4 style={{ color: tierColor.background, margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: 'bold' }}>Description</h4>
            <div style={{ color: '#ddd', fontSize: '0.8rem', lineHeight: 1.4 }}>
              {build.description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 