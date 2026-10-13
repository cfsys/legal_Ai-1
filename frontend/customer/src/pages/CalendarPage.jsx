import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Tag,
  X,
  Check,
  Trash2,
  Edit2,
  RefreshCw,
  Search,
  Scale,
  CalendarCheck,
  AlertCircle,
  Briefcase,
  List,
  Grid,
} from 'lucide-react';
import { toast } from '../context/ToastContext';
import CustomSelect from '../components/common/CustomSelect';
import ConfirmModal from '../components/common/ConfirmModal';
import { eventService } from '../services/api';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const EVENT_TYPE_OPTIONS = [
  { value: 'Hearing', label: 'Court Hearing' },
  { value: 'Deadline', label: 'Statutory Deadline' },
  { value: 'Task', label: 'Filing / Task' },
  { value: 'Meeting', label: 'Client / Counsel Meeting' },
  { value: 'Reminder', label: 'Reminder' },
];

const EVENT_TYPE_COLORS = {
  Hearing: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe', dot: '#2563eb' },
  Deadline: { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca', dot: '#dc2626' },
  Task: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', dot: '#16a34a' },
  Meeting: { bg: '#faf5ff', text: '#7e22ce', border: '#e9d5ff', dot: '#9333ea' },
  Reminder: { bg: '#fffbeb', text: '#b45309', border: '#fde68a', dot: '#d97706' },
};

const CalendarPage = () => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Calendar view states
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDateStr, setSelectedDateStr] = useState(todayStr);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'agenda'
  const [events, setEvents] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Close modals on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (isAddModalOpen) setIsAddModalOpen(false);
        if (isEditModalOpen) setIsEditModalOpen(false);
        if (eventToDelete) setEventToDelete(null);
      }
    };
    if (isAddModalOpen || isEditModalOpen || eventToDelete) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddModalOpen, isEditModalOpen, eventToDelete]);

  // Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: todayStr,
    type: 'Hearing',
    time: '10:30 AM',
    matter: '',
    location: '',
    notes: '',
  });

  // Fetch events from backend DB
  const fetchEvents = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    setLoading(true);
    try {
      const res = await eventService.getAll();
      const list = res?.data || res;
      if (Array.isArray(list)) {
        setEvents(list.map((e) => ({ ...e, id: e._id || e.id })));
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.warn('Backend event service error:', err.message);
      setEvents([]);
    } finally {
      setLoading(false);
      if (isManual) {
        setRefreshing(false);
        toast.info('Calendar refreshed with latest hearings and events');
      }
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateStr(now.toISOString().split('T')[0]);
    toast.info('Navigated to Today');
  };

  // Calendar calculations
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesFilter =
        selectedFilter === 'All' ||
        (e.type && e.type.toLowerCase() === selectedFilter.toLowerCase());
      const matchesSearch =
        !searchQuery.trim() ||
        (e.title && e.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (e.matter && e.matter.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (e.location && e.location.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [events, selectedFilter, searchQuery]);

  // Selected date events
  const selectedDateEvents = useMemo(() => {
    return filteredEvents.filter((e) => e.date === selectedDateStr);
  }, [filteredEvents, selectedDateStr]);

  // Select day handler
  const handleSelectDay = (dayNum) => {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    setSelectedDateStr(dStr);
  };

  // Open modal with pre-selected date
  const handleOpenAddForDate = (dateToUse) => {
    setNewEvent({
      title: '',
      date: dateToUse || selectedDateStr || todayStr,
      type: 'Hearing',
      time: '10:30 AM',
      matter: '',
      location: '',
      notes: '',
    });
    setIsAddModalOpen(true);
  };

  // Handle Event Creation in Database with Automatic Refresh
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) {
      toast.error('Please enter an event or hearing title');
      return;
    }

    try {
      await eventService.create(newEvent);
      // Automatically refresh calendar events without browser reload
      await fetchEvents();
      setIsAddModalOpen(false);
      toast.success(`Event "${newEvent.title}" scheduled successfully!`);
    } catch (err) {
      console.warn('Backend save error, updating locally:', err.message);
      const created = {
        ...newEvent,
        id: `evt-${Date.now()}`,
      };
      setEvents((prev) => [...prev, created]);
      setIsAddModalOpen(false);
      toast.success(`Event "${newEvent.title}" scheduled!`);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (evt) => {
    setEditingEvent({
      ...evt,
      id: evt.id || evt._id,
      title: evt.title || '',
      date: evt.date || todayStr,
      type: evt.type || 'Hearing',
      time: evt.time || '10:30 AM',
      matter: evt.matter || '',
      location: evt.location || '',
      notes: evt.notes || '',
    });
    setIsEditModalOpen(true);
  };

  // Handle Event Edit in Database with Automatic Refresh
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingEvent || !editingEvent.title.trim()) return;

    const eventId = editingEvent.id || editingEvent._id;
    try {
      await eventService.update(eventId, editingEvent);
      // Automatically refresh calendar events
      await fetchEvents();
      setIsEditModalOpen(false);
      setEditingEvent(null);
      toast.success(`Event "${editingEvent.title}" updated successfully!`);
    } catch (err) {
      console.warn('Backend update error, updating locally:', err.message);
      setEvents((prev) =>
        prev.map((e) => ((e.id === eventId || e._id === eventId) ? { ...e, ...editingEvent } : e))
      );
      setIsEditModalOpen(false);
      setEditingEvent(null);
      toast.success(`Event updated!`);
    }
  };

  // Handle Event Deletion from Database with Automatic Refresh
  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);
    const id = eventToDelete.id || eventToDelete._id;

    try {
      await eventService.delete(id);
      // Automatically refresh calendar events
      await fetchEvents();
      toast.info(`Event "${eventToDelete.title}" deleted from calendar`);
    } catch (err) {
      console.warn('Failed to delete on server, removing locally:', err.message);
      setEvents((prev) => prev.filter((e) => e.id !== id && e._id !== id));
      toast.info(`Event removed`);
    } finally {
      setIsDeleting(false);
      setEventToDelete(null);
    }
  };

  // Build grid days
  const calendarCells = [];

  // 1. Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = prevMonthTotalDays - i;
    calendarCells.push({
      day: dayNum,
      isCurrentMonth: false,
      dateStr: null,
      events: [],
    });
  }

  // 2. Current month active days
  for (let dayNum = 1; dayNum <= totalDaysInMonth; dayNum++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const dayEvents = filteredEvents.filter((e) => e.date === dateStr);

    calendarCells.push({
      day: dayNum,
      isCurrentMonth: true,
      dateStr,
      events: dayEvents,
    });
  }

  // 3. Next month leading days to complete full weeks
  const remainingCells = 35 - calendarCells.length > 0 ? 35 - calendarCells.length : 42 - calendarCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({
      day: i,
      isCurrentMonth: false,
      dateStr: null,
      events: [],
    });
  }

  const selectedDateFormatted = useMemo(() => {
    if (!selectedDateStr) return '';
    try {
      const d = new Date(selectedDateStr + 'T00:00:00');
      return d.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return selectedDateStr;
    }
  }, [selectedDateStr]);

  return (
    <div
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        paddingBottom: '3.5rem',
      }}
    >
      {/* Top Banner (Matching modern workspace aesthetic) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#ede9fe',
              color: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CalendarIcon size={19} strokeWidth={2.2} />
          </div>
          <div>
            <h1
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#0f172a',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Court & Legal Calendar
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.77rem', margin: '0.1rem 0 0 0' }}>
              Hearings, filings, statutory deadlines, client meetings, and procedural reminders.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* View Mode Toggle */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: '#f1f5f9',
              padding: '3px',
              borderRadius: '8px',
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('month')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'month' ? '#ffffff' : 'transparent',
                color: viewMode === 'month' ? '#0f172a' : '#64748b',
                fontSize: '0.785rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: viewMode === 'month' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <Grid size={13} />
              <span>Month</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('agenda')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'agenda' ? '#ffffff' : 'transparent',
                color: viewMode === 'agenda' ? '#0f172a' : '#64748b',
                fontSize: '0.785rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: viewMode === 'agenda' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <List size={13} />
              <span>Agenda List</span>
            </button>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => fetchEvents(true)}
            disabled={refreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 0.95rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#334155',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              transition: 'all 0.18s ease',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
            }}
            onMouseEnter={(e) => {
              if (!refreshing) e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              if (!refreshing) e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            <RefreshCw
              size={14}
              color="#64748b"
              style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}
            />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          {/* Schedule Event Button */}
          <button
            type="button"
            onClick={() => handleOpenAddForDate(selectedDateStr)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1.15rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: '#4338ca',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(67, 56, 202, 0.25)',
              transition: 'background 0.18s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3730a3')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4338ca')}
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Navigation + Filters + Search */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '0.85rem 1.15rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        {/* Month Navigation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h2
            className="font-serif"
            style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              color: '#0f172a',
              margin: 0,
              minWidth: '190px',
            }}
          >
            {MONTH_NAMES[month]} {year}
          </h2>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <button
              type="button"
              onClick={handlePrevMonth}
              title="Previous Month"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              title="Next Month"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronRight size={16} />
            </button>
            <button
              type="button"
              onClick={handleJumpToToday}
              title="Jump to Current Date"
              style={{
                height: '32px',
                padding: '0 0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                fontSize: '0.8rem',
                fontWeight: 650,
                cursor: 'pointer',
                marginLeft: '0.2rem',
              }}
            >
              Today
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {['All', 'Hearing', 'Deadline', 'Task', 'Meeting'].map((tab) => {
              const isActive = selectedFilter.toLowerCase() === tab.toLowerCase();
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedFilter(tab)}
                  style={{
                    padding: '0.3rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: isActive ? '1px solid #0f172a' : '1px solid #e2e8f0',
                    backgroundColor: isActive ? '#0f172a' : '#ffffff',
                    color: isActive ? '#ffffff' : '#64748b',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={13} color="#94a3b8" style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Filter hearings or matters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.35rem 0.65rem 0.35rem 2rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.785rem',
                outline: 'none',
                backgroundColor: '#f8fafc',
              }}
            />
          </div>
        </div>
      </div>

      {viewMode === 'month' ? (
        /* 2-Column Grid Layout: Month Grid + Selected Date Docket Panel */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 380px',
            gap: '1.25rem',
            alignItems: 'start',
          }}
        >
          {/* Main Month Grid Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
            }}
          >
            {/* 7-Column Day Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                borderBottom: '1px solid #e2e8f0',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
              }}
            >
              {DAY_LABELS.map((day) => (
                <div
                  key={day}
                  style={{
                    padding: '0.65rem 0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#64748b',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid Cells */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
              }}
            >
              {calendarCells.map((cell, idx) => {
                const isSelected = cell.dateStr === selectedDateStr;
                const isToday = cell.dateStr === todayStr;

                return (
                  <div
                    key={idx}
                    onClick={() => cell.isCurrentMonth && handleSelectDay(cell.day)}
                    style={{
                      minHeight: '94px',
                      padding: '0.5rem',
                      borderRight: '1px solid #f1f5f9',
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: isSelected
                        ? '#f5f3ff'
                        : cell.isCurrentMonth
                        ? '#ffffff'
                        : '#fafafa',
                      cursor: cell.isCurrentMonth ? 'pointer' : 'default',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      position: 'relative',
                      transition: 'all 0.12s ease',
                      outline: isSelected ? '2px solid #4338ca' : 'none',
                      outlineOffset: '-2px',
                    }}
                    onMouseEnter={(e) => {
                      if (cell.isCurrentMonth && !isSelected) {
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (cell.isCurrentMonth && !isSelected) {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                      }
                    }}
                  >
                    {/* Day Number and Today Indicator */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.35rem',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.825rem',
                          fontWeight: isToday ? 750 : isSelected ? 700 : 500,
                          color: isToday
                            ? '#ffffff'
                            : isSelected
                            ? '#4338ca'
                            : cell.isCurrentMonth
                            ? '#334155'
                            : '#cbd5e1',
                          backgroundColor: isToday ? '#2563eb' : 'transparent',
                          width: isToday ? '22px' : 'auto',
                          height: isToday ? '22px' : 'auto',
                          borderRadius: isToday ? '50%' : '0',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {cell.day}
                      </span>

                      {cell.events?.length > 0 && (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            color: '#64748b',
                            backgroundColor: '#f1f5f9',
                            padding: '1px 5px',
                            borderRadius: '10px',
                          }}
                        >
                          {cell.events.length}
                        </span>
                      )}
                    </div>

                    {/* Day Events Badges */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {cell.events?.slice(0, 3).map((evt) => {
                        const styleCfg = EVENT_TYPE_COLORS[evt.type] || EVENT_TYPE_COLORS.Hearing;
                        return (
                          <div
                            key={evt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(evt);
                            }}
                            style={{
                              backgroundColor: styleCfg.bg,
                              color: styleCfg.text,
                              border: `1px solid ${styleCfg.border}`,
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              padding: '2px 5px',
                              borderRadius: '4px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                            title={`${evt.title} (${evt.time}) - Click to edit`}
                          >
                            <span
                              style={{
                                width: '5px',
                                height: '5px',
                                borderRadius: '50%',
                                backgroundColor: styleCfg.dot,
                                flexShrink: 0,
                              }}
                            />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {evt.title}
                            </span>
                          </div>
                        );
                      })}
                      {cell.events?.length > 3 && (
                        <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>
                          +{cell.events.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Docket of Selected Date */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '520px',
            }}
          >
            {/* Header */}
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                SCHEDULED HEARINGS & DOCKET
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0.2rem 0 0 0' }}>
                {selectedDateFormatted}
              </h3>
            </div>

            {/* Event List for Selected Date */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((evt) => {
                  const styleCfg = EVENT_TYPE_COLORS[evt.type] || EVENT_TYPE_COLORS.Hearing;
                  return (
                    <div
                      key={evt.id}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '0.85rem',
                        backgroundColor: '#ffffff',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <div>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: styleCfg.bg,
                              color: styleCfg.text,
                              border: `1px solid ${styleCfg.border}`,
                              marginBottom: '0.35rem',
                            }}
                          >
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: styleCfg.dot }} />
                            <span>{evt.type}</span>
                          </span>
                          <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                            {evt.title}
                          </h4>
                        </div>

                        {/* Edit and Delete Actions */}
                        <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(evt)}
                            title="Edit Event"
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '5px',
                              border: '1px solid #cbd5e1',
                              backgroundColor: '#ffffff',
                              color: '#475569',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEventToDelete(evt)}
                            title="Delete Event"
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '5px',
                              border: '1px solid #fecaca',
                              backgroundColor: '#ffffff',
                              color: '#dc2626',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Details: Time, Matter, Location */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.45rem', fontSize: '0.785rem', color: '#475569' }}>
                        {evt.time && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Clock size={13} color="#64748b" />
                            <span>{evt.time}</span>
                          </div>
                        )}
                        {evt.matter && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Briefcase size={13} color="#64748b" />
                            <span style={{ fontWeight: 600, color: '#1e293b' }}>{evt.matter}</span>
                          </div>
                        )}
                        {evt.location && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <MapPin size={13} color="#64748b" />
                            <span>{evt.location}</span>
                          </div>
                        )}
                        {evt.notes && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic', marginTop: '0.2rem', paddingLeft: '1.25rem' }}>
                            "{evt.notes}"
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div
                  style={{
                    padding: '2.5rem 1rem',
                    textAlign: 'center',
                    color: '#94a3b8',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CalendarCheck size={36} color="#cbd5e1" style={{ marginBottom: '0.75rem' }} />
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', margin: '0 0 0.25rem 0' }}>
                    No events scheduled for this date
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                    Click below to schedule a hearing, filing deadline, or meeting.
                  </p>
                </div>
              )}
            </div>

            {/* Add Event for this Date Button */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => handleOpenAddForDate(selectedDateStr)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem',
                  borderRadius: '7px',
                  backgroundColor: '#4338ca',
                  color: '#ffffff',
                  fontSize: '0.825rem',
                  fontWeight: 650,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Plus size={15} />
                <span>Add Event for this Date</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Agenda / All Hearings Chronological List View */
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Chronological Hearings & Filings Agenda ({filteredEvents.length})
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Showing all scheduled proceedings across active dockets
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredEvents.length > 0 ? (
              filteredEvents
                .slice()
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((evt) => {
                  const styleCfg = EVENT_TYPE_COLORS[evt.type] || EVENT_TYPE_COLORS.Hearing;
                  return (
                    <div
                      key={evt.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        {/* Date badge */}
                        <div
                          style={{
                            textAlign: 'center',
                            minWidth: '70px',
                            padding: '0.4rem',
                            backgroundColor: '#f8fafc',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                            {new Date(evt.date + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short' })}
                          </div>
                          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                            {new Date(evt.date + 'T00:00:00').getDate()}
                          </div>
                          <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                            {new Date(evt.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short' })}
                          </div>
                        </div>

                        {/* Event Information */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: '4px',
                                backgroundColor: styleCfg.bg,
                                color: styleCfg.text,
                                border: `1px solid ${styleCfg.border}`,
                              }}
                            >
                              {evt.type}
                            </span>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                              {evt.title}
                            </h4>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.785rem', color: '#64748b' }}>
                            {evt.time && <span>Time: {evt.time}</span>}
                            {evt.matter && <span>Matter: <strong>{evt.matter}</strong></span>}
                            {evt.location && <span>Venue: {evt.location}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(evt)}
                          style={{
                            padding: '0.35rem 0.65rem',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            backgroundColor: '#ffffff',
                            color: '#334155',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setEventToDelete(evt)}
                          style={{
                            padding: '0.35rem 0.65rem',
                            borderRadius: '6px',
                            border: '1px solid #fee2e2',
                            backgroundColor: '#ffffff',
                            color: '#dc2626',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                No events or hearings match your current criteria.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '1rem',
          }}
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '520px',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              border: '1px solid #e2e8f0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Schedule Court Event / Hearing
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                  Add a proceeding, trial hearing, or statutory deadline to your docket.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              {/* Event Title */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                  Event / Hearing Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. SLP Hearing - Acme vs ED"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                  required
                />
              </div>

              {/* Event Type and Date Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                    Event Category
                  </label>
                  <CustomSelect
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                    options={EVENT_TYPE_OPTIONS}
                    size="sm"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                    required
                  />
                </div>
              </div>

              {/* Time & Matter Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                    Listing Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10:30 AM"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                    Associated Matter / Docket
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Holdings Ltd vs ED"
                    value={newEvent.matter}
                    onChange={(e) => setNewEvent({ ...newEvent, matter: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Courtroom / Location */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                  Courtroom / Venue
                </label>
                <input
                  type="text"
                  placeholder="e.g. Supreme Court of India · Courtroom 3"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              {/* Notes */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                  Proceedings Notes / Brief
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Senior counsel appearing. Rejoinder affidavit to be handed over in physical court."
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '7px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '7px',
                    border: 'none',
                    backgroundColor: '#4338ca',
                    color: '#ffffff',
                    fontSize: '0.825rem',
                    fontWeight: 650,
                    cursor: 'pointer',
                  }}
                >
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {isEditModalOpen && editingEvent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '1rem',
          }}
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '520px',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              border: '1px solid #e2e8f0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Edit Event / Hearing
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                  Update details, hearing time, or courtroom listing.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              {/* Event Title */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                  Event / Hearing Title *
                </label>
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                  required
                />
              </div>

              {/* Event Type and Date Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                    Event Category
                  </label>
                  <CustomSelect
                    value={editingEvent.type}
                    onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value })}
                    options={EVENT_TYPE_OPTIONS}
                    size="sm"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                    required
                  />
                </div>
              </div>

              {/* Time & Matter Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                    Listing Time
                  </label>
                  <input
                    type="text"
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                    Associated Matter / Docket
                  </label>
                  <input
                    type="text"
                    value={editingEvent.matter}
                    onChange={(e) => setEditingEvent({ ...editingEvent, matter: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Courtroom / Location */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                  Courtroom / Venue
                </label>
                <input
                  type="text"
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              {/* Notes */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                  Proceedings Notes / Brief
                </label>
                <textarea
                  rows={2}
                  value={editingEvent.notes}
                  onChange={(e) => setEditingEvent({ ...editingEvent, notes: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '7px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '7px',
                    border: 'none',
                    backgroundColor: '#4338ca',
                    color: '#ffffff',
                    fontSize: '0.825rem',
                    fontWeight: 650,
                    cursor: 'pointer',
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(eventToDelete)}
        title="Delete Calendar Event"
        message={
          eventToDelete
            ? `Are you sure you want to delete "${eventToDelete.title}"? This event will be permanently removed from your calendar.`
            : ''
        }
        confirmText={isDeleting ? 'Deleting...' : 'Delete Event'}
        cancelText="Cancel"
        danger={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setEventToDelete(null)}
      />
    </div>
  );
};

export default CalendarPage;
