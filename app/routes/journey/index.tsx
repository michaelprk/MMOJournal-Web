import React, { useState, useEffect } from 'react';

// Types for journal functionality
interface JournalEntry {
  id: number;
  title: string;
  content: string;
  plainText?: string;
  tags: string[];
  isPublic: boolean;
  mediaUrls: string[];
  createdAt: string;
  updatedAt: string;
}

interface JournalTag {
  id: number;
  name: string;
  color?: string;
  description?: string;
  useCount: number;
}

export default function JourneyPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [tags, setTags] = useState<JournalTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI State
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'title'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Editor State
  const [editorTitle, setEditorTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorTags, setEditorTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  // Load data on component mount
  useEffect(() => {
    loadEntries();
    loadTags();
  }, [searchTerm, selectedTags, sortBy, sortOrder]);

  const loadEntries = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        search: searchTerm,
        sortBy,
        sortOrder,
        limit: '20'
      });
      
      if (selectedTags.length > 0) {
        selectedTags.forEach(tag => params.append('tags', tag));
      }
      
      const response = await fetch(`http://localhost:4000/api/journal/entries?${params}`);
      if (!response.ok) throw new Error('Failed to fetch entries');
      
      const data = await response.json();
      setEntries(data.entries || []);
      setError(null);
    } catch (err) {
      console.error('Error loading entries:', err);
      setError('Failed to load journal entries. Please check if the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/journal/tags');
      if (!response.ok) throw new Error('Failed to fetch tags');
      
      const data = await response.json();
      setTags(data);
    } catch (err) {
      console.error('Error loading tags:', err);
      // Don't set error for tags, just log it
    }
  };

  const handleSaveEntry = async () => {
    try {
      if (!editorTitle.trim() || !editorContent.trim()) {
        alert('Title and content are required');
        return;
      }

      const entryData = {
        title: editorTitle.trim(),
        content: editorContent,
        tags: editorTags,
        isPublic: false
      };

      const url = editingEntry 
        ? `http://localhost:4000/api/journal/entries/${editingEntry.id}`
        : 'http://localhost:4000/api/journal/entries';
      
      const method = editingEntry ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData)
      });

      if (!response.ok) throw new Error('Failed to save entry');

      // Reset editor and reload entries
      setEditorTitle('');
      setEditorContent('');
      setEditorTags([]);
      setEditingEntry(null);
      setShowEditor(false);
      loadEntries();
      loadTags(); // Reload tags to update counts
      
    } catch (err) {
      console.error('Error saving entry:', err);
      alert('Failed to save entry. Please check if the backend server is running.');
    }
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setEditorTitle(entry.title);
    setEditorContent(entry.content);
    setEditorTags(entry.tags);
    setShowEditor(true);
  };

  const handleDeleteEntry = async (id: number) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const response = await fetch(`http://localhost:4000/api/journal/entries/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete entry');

      loadEntries();
      loadTags();
    } catch (err) {
      console.error('Error deleting entry:', err);
      alert('Failed to delete entry. Please check if the backend server is running.');
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editorTags.includes(newTag.trim())) {
      setEditorTags([...editorTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditorTags(editorTags.filter(tag => tag !== tagToRemove));
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.plainText?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => entry.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  return (
    <div style={{ 
      paddingTop: '200px', // Space for navbar
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Header Section */}
      <div style={{
        padding: '20px 32px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
        margin: '0 32px 20px 32px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{
              color: '#ffcb05',
              fontSize: '2.2rem',
              fontWeight: 'bold',
              margin: '0 0 8px 0',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              letterSpacing: '0.5px',
            }}>
              📖 Journal 📖
            </h1>
            <p style={{
              color: '#ccc',
              fontSize: '1rem',
              margin: 0,
              opacity: 0.9,
            }}>
              Document your PokeMMO journey and experiences
            </p>
          </div>
          
          <button
            onClick={() => {
              setEditingEntry(null);
              setEditorTitle('');
              setEditorContent('');
              setEditorTags([]);
              setShowEditor(true);
            }}
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
            ✏️ New Entry
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        padding: '16px 32px',
        borderBottom: '1px solid rgba(255, 203, 5, 0.2)',
        marginBottom: '20px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>🔍</span>
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid rgba(255, 203, 5, 0.3)',
                background: 'rgba(0, 0, 0, 0.4)',
                color: 'white',
                fontSize: '0.875rem',
                minWidth: '200px',
              }}
            />
          </div>
          
          {/* Tag Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Tags:</span>
            <select
              multiple
              value={selectedTags}
              onChange={(e) => setSelectedTags(Array.from(e.target.selectedOptions, option => option.value))}
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid rgba(255, 203, 5, 0.3)',
                background: 'rgba(0, 0, 0, 0.4)',
                color: 'white',
                fontSize: '0.875rem',
                minHeight: '36px',
              }}
            >
              {tags.map(tag => (
                <option key={tag.id} value={tag.name}>{tag.name} ({tag.useCount})</option>
              ))}
            </select>
          </div>
          
          {/* Sort Options */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Sort:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy as 'createdAt' | 'updatedAt' | 'title');
                setSortOrder(newSortOrder as 'asc' | 'desc');
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid rgba(255, 203, 5, 0.3)',
                background: 'rgba(0, 0, 0, 0.4)',
                color: 'white',
                fontSize: '0.875rem',
              }}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="updatedAt-desc">Recently Updated</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        padding: '0 2rem 2rem 2rem',
        minHeight: '100%',
      }}>
        {/* Editor Modal */}
        {showEditor && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 10000, // Higher than navbar
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.95)',
              border: '2px solid #ffcb05',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: '#ffcb05', margin: 0 }}>
                  {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
                </h3>
                <button
                  onClick={() => setShowEditor(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #dc3545',
                    color: '#dc3545',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Title Input */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#ffcb05', display: 'block', marginBottom: '8px' }}>Title</label>
                <input
                  type="text"
                  value={editorTitle}
                  onChange={(e) => setEditorTitle(e.target.value)}
                  placeholder="Enter entry title..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(255, 203, 5, 0.3)',
                    borderRadius: '6px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    color: '#fff',
                    fontSize: '1rem',
                  }}
                />
              </div>

              {/* Content Textarea */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#ffcb05', display: 'block', marginBottom: '8px' }}>Content</label>
                <textarea
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  placeholder="Write your journal entry here..."
                  rows={10}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(255, 203, 5, 0.3)',
                    borderRadius: '6px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Tags Section */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#ffcb05', display: 'block', marginBottom: '8px' }}>Tags</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  {editorTags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        background: 'rgba(255, 203, 5, 0.2)',
                        color: '#ffcb05',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ffcb05',
                          cursor: 'pointer',
                          fontSize: '0.7rem',
                        }}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid rgba(255, 203, 5, 0.3)',
                      borderRadius: '6px',
                      background: 'rgba(0, 0, 0, 0.4)',
                      color: '#fff',
                      fontSize: '0.9rem',
                    }}
                  />
                  <button
                    onClick={handleAddTag}
                    style={{
                      background: 'rgba(255, 203, 5, 0.2)',
                      border: '1px solid #ffcb05',
                      color: '#ffcb05',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Save/Cancel Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowEditor(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #ccc',
                    color: '#ccc',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEntry}
                  style={{
                    background: '#ffcb05',
                    color: '#000',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  {editingEntry ? 'Update Entry' : 'Save Entry'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Entries List */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ color: '#ffcb05', fontSize: '1.2rem', fontWeight: 'bold' }}>
              Loading journal entries...
            </div>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ color: '#ff6b6b', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              {error}
            </div>
            <button onClick={loadEntries} style={{
              backgroundColor: '#ffcb05',
              color: '#000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}>
              Try Again
            </button>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ color: '#ffcb05', fontSize: '1.5rem', margin: '0 0 16px 0' }}>
              📖 No Journal Entries Yet
            </div>
            <p style={{ color: '#ccc', marginBottom: '2rem' }}>
              Start documenting your PokeMMO journey by creating your first entry.
            </p>
            <button
              onClick={() => setShowEditor(true)}
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
              Create Your First Entry
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px',
            marginTop: '20px',
          }}>
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 203, 5, 0.3)',
                  borderRadius: '8px',
                  padding: '20px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 203, 5, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 style={{ color: '#ffcb05', margin: '0 0 12px 0', fontSize: '1.2rem' }}>
                  {entry.title}
                </h3>
                <p style={{ color: '#ccc', margin: '0 0 16px 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {entry.plainText ? entry.plainText.substring(0, 200) + '...' : entry.content.substring(0, 200) + '...'}
                </p>
                
                {/* Tags */}
                {entry.tags && entry.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    {entry.tags.map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          background: 'rgba(255, 203, 5, 0.2)',
                          color: '#ffcb05',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '0.7rem',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#999', fontSize: '0.8rem' }}>
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEditEntry(entry)}
                      style={{
                        background: 'rgba(255, 203, 5, 0.2)',
                        border: '1px solid #ffcb05',
                        color: '#ffcb05',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      style={{
                        background: 'rgba(220, 53, 69, 0.2)',
                        border: '1px solid #dc3545',
                        color: '#dc3545',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
