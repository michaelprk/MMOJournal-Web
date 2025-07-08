import { useState, useRef, useEffect } from 'react';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions: string[];
  onSearch: (query: string) => void;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export function AutocompleteInput({
  value,
  onChange,
  placeholder,
  suggestions,
  onSearch,
  style,
  disabled = false
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && value.length > 1) {
      onSearch(value);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
    setSelectedIndex(-1);
  }, [value, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          onChange(suggestions[selectedIndex]);
          setIsOpen(false);
          setSelectedIndex(-1);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (value && value.length > 1) {
            setIsOpen(true);
          }
        }}
        onBlur={() => {
          // Delay closing to allow for suggestion clicks
          setTimeout(() => setIsOpen(false), 150);
        }}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid #ffcb05',
          borderRadius: '8px',
          color: '#fff',
          padding: '8px 12px',
          ...style,
        }}
      />

      {isOpen && suggestions.length > 0 && (
        <div
          ref={listRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            border: '1px solid #ffcb05',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                backgroundColor: selectedIndex === index ? 'rgba(255, 203, 5, 0.2)' : 'transparent',
                color: selectedIndex === index ? '#ffcb05' : '#fff',
                borderBottom: index < suggestions.length - 1 ? '1px solid rgba(255, 203, 5, 0.1)' : 'none',
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 