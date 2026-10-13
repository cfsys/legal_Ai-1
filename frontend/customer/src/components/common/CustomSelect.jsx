import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

const CustomSelect = ({
  name,
  value,
  onChange,
  options = [],
  icon: Icon,
  placeholder = 'Select option',
  disabled = false,
  size = 'md', // 'sm' | 'md'
  style = {},
  buttonStyle = {},
  dropdownStyle = {},
  className = '',
  searchable = true,
  searchPlaceholder = 'Search...',
  'data-testid': testId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize options: supports both ['Option 1', 'Option 2'] and [{ value: '1', label: 'Option 1' }]
  const normalizedOptions = options.map((opt) =>
    typeof opt === 'object' && opt !== null
      ? { value: opt.value ?? opt.label, label: opt.label ?? opt.value }
      : { value: opt, label: String(opt) }
  );

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value));

  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleSelect = (optionValue) => {
    if (disabled) return;
    if (onChange) {
      onChange({
        target: {
          name,
          value: optionValue,
        },
      });
    }
    setIsOpen(false);
  };

  const isSmall = size === 'sm';
  const height = isSmall ? '36px' : '42px';
  const paddingLeft = Icon ? (isSmall ? '2.2rem' : '2.5rem') : '0.85rem';

  return (
    <div
      ref={containerRef}
      className={`custom-select-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        zIndex: isOpen ? 60 : 'auto',
        ...style,
      }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        data-testid={testId}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className="input-wrapper custom-select-trigger"
        style={{
          width: '100%',
          height,
          borderRadius: isSmall ? '0.5rem' : '0.65rem',
          padding: `0 0.75rem 0 ${paddingLeft}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: disabled ? 'not-allowed' : 'pointer',
          backgroundColor: '#ffffff',
          border: isOpen ? '1.5px solid #2563eb' : '1.5px solid #e2e8f0',
          boxShadow: isOpen
            ? '0 0 0 3.5px rgba(37, 99, 235, 0.12), 0 1px 3px rgba(0, 0, 0, 0.04)'
            : '0 1px 2px rgba(0, 0, 0, 0.02)',
          textAlign: 'left',
          transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
          ...buttonStyle,
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {/* Leading Prefix Icon */}
        {Icon && (
          <span
            className="input-icon-prefix"
            style={{
              position: 'absolute',
              left: isSmall ? '0.75rem' : '0.95rem',
              color: isOpen ? '#2563eb' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              transition: 'color 0.18s ease',
            }}
          >
            <Icon size={isSmall ? 14 : 16} />
          </span>
        )}

        {/* Selected Label */}
        <span
          style={{
            fontSize: buttonStyle.fontSize || (isSmall ? '0.8rem' : '0.85rem'),
            color: selectedOption ? (buttonStyle.color || '#0f172a') : '#94a3b8',
            fontWeight: buttonStyle.fontWeight || 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {/* Chevron Icon that flips smoothly */}
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isOpen ? '#2563eb' : (buttonStyle.color || '#64748b'),
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), color 0.18s ease',
            marginLeft: '0.5rem',
            flexShrink: 0,
          }}
        >
          <ChevronDown size={isSmall ? 14 : 16} strokeWidth={2} />
        </span>
      </button>

      {/* Floating Dropdown Card */}
      {isOpen && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 5px)',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 12px 28px -4px rgba(15, 23, 42, 0.14), 0 4px 10px -2px rgba(15, 23, 42, 0.05)',
            padding: '6px',
            zIndex: 100,
            maxHeight: '280px',
            overflowY: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            minWidth: '100%',
            animation: 'fadeInSlide 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
            ...dropdownStyle,
          }}
        >
          {/* Search Functionality: Only with input box and placeholder (No right-side button) */}
          {searchable && (
            <div
              style={{
                padding: '4px 4px 8px 4px',
                borderBottom: '1px solid #f1f5f9',
                marginBottom: '4px',
                flexShrink: 0,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  padding: '0 0.65rem',
                  height: '34px',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
                }}
                onFocusCapture={(e) => {
                  e.currentTarget.style.borderColor = '#2563eb';
                  e.currentTarget.style.boxShadow = '0 0 0 2.5px rgba(37, 99, 235, 0.12)';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
                onBlurCapture={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
              >
                <Search
                  size={14}
                  color="#94a3b8"
                  style={{ flexShrink: 0, marginRight: '0.45rem', pointerEvents: 'none' }}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (filteredOptions.length > 0) {
                        handleSelect(filteredOptions[0].value);
                      }
                    } else if (e.key === 'Escape') {
                      setIsOpen(false);
                    }
                  }}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontSize: isSmall ? '0.78rem' : '0.82rem',
                    color: '#0f172a',
                    padding: 0,
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginLeft: '0.35rem',
                    }}
                    title="Clear search"
                  >
                    <X size={13} strokeWidth={2.4} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              overflowY: 'auto',
              maxHeight: '220px',
              flex: 1,
            }}
          >
            {filteredOptions.map((option) => {
              const isSelected = String(option.value) === String(value);
              return (
                <div
                  key={String(option.value)}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: isSmall ? '0.45rem 0.75rem' : '0.55rem 0.85rem',
                    borderRadius: '0.5rem',
                    fontSize: isSmall ? '0.8rem' : '0.84rem',
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected ? '#1e40af' : '#334155',
                    backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    userSelect: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.color = '#0f172a';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#334155';
                    }
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <Check
                      size={15}
                      strokeWidth={2.4}
                      color="#2563eb"
                      style={{ flexShrink: 0, marginLeft: '0.5rem' }}
                    />
                  )}
                </div>
              );
            })}
            {filteredOptions.length === 0 && (
              <div style={{ padding: '0.85rem', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
                {searchQuery ? `No options matching "${searchQuery}"` : 'No options available'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
