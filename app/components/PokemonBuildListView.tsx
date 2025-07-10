import React, { useState, useEffect } from 'react';
import type { PokemonBuild } from '../types/pokemon';
import { getItemSpriteUrls } from '../utils/item-sprites';
import { TIER_COLORS } from '../types/pokemon';
import { buildToShowdownFormat } from '../utils/showdown-parser';

interface PokemonBuildListViewProps {
  builds: PokemonBuild[];
  onEdit?: (build: PokemonBuild) => void;
  onDelete?: (id: string) => void;
}

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
        fontSize: '1rem',
        fontWeight: 'bold',
        marginLeft: '4px',
        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
      }}
    >
      {genderDisplay.icon}
    </span>
  );
}

// Item Image Component
function ItemImage({ itemName, className, style }: { itemName: string; className?: string; style?: React.CSSProperties }) {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const itemUrls = getItemSpriteUrls(itemName);

  const handleImageError = () => {
    if (currentUrlIndex < itemUrls.length - 1) {
      setCurrentUrlIndex(currentUrlIndex + 1);
    }
  };

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

function PokemonBuildListItem({ build, onEdit, onDelete }: { build: PokemonBuild; onEdit?: (build: PokemonBuild) => void; onDelete?: (id: string) => void; }) {
  const [imageError, setImageError] = useState(false);
  const tierColor = TIER_COLORS[build.tier];

  // Format Pokemon name for URLs
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

  const formatEVs = (evs: any) => {
    const evEntries: string[] = [];
    if (evs.hp > 0) evEntries.push(`${evs.hp} HP`);
    if (evs.attack > 0) evEntries.push(`${evs.attack} Atk`);
    if (evs.defense > 0) evEntries.push(`${evs.defense} Def`);
    if (evs.sp_attack > 0) evEntries.push(`${evs.sp_attack} SpA`);
    if (evs.sp_defense > 0) evEntries.push(`${evs.sp_defense} SpD`);
    if (evs.speed > 0) evEntries.push(`${evs.speed} Spe`);
    return evEntries.join(' / ') || 'No EVs';
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6))',
        borderLeft: `4px solid ${tierColor.background}`,
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '8px',
        transition: 'all 0.3s ease',
        border: `1px solid rgba(255, 255, 255, 0.1)`,
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        e.currentTarget.style.transform = 'translateX(4px)';
        e.currentTarget.style.boxShadow = `0 4px 15px rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
        e.currentTarget.style.transform = 'translateX(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* First Line: Basic Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        {/* Pokemon Sprite */}
        <img
          src={imageError ? fallbackSpriteUrl : spriteUrl}
          alt={build.species}
          style={{
            width: '32px',
            height: '32px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))',
            flexShrink: 0,
          }}
          onError={() => setImageError(true)}
        />

        {/* Name and Species */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h4 style={{ 
              color: '#fff', 
              margin: 0, 
              fontSize: '1rem', 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
            }}>
              {build.name}
              <GenderIcon gender={build.gender} />
            </h4>
            {build.name !== build.species && (
              <span style={{ color: '#ddd', fontSize: '0.85rem' }}>
                ({build.species})
              </span>
            )}
            <span
              style={{
                backgroundColor: tierColor.background,
                color: tierColor.text,
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
              }}
            >
              {build.tier}
            </span>
          </div>
        </div>

        {/* Nature and Ability */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#bbb', fontSize: '0.75rem' }}>Nature</div>
            <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '500' }}>{build.nature}</div>
          </div>
          <div style={{ textAlign: 'center', maxWidth: '120px' }}>
            <div style={{ color: '#bbb', fontSize: '0.75rem' }}>Ability</div>
            <div style={{ 
              color: '#fff', 
              fontSize: '0.85rem', 
              fontWeight: '500',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {build.ability}
            </div>
          </div>
        </div>

        {/* Item */}
        {build.item && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <ItemImage
              itemName={build.item}
              style={{
                width: '20px',
                height: '20px',
                objectFit: 'contain',
              }}
            />
            <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '500' }}>
              {build.item.length > 15 ? `${build.item.substring(0, 15)}...` : build.item}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button
            onClick={handleExportToShowdown}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #28a745',
              color: '#28a745',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.7rem',
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
                padding: '4px 8px',
                borderRadius: '4px',
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
                padding: '4px 8px',
                borderRadius: '4px',
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
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* Second Line: EVs and Moves */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '44px' }}>
        {/* EVs */}
        <div style={{ flex: 1 }}>
          <span style={{ color: '#bbb', fontSize: '0.75rem' }}>EVs: </span>
          <span style={{ color: '#fff', fontSize: '0.8rem' }}>{formatEVs(build.evs)}</span>
        </div>

        {/* Moves */}
        <div style={{ flex: 2 }}>
          <span style={{ color: '#bbb', fontSize: '0.75rem' }}>Moves: </span>
          <span style={{ color: '#fff', fontSize: '0.8rem' }}>
            {build.moves.filter(move => move).join(' / ') || 'No moves'}
          </span>
        </div>
      </div>
    </div>
  );
}

export function PokemonBuildListView({ builds, onEdit, onDelete }: PokemonBuildListViewProps) {
  return (
    <div style={{ maxWidth: '100%' }}>
      {builds.map((build) => (
        <PokemonBuildListItem
          key={build.id}
          build={build}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      
      {builds.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#ccc' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>No Pokemon builds found</p>
          <p style={{ fontSize: '0.9rem' }}>Add some builds to see them in list view</p>
        </div>
      )}
    </div>
  );
} 