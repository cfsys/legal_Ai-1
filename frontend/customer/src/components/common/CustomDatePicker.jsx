import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEK_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

/**
 * Format a Date object to YYYY-MM-DD
 */
const toISODateString = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parse YYYY-MM-DD or ISO string into local Date (ignoring timezone drift)
 */
const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return dateStr;
  const parts = String(dateStr).split('T')[0].split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    return new Date(y, m, d);
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * Professional SaaS Custom Date Picker Component
 * Includes past-date lock, rich calendar grid, quick shortcuts, and smooth micro-animations.
 */
const CustomDatePicker = ({
  name,
  value,
  onChange,
  minDate = new Date(), // Defaults to today (prevents past dates)
  placeholder = 'Select hearing date...',
  disabled = false,
  size = 'md', // 'sm' | 'md'
  style = {},
  className = '',
  'data-testid': testId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const containerRef = useRef(null);

  // Normalize current selected date
  const selectedDate = parseLocalDate(value);

  // Normalize minDate to start of day
  const normalizedMinDate = minDate ? parseLocalDate(toISODateString(minDate)) : null;

  // Track the currently viewed month & year
  const initialViewDate = selectedDate || new Date();
  const [viewDate, setViewDate] = useState(new Date(initialViewDate.getFullYear(), initialViewDate.getMonth(), 1));

  // Sync viewed month when selected date changes externally
  useEffect(() => {
    if (selectedDate) {
      setViewDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
  }, [value]);

  // Smart auto-positioning: detect viewport collision and open upwards if near bottom of screen
  useEffect(() => {
    const updatePosition = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const popoverHeight = 350;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        // If not enough room below, open upwards if there is room above
        if (spaceBelow < popoverHeight && spaceAbove > 180) {
          setOpenUpwards(true);
        } else {
          setOpenUpwards(false);
        }
      }
    };

    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
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

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  // Check if previous month is entirely in the past
  const canGoPrevMonth = (() => {
    if (!normalizedMinDate) return true;
    const prevMonthEnd = new Date(viewYear, viewMonth, 0);
    return prevMonthEnd >= normalizedMinDate;
  })();

  // Emit change in standard synthetic event format
  const handleSelectDate = (date) => {
    if (disabled) return;
    const isoString = toISODateString(date);
    if (onChange) {
      onChange({
        target: {
          name,
          value: isoString,
        },
      });
    }
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (disabled) return;
    if (onChange) {
      onChange({
        target: {
          name,
          value: '',
        },
      });
    }
  };

  // Quick preset shortcuts
  const handleShortcut = (daysToAdd) => {
    const target = new Date();
    target.setDate(target.getDate() + daysToAdd);
    handleSelectDate(target);
  };

  // Format button label
  const formattedDisplay = selectedDate
    ? selectedDate.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  // Generate calendar grid (Monday-first)
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarDays = [];

  // 1. Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const dateObj = new Date(viewYear, viewMonth - 1, d);
    calendarDays.push({
      date: dateObj,
      dayNum: d,
      isCurrentMonth: false,
      isDisabled: true,
    });
  }

  // 2. Current month days
  const today = parseLocalDate(toISODateString(new Date()));
  for (let i = 1; i <= daysInMonth; i++) {
    const dateObj = new Date(viewYear, viewMonth, i);
    const isPast = normalizedMinDate ? dateObj < normalizedMinDate : false;
    const isToday = today && dateObj.getTime() === today.getTime();
    const isSelected = selectedDate && dateObj.getTime() === selectedDate.getTime();

    calendarDays.push({
      date: dateObj,
      dayNum: i,
      isCurrentMonth: true,
      isDisabled: isPast,
      isToday,
      isSelected,
    });
  }

  // 3. Next month leading days to complete full 35 or 42 grid
  const remaining = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const dateObj = new Date(viewYear, viewMonth + 1, i);
    calendarDays.push({
      date: dateObj,
      dayNum: i,
      isCurrentMonth: false,
      isDisabled: true,
    });
  }

  const isSmall = size === 'sm';
  const height = isSmall ? '36px' : '42px';

  return (
    <div
      ref={containerRef}
      className={`custom-datepicker-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        zIndex: isOpen ? 70 : 'auto',
        ...style,
      }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        data-testid={testId}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        style={{
          width: '100%',
          height,
          borderRadius: isSmall ? '0.5rem' : '0.65rem',
          padding: '0 0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: disabled ? 'not-allowed' : 'pointer',
          backgroundColor: '#ffffff',
          border: isOpen ? '1.5px solid #2563eb' : '1.5px solid #cbd5e1',
          boxShadow: isOpen
            ? '0 0 0 3.5px rgba(37, 99, 235, 0.12), 0 1px 3px rgba(0, 0, 0, 0.04)'
            : '0 1px 2px rgba(0, 0, 0, 0.02)',
          textAlign: 'left',
          transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isOpen || selectedDate ? '#2563eb' : '#64748b',
              transition: 'color 0.18s ease',
              flexShrink: 0,
            }}
          >
            <CalendarIcon size={isSmall ? 15 : 17} strokeWidth={2.2} />
          </div>

          <span
            style={{
              fontSize: isSmall ? '0.8rem' : '0.85rem',
              fontWeight: selectedDate ? 600 : 500,
              color: selectedDate ? '#0f172a' : '#94a3b8',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {formattedDisplay || placeholder}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
          {selectedDate && !disabled && (
            <span
              onClick={handleClear}
              title="Clear date"
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e2e8f0';
                e.currentTarget.style.color = '#0f172a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              <X size={11} strokeWidth={2.5} />
            </span>
          )}

          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: '9999px',
              backgroundColor: isOpen ? '#eff6ff' : '#f8fafc',
              color: isOpen ? '#2563eb' : '#64748b',
              border: `1px solid ${isOpen ? '#bfdbfe' : '#e2e8f0'}`,
              transition: 'all 0.15s ease',
            }}
          >
            Calendar
          </span>
        </div>
      </button>

      {/* Floating Calendar Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Calendar Date Picker"
          style={{
            position: 'absolute',
            ...(openUpwards
              ? { bottom: 'calc(100% + 8px)', top: 'auto' }
              : { top: 'calc(100% + 8px)', bottom: 'auto' }),
            left: 0,
            width: '320px',
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.22), 0 4px 12px -2px rgba(15, 23, 42, 0.08)',
            padding: '14px',
            zIndex: 150,
            animation: openUpwards
              ? 'fadeInSlideUp 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
              : 'fadeInSlide 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
            userSelect: 'none',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Quick Shortcuts Bar */}
          <div
            style={{
              display: 'flex',
              gap: '5px',
              marginBottom: '12px',
              paddingBottom: '10px',
              borderBottom: '1px solid #f1f5f9',
              overflowX: 'auto',
            }}
          >
            <button
              type="button"
              onClick={() => handleShortcut(0)}
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                border: '1px solid #dbeafe',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handleShortcut(1)}
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor: '#f8fafc',
                color: '#334155',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => handleShortcut(7)}
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor: '#f8fafc',
                color: '#334155',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              +1 Week
            </button>
            <button
              type="button"
              onClick={() => handleShortcut(14)}
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor: '#f8fafc',
                color: '#334155',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              +2 Weeks
            </button>
          </div>

          {/* Month & Year Navigation Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                {MONTH_NAMES[viewMonth]}
              </span>
              <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#64748b' }}>
                {viewYear}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <button
                type="button"
                disabled={!canGoPrevMonth}
                onClick={handlePrevMonth}
                title="Previous month"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e2e8f0',
                  backgroundColor: canGoPrevMonth ? '#ffffff' : '#f8fafc',
                  color: canGoPrevMonth ? '#334155' : '#cbd5e1',
                  cursor: canGoPrevMonth ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s ease',
                }}
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                onClick={handleNextMonth}
                title="Next month"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Weekday Column Headers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '2px',
              marginBottom: '6px',
            }}
          >
            {WEEK_DAYS.map((day) => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#94a3b8',
                  padding: '4px 0',
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '3px',
            }}
          >
            {calendarDays.map((item, idx) => {
              const { dayNum, isCurrentMonth, isDisabled, isToday, isSelected } = item;

              if (!isCurrentMonth) {
                return (
                  <div
                    key={`muted-${idx}`}
                    style={{
                      height: '34px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.78rem',
                      color: '#e2e8f0',
                      userSelect: 'none',
                    }}
                  >
                    {dayNum}
                  </div>
                );
              }

              if (isDisabled) {
                return (
                  <div
                    key={`day-${idx}`}
                    title="Past date (disabled)"
                    style={{
                      height: '34px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      color: '#cbd5e1',
                      borderRadius: '8px',
                      cursor: 'not-allowed',
                      backgroundColor: 'transparent',
                      textDecoration: 'line-through',
                      opacity: 0.55,
                    }}
                  >
                    {dayNum}
                  </div>
                );
              }

              return (
                <button
                  key={`day-${idx}`}
                  type="button"
                  onClick={() => handleSelectDate(item.date)}
                  style={{
                    height: '34px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 700 : isToday ? 700 : 500,
                    borderRadius: '8px',
                    border: isToday && !isSelected ? '1.5px solid #2563eb' : 'none',
                    backgroundColor: isSelected
                      ? '#2563eb'
                      : isToday
                      ? '#eff6ff'
                      : 'transparent',
                    color: isSelected
                      ? '#ffffff'
                      : isToday
                      ? '#1d4ed8'
                      : '#1e293b',
                    cursor: 'pointer',
                    transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isSelected
                      ? '0 4px 10px rgba(37, 99, 235, 0.35)'
                      : 'none',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                      e.currentTarget.style.color = '#0f172a';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = isToday ? '#eff6ff' : 'transparent';
                      e.currentTarget.style.color = isToday ? '#1d4ed8' : '#1e293b';
                    }
                  }}
                >
                  <span>{dayNum}</span>
                  {isToday && !isSelected && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '3px',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        backgroundColor: '#2563eb',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer with Hint */}
          <div
            style={{
              marginTop: '10px',
              paddingTop: '8px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.7rem',
              color: '#64748b',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#059669',
                  display: 'inline-block',
                }}
              />
              Future court dates available
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#2563eb',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px 4px',
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
