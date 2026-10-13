import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown, ChevronUp, Check, Search, X, Loader2 } from 'lucide-react';

/**
 * CustomDropdown — sleek select component with input box search and backend search support.
 *
 * Props:
 *   options            {Array}    – items: string | { value, label, subtext?, icon?, badge? }
 *   value              {any}      – currently selected value
 *   onChange           {Function} – (value) => void
 *   placeholder        {string}   – placeholder for closed trigger
 *   searchPlaceholder  {string}   – placeholder for the search input box
 *   label              {string}   – optional field label
 *   icon               {Component}– optional lucide icon inside trigger
 *   searchable         {boolean}  – whether to show search input (default: true)
 *   onSearch           {Function} – optional async backend search: (searchTerm) => Promise<Array|void>
 *   direction          {string}   – 'auto' | 'up' | 'down' | 'top' | 'bottom' (default: 'auto')
 *   openUpwards        {boolean}  – explicit boolean override to open upwards
 *   width              {string}   – CSS width override (default: '100%')
 *   style              {object}   – extra wrapper style
 *   disabled           {boolean}
 */
export default function CustomDropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option...',
  searchPlaceholder,
  label,
  icon: Icon,
  searchable = true,
  onSearch,
  direction = 'auto',
  openUpwards: propOpenUpwards,
  width,
  style = {},
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [backendOptions, setBackendOptions] = useState(null);

  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute flip direction and focus search input when opening
  useEffect(() => {
    if (isOpen) {
      if (direction === 'up' || direction === 'top' || propOpenUpwards === true) {
        setOpenUpwards(true);
      } else if (direction === 'down' || direction === 'bottom' || propOpenUpwards === false) {
        setOpenUpwards(false);
      } else if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelowViewport = window.innerHeight - rect.bottom;

        // Check if inside any modal, dialog, or scrolling container
        const modalEl = containerRef.current.closest(
          '.modal-content, [role="dialog"], .card, form, div[style*="maxHeight"], div[style*="max-height"], div[style*="overflowY"]'
        );
        let spaceBelowContainer = 9999;
        if (modalEl) {
          const modalRect = modalEl.getBoundingClientRect();
          spaceBelowContainer = modalRect.bottom - rect.bottom;
        }

        const effectiveSpaceBelow = Math.min(spaceBelowViewport, spaceBelowContainer);
        // If less than 280px below and enough room above (> 150px), open upwards
        if (effectiveSpaceBelow < 280 && rect.top > 150) {
          setOpenUpwards(true);
        } else {
          setOpenUpwards(false);
        }
      }
      setSearchTerm('');
      setBackendOptions(null);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 40);
    }
  }, [isOpen, direction, propOpenUpwards]);

  // Handle backend search debounce
  const triggerBackendSearch = useCallback((query) => {
    if (!onSearch) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await onSearch(query);
        if (Array.isArray(results)) {
          setBackendOptions(results);
        }
      } catch (err) {
        console.warn('[CustomDropdown] Backend search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);
  }, [onSearch]);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchTerm(q);
    if (onSearch) {
      triggerBackendSearch(q);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setBackendOptions(null);
    if (onSearch) {
      triggerBackendSearch('');
    }
    searchInputRef.current?.focus();
  };

  // Base options to use: backend options if populated, otherwise props options
  const activeOptionsSource = backendOptions !== null ? backendOptions : options;

  // Normalise options to { value, label, subtext, icon }
  const normalizedOptions = useMemo(() => {
    return activeOptionsSource.map((opt) => {
      if (typeof opt === 'object' && opt !== null) {
        return {
          value: opt.value !== undefined ? opt.value : opt.id,
          label: opt.label || opt.name || String(opt.value ?? ''),
          subtext: opt.subtext || opt.tier || opt.description || '',
          badge: opt.badge,
          icon: opt.icon,
        };
      }
      return { value: opt, label: String(opt), subtext: '', badge: null };
    });
  }, [activeOptionsSource]);

  // Filter options locally if not using purely backend search or as instant filter
  const displayOptions = useMemo(() => {
    if (!searchTerm.trim()) return normalizedOptions;
    if (backendOptions !== null) return normalizedOptions; // already filtered from backend
    const q = searchTerm.toLowerCase().trim();
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.subtext && String(opt.subtext).toLowerCase().includes(q)) ||
        String(opt.value).toLowerCase().includes(q)
    );
  }, [normalizedOptions, searchTerm, backendOptions]);

  // Find currently selected option (checking both normalized and original options)
  const allKnownOptions = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'object' && opt !== null) {
        return {
          value: opt.value !== undefined ? opt.value : opt.id,
          label: opt.label || opt.name || String(opt.value ?? ''),
          subtext: opt.subtext || opt.tier || opt.description || '',
        };
      }
      return { value: opt, label: String(opt), subtext: '' };
    });
  }, [options]);

  const selectedOption =
    normalizedOptions.find((opt) => String(opt.value) === String(value)) ||
    allKnownOptions.find((opt) => String(opt.value) === String(value));

  // Determine placeholder text for search input box
  const computedSearchPlaceholder =
    searchPlaceholder ||
    (label ? `Search ${String(label).replace(/[*:]/g, '').trim()}...` : 'Search options...');

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: width || '100%',
        display: 'inline-block',
        ...style,
      }}
    >
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#334155',
            marginBottom: '3px',
            letterSpacing: '0.01em',
          }}
        >
          {label}
        </label>
      )}

      {/* ── Trigger Box ── */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) setIsOpen((o) => !o);
        }}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setIsOpen((o) => !o);
          }
          if (e.key === 'Escape') setIsOpen(false);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          padding: '0 10px',
          backgroundColor: '#ffffff',
          border: isOpen ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
          borderRadius: '8px',
          boxShadow: isOpen
            ? '0 0 0 3px rgba(37,99,235,0.12)'
            : '0 1px 2px rgba(0,0,0,0.03)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          transition: 'all 0.15s ease',
          outline: 'none',
          height: '36px',
          minHeight: '36px',
          boxSizing: 'border-box',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflow: 'hidden',
          }}
        >
          {Icon && (
            <Icon
              size={15}
              style={{
                color: isOpen ? '#2563eb' : '#64748b',
                flexShrink: 0,
              }}
            />
          )}
          <span
            style={{
              fontSize: '0.84rem',
              color: selectedOption ? '#0f172a' : '#94a3b8',
              fontWeight: selectedOption ? 500 : 400,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.subtext && (
            <span
              style={{
                fontSize: '0.72rem',
                color: '#64748b',
                backgroundColor: '#f1f5f9',
                padding: '0.1rem 0.4rem',
                borderRadius: '4px',
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              {selectedOption.subtext}
            </span>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            color: isOpen ? '#2563eb' : '#64748b',
            flexShrink: 0,
          }}
        >
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* ── Dropdown Menu with Search Input Box ── */}
      {isOpen && (
        <div
          role="listbox"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: openUpwards ? 'auto' : 'calc(100% + 4px)',
            bottom: openUpwards ? 'calc(100% + 4px)' : 'auto',
            left: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            boxShadow: openUpwards
              ? '0 -12px 28px -4px rgba(15,23,42,0.18), 0 -4px 8px -2px rgba(15,23,42,0.06)'
              : '0 12px 28px -4px rgba(15,23,42,0.18), 0 4px 8px -2px rgba(15,23,42,0.06)',
            padding: '0.35rem',
            minWidth: '220px',
            animation: 'fadeIn 0.1s ease',
          }}
        >
          {/* Search Functionality Input Box with Placeholder */}
          {searchable && (
            <div
              style={{
                padding: '0.3rem 0.35rem 0.4rem 0.35rem',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {isSearching ? (
                  <Loader2
                    size={14}
                    style={{
                      position: 'absolute',
                      left: '9px',
                      color: '#2563eb',
                      animation: 'spin 1s linear infinite',
                      pointerEvents: 'none',
                    }}
                  />
                ) : (
                  <Search
                    size={14}
                    style={{
                      position: 'absolute',
                      left: '9px',
                      color: '#94a3b8',
                      pointerEvents: 'none',
                    }}
                  />
                )}
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder={computedSearchPlaceholder}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: searchTerm ? '0 26px 0 28px' : '0 10px 0 28px',
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    outline: 'none',
                    backgroundColor: '#f8fafc',
                    color: '#0f172a',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.borderColor = '#93c5fd';
                    e.target.style.boxShadow = '0 0 0 2px rgba(147, 197, 253, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = '#f8fafc';
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setIsOpen(false);
                    if (e.key === 'Enter' && displayOptions.length > 0) {
                      e.preventDefault();
                      onChange(displayOptions[0].value);
                      setIsOpen(false);
                    }
                  }}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    title="Clear search"
                    style={{
                      position: 'absolute',
                      right: '6px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      padding: '2px',
                      cursor: 'pointer',
                      color: '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div
            style={{
              maxHeight: '175px',
              overflowY: 'auto',
              paddingTop: '0.2rem',
            }}
          >
            {isSearching ? (
              <div
                style={{
                  padding: '0.85rem',
                  fontSize: '0.8rem',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Loader2 size={13} style={{ animation: 'spin 1s linear infinite', color: '#2563eb' }} />
                <span>Searching backend...</span>
              </div>
            ) : displayOptions.length === 0 ? (
              <div
                style={{
                  padding: '0.85rem',
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                  textAlign: 'center',
                }}
              >
                {searchTerm ? 'No matching options found' : 'No options available'}
              </div>
            ) : (
              displayOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <div
                    key={String(opt.value)}
                    role="option"
                    aria-selected={isSelected}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? '#2563eb' : '#334155',
                      backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.1s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        overflow: 'hidden',
                      }}
                    >
                      {opt.icon && (
                        <opt.icon
                          size={14}
                          style={{
                            color: isSelected ? '#2563eb' : '#64748b',
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <span
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {opt.label}
                      </span>
                      {opt.subtext && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            color: isSelected ? '#2563eb' : '#64748b',
                            backgroundColor: isSelected ? '#dbeafe' : '#f1f5f9',
                            padding: '0.1rem 0.35rem',
                            borderRadius: '4px',
                            fontWeight: 500,
                            flexShrink: 0,
                          }}
                        >
                          {opt.subtext}
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <Check
                        size={14}
                        color="#2563eb"
                        style={{ flexShrink: 0, marginLeft: '0.5rem' }}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
