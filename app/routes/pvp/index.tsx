import { useState, useEffect } from 'react';
import type { PokemonBuild, CompetitiveTier } from '../../types/pokemon';
import { COMPETITIVE_TIERS } from '../../types/pokemon';
import { PokemonBuildService } from '../../services/pokemon-backend';
import { TierFilter } from '../../components/TierFilter';
import { PokemonBuildCard } from '../../components/PokemonBuildCard';
import { AddPokemonModal } from '../../components/AddPokemonModal';

export default function PVPPage() {
  const [builds, setBuilds] = useState<PokemonBuild[]>([]);
  const [filteredBuilds, setFilteredBuilds] = useState<PokemonBuild[]>([]);
  const [selectedTier, setSelectedTier] = useState<CompetitiveTier | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBuild, setEditingBuild] = useState<PokemonBuild | undefined>();
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [modalDefaultTab, setModalDefaultTab] = useState<'manual' | 'showdown'>('manual');

  // Sort builds by tier order
  const sortBuildsByTier = (builds: PokemonBuild[]) => {
    return [...builds].sort((a, b) => {
      const tierIndexA = COMPETITIVE_TIERS.indexOf(a.tier);
      const tierIndexB = COMPETITIVE_TIERS.indexOf(b.tier);
      
      // If tier not found, put it at the end
      if (tierIndexA === -1) return 1;
      if (tierIndexB === -1) return -1;
      
      return tierIndexA - tierIndexB;
    });
  };

  // Load Pokemon builds
  useEffect(() => {
    loadBuilds();
  }, []);

  // Filter and sort builds when tier changes
  useEffect(() => {
    let filtered = selectedTier 
      ? builds.filter(build => build.tier === selectedTier)
      : builds;
    
    // Always sort by tier order
    filtered = sortBuildsByTier(filtered);
    setFilteredBuilds(filtered);
  }, [builds, selectedTier]);

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

  const handleSaveBuild = async (buildData: Omit<PokemonBuild, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingBuild) {
        await PokemonBuildService.updateBuild(editingBuild.id, buildData);
      } else {
        await PokemonBuildService.createBuild(buildData);
      }
      await loadBuilds();
      setShowAddModal(false);
      setEditingBuild(undefined);
    } catch (err) {
      console.error('Failed to save Pokemon build:', err);
      throw err;
    }
  };

  const handleEditBuild = (build: PokemonBuild) => {
    setEditingBuild(build);
    setModalDefaultTab('manual');
    setShowAddModal(true);
    setShowAddOptions(false);
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

  const handleAddNew = () => {
    setEditingBuild(undefined);
    setModalDefaultTab('manual');
    setShowAddModal(true);
    setShowAddOptions(false);
  };

  const handleShowdownImport = () => {
    setEditingBuild(undefined);
    setModalDefaultTab('showdown');
    setShowAddModal(true);
    setShowAddOptions(false);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingBuild(undefined);
    setShowAddOptions(false);
    setModalDefaultTab('manual');
  };

  const tierCounts = builds.reduce((acc, build) => {
    acc[build.tier] = (acc[build.tier] || 0) + 1;
    return acc;
  }, {} as Record<CompetitiveTier, number>);

  return (
    <>
      {/* Sticky Utility Bar - positioned outside scrollable container */}
      <div
        className="sticky top-[64px] z-30 px-4 py-2 flex justify-between items-center bg-black/10 rounded-md shadow-sm"
        style={{
          position: 'sticky',
          top: '280px', // Below navbar (200px navbar + 80px spacing)
          left: 0,
          right: 0,
          zIndex: 30,
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          margin: '0 32px', // Increased from 16px for better spacing
          marginBottom: '16px',
        }}
      >
        <div style={{ marginLeft: '16px' }}> {/* Bring inward from edge */}
          <TierFilter selectedTier={selectedTier} onTierChange={setSelectedTier} style="dropdown" />
        </div>
        
        {/* Main Page Header */}
        <h1 style={{
          color: '#ffcb05',
          fontSize: '1.8rem',
          fontWeight: 'bold',
          margin: 0,
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          height: '50px',
          letterSpacing: '0.5px',
        }}>
          ⚔️ PVP Battle Builds ⚔️
        </h1>
        
        <div style={{ position: 'relative', marginRight: '16px' }}> {/* Bring inward from edge */}
          <button
            onClick={() => setShowAddOptions(!showAddOptions)}
            style={{
              backgroundColor: '#ffcb05',
              color: '#000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e6b800';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffcb05';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Add Pokemon
            <span style={{ 
              transform: showAddOptions ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}>
              ▼
            </span>
          </button>

          {/* Add Options Dropdown */}
          {showAddOptions && (
            <>
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 100,
                }}
                onClick={() => setShowAddOptions(false)}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.95)',
                  border: '2px solid #ffcb05',
                  borderRadius: '8px',
                  marginTop: '4px',
                  zIndex: 200,
                  minWidth: '200px',
                }}
              >
                <button
                  onClick={handleAddNew}
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#ffcb05',
                    padding: '12px 16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    borderBottom: '1px solid rgba(255, 203, 5, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 203, 5, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  ✚ New Pokemon Entry
                </button>
                <button
                  onClick={handleShowdownImport}
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#ffcb05',
                    padding: '12px 16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 203, 5, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  📋 Showdown Import
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content Container - Scrollable */}
      <div
        style={{
          position: 'fixed',
          top: '350px', // Start below navbar + utility bar (280px + 70px)
          left: 0,
          right: 0,
          height: 'calc(100vh - 350px)', // Take remaining viewport height
          backgroundColor: 'transparent',
          overflowY: 'auto', // Allow scrolling within this container
          overflowX: 'hidden',
        }}
      >
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto',
          padding: '2rem',
          minHeight: '100%', // Ensure content can fill the container
        }}>


          {/* Content */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div
                style={{
                  color: '#ffcb05',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                }}
              >
                Loading Pokemon builds...
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
          ) : filteredBuilds.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div
                style={{
                  color: '#ffcb05',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                }}
              >
                No Pokemon builds found
              </div>
              <p style={{ color: '#ccc', marginBottom: '2rem' }}>
                {selectedTier 
                  ? `No builds found for ${selectedTier} tier. Try selecting a different tier or add some builds.`
                  : 'Start building your competitive Pokemon team by adding your first build.'
                }
              </p>
              <button
                onClick={() => setShowAddOptions(true)}
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
                Add Pokemon
              </button>
            </div>
          ) : (
            <>
              {/* Pokemon Cards Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                  gap: '2rem',
                  marginBottom: '3rem',
                }}
              >
                {filteredBuilds.map((build) => (
                  <PokemonBuildCard
                    key={build.id}
                    build={build}
                    onEdit={handleEditBuild}
                    onDelete={handleDeleteBuild}
                  />
                ))}
              </div>

              {/* Build Count - Moved to Bottom */}
              <p 
                className="text-center mt-10 text-sm text-white/60"
                style={{ 
                  textAlign: 'center', 
                  marginTop: '2rem', 
                  fontSize: '0.875rem', 
                  color: 'rgba(255, 255, 255, 0.6)',
                  paddingBottom: '2rem',
                }}
              >
                {filteredBuilds.length} total builds
                {selectedTier && ` in ${selectedTier}`}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AddPokemonModal
        isOpen={showAddModal}
        onClose={closeModal}
        onSave={handleSaveBuild}
        editBuild={editingBuild}
        defaultTab={modalDefaultTab}
      />
    </>
  );
}
