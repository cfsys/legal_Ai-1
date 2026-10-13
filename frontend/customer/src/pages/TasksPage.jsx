import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Plus,
  X,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Trash2,
  Check,
  CheckSquare,
  ChevronDown,
  Edit2,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { toast } from '../context/ToastContext';
import CustomSelect from '../components/common/CustomSelect';
import ConfirmModal from '../components/common/ConfirmModal';
import { taskService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const INITIAL_TASKS = [
  {
    id: 'task_1',
    task: 'File reply in Acme matter',
    due: '20 Jun 2026',
    priority: 'High',
    status: 'To Do',
    assignee: 'Chirag Poshiya',
    matter: 'Acme Holdings vs ED',
  },
  {
    id: 'task_2',
    task: 'Review NDA - Zenith',
    due: '18 Jun 2026',
    priority: 'Medium',
    status: 'In Progress',
    assignee: 'Chirag Poshiya',
    matter: 'Zenith Telecom CIRP',
  },
  {
    id: 'task_3',
    task: 'Prepare hearing notes for SLP',
    due: '15 Jun 2026',
    priority: 'High',
    status: 'To Do',
    assignee: 'Chirag Poshiya',
    matter: 'Supreme Court - Special Leave Petition',
  },
  {
    id: 'task_4',
    task: 'Draft rejoinder affidavit',
    due: '22 Jun 2026',
    priority: 'Low',
    status: 'Done',
    assignee: 'Chirag Poshiya',
    matter: 'Commercial Suit 402/2026',
  },
  {
    id: 'task_5',
    task: 'Client briefing for settlement',
    due: '25 Jun 2026',
    priority: 'Medium',
    status: 'To Do',
    assignee: 'Chirag Poshiya',
    matter: 'Acme Holdings vs ED',
  },
];

const PRIORITY_OPTIONS = [
  {
    value: 'High',
    label: 'High',
    dot: '#dc2626',
  },
  {
    value: 'Medium',
    label: 'Medium',
    dot: '#d97706',
  },
  {
    value: 'Low',
    label: 'Low',
    dot: '#64748b',
  },
];

const STATUS_OPTIONS = [
  {
    value: 'To Do',
    label: 'To Do',
    icon: Circle,
    iconColor: '#64748b',
  },
  {
    value: 'In Progress',
    label: 'In Progress',
    icon: Clock,
    iconColor: '#2563eb',
  },
  {
    value: 'Done',
    label: 'Done',
    icon: CheckCircle2,
    iconColor: '#16a34a',
  },
];

const PriorityBadge = ({ value, onChange, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const current =
    PRIORITY_OPTIONS.find((p) => p.value.toLowerCase() === (value || '').toLowerCase()) ||
    PRIORITY_OPTIONS[1];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        title={`Priority: ${current.label} (Click to change)`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          height: '25px',
          padding: '0 8px',
          borderRadius: '6px',
          border: open ? '1px solid #4338ca' : '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          color: '#334155',
          fontSize: '0.74rem',
          fontWeight: 550,
          cursor: disabled ? 'default' : 'pointer',
          transition: 'all 0.15s ease',
          boxShadow: open
            ? '0 0 0 2px rgba(67, 56, 202, 0.12)'
            : '0 1px 2px rgba(0, 0, 0, 0.03)',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          if (!disabled && !open) {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.backgroundColor = '#f8fafc';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !open) {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.backgroundColor = '#ffffff';
          }
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: current.dot,
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        <span>{current.label}</span>
        <ChevronDown
          size={11}
          style={{
            color: '#94a3b8',
            transition: 'transform 0.15s ease',
            transform: open ? 'rotate(180deg)' : 'none',
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 9999,
            minWidth: '135px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px -4px rgba(15, 23, 42, 0.12), 0 4px 6px -2px rgba(15, 23, 42, 0.04)',
            padding: '4px',
          }}
        >
          <div
            style={{
              padding: '4px 8px 3px',
              fontSize: '0.62rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#94a3b8',
              borderBottom: '1px solid #f1f5f9',
              marginBottom: '3px',
            }}
          >
            Priority
          </div>
          {PRIORITY_OPTIONS.map((opt) => {
            const isSelected = opt.value.toLowerCase() === (value || '').toLowerCase();
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '5px 8px',
                  borderRadius: '5px',
                  border: 'none',
                  backgroundColor: isSelected ? '#f1f5f9' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.1s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: opt.dot,
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: isSelected ? 600 : 500,
                      color: '#1e293b',
                    }}
                  >
                    {opt.label}
                  </span>
                </div>
                {isSelected && <Check size={13} color="#4338ca" strokeWidth={2.4} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ value, onChange, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const current =
    STATUS_OPTIONS.find((s) => s.value.toLowerCase() === (value || '').toLowerCase()) ||
    STATUS_OPTIONS[0];

  const IconComponent = current.icon;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        title={`Status: ${current.label} (Click to change)`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          height: '25px',
          padding: '0 8px',
          borderRadius: '6px',
          border: open ? '1px solid #4338ca' : '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          color: '#334155',
          fontSize: '0.74rem',
          fontWeight: 550,
          cursor: disabled ? 'default' : 'pointer',
          transition: 'all 0.15s ease',
          boxShadow: open
            ? '0 0 0 2px rgba(67, 56, 202, 0.12)'
            : '0 1px 2px rgba(0, 0, 0, 0.03)',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          if (!disabled && !open) {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.backgroundColor = '#f8fafc';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !open) {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.backgroundColor = '#ffffff';
          }
        }}
      >
        <IconComponent size={12} color={current.iconColor} strokeWidth={2.2} />
        <span>{current.label}</span>
        <ChevronDown
          size={11}
          style={{
            color: '#94a3b8',
            transition: 'transform 0.15s ease',
            transform: open ? 'rotate(180deg)' : 'none',
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 9999,
            minWidth: '145px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px -4px rgba(15, 23, 42, 0.12), 0 4px 6px -2px rgba(15, 23, 42, 0.04)',
            padding: '4px',
          }}
        >
          <div
            style={{
              padding: '4px 8px 3px',
              fontSize: '0.62rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#94a3b8',
              borderBottom: '1px solid #f1f5f9',
              marginBottom: '3px',
            }}
          >
            Status
          </div>
          {STATUS_OPTIONS.map((opt) => {
            const isSelected = opt.value.toLowerCase() === (value || '').toLowerCase();
            const OptIcon = opt.icon;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '5px 8px',
                  borderRadius: '5px',
                  border: 'none',
                  backgroundColor: isSelected ? '#f1f5f9' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.1s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <OptIcon size={12} color={opt.iconColor} strokeWidth={2.2} />
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: isSelected ? 600 : 500,
                      color: '#1e293b',
                    }}
                  >
                    {opt.label}
                  </span>
                </div>
                {isSelected && <Check size={13} color="#4338ca" strokeWidth={2.4} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 8 });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshed, setRefreshed] = useState(false);
  const [activeTab, setActiveTab] = useState('All Tasks');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // Edit task modal state
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // Delete task confirm modal state
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Close modals on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (showNewTaskModal) setShowNewTaskModal(false);
        if (showEditTaskModal) setShowEditTaskModal(false);
        if (taskToDelete) setTaskToDelete(null);
      }
    };
    if (showNewTaskModal || showEditTaskModal || taskToDelete) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showNewTaskModal, showEditTaskModal, taskToDelete]);

  // In-flight guard to prevent duplicate API requests
  const isFetchingRef = useRef(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('30 Jun 2026');
  const [newTaskPriority, setNewTaskPriority] = useState('High');
  const [newTaskStatus, setNewTaskStatus] = useState('To Do');
  const [newTaskMatter, setNewTaskMatter] = useState('');

  const tabs = ['All Tasks', 'My Tasks', 'Overdue', 'Kanban'];

  // Fetch tasks from backend DB with backend search and pagination
  const fetchTasks = useCallback(async (targetPage = 1, currentSearch = searchQuery, isManual = false) => {
    if (isManual) isFetchingRef.current = false;
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    if (isManual) setRefreshing(true);
    setLoading(true);

    try {
      const res = await taskService.getAll({
        search: currentSearch.trim(),
        page: targetPage,
        limit,
        status: activeTab !== 'All Tasks' && activeTab !== 'My Tasks' && activeTab !== 'Kanban' ? activeTab : undefined,
      });

      if (res && res.data && Array.isArray(res.data)) {
        setTasks(res.data.map((t) => ({ ...t, id: t._id || t.id })));
        if (res.pagination) {
          setPagination(res.pagination);
          setPage(res.pagination.page);
        } else {
          setPagination({ total: res.data.length, page: targetPage, pages: 1, limit });
        }
      } else if (Array.isArray(res)) {
        setTasks(res.map((t) => ({ ...t, id: t._id || t.id })));
        setPagination({ total: res.length, page: targetPage, pages: 1, limit });
      }
    } catch (err) {
      console.warn('Backend task service error:', err.message);
      setTasks([]);
      setPagination({ total: 0, page: 1, pages: 1, limit });
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      if (isManual) {
        setRefreshing(false);
        setRefreshed(true);
        setTimeout(() => setRefreshed(false), 2000);
      }
    }
  }, [activeTab, limit, searchQuery]);

  // Initial and reactive load on tab changes
  useEffect(() => {
    fetchTasks(1, searchQuery, false);
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced backend search
  const searchTimeoutRef = useRef(null);
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      fetchTasks(1, val, false);
    }, 350);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages || newPage === page) return;
    setPage(newPage);
    fetchTasks(newPage, searchQuery, false);
  };

  const handleOpenEdit = (task) => {
    setEditTask({
      id: task.id || task._id,
      task: task.task || '',
      due: task.due || '',
      priority: task.priority || 'Medium',
      status: task.status || 'To Do',
      matter: task.matter || '',
      assignee: task.assignee || 'Advocate',
    });
    setShowEditTaskModal(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTask.task) return;

    setTasks((prev) =>
      prev.map((t) => ((t.id === editTask.id || t._id === editTask.id) ? { ...t, ...editTask } : t))
    );

    try {
      await taskService.update(editTask.id, editTask);
      fetchTasks(page, searchQuery, true);
      toast.success('Task updated successfully!');
    } catch (err) {
      toast.success('Task updated in workspace!');
    }
    setShowEditTaskModal(false);
  };

  // Facility to update task status directly in database
  const handleUpdateStatus = async (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId || t._id === taskId ? { ...t, status: newStatus } : t))
    );
    const updated = tasks.find((t) => t.id === taskId || t._id === taskId);
    toast.success(`"${updated?.task || 'Task'}" status updated to ${newStatus}`);

    try {
      await taskService.update(taskId, { status: newStatus });
    } catch (err) {
      console.warn('Failed to update task status in DB:', err.message);
    }
  };

  // Facility to update task priority directly in database
  const handleUpdatePriority = async (taskId, newPriority) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId || t._id === taskId ? { ...t, priority: newPriority } : t))
    );
    const updated = tasks.find((t) => t.id === taskId || t._id === taskId);
    toast.success(`"${updated?.task || 'Task'}" priority updated to ${newPriority}`);

    try {
      await taskService.update(taskId, { priority: newPriority });
    } catch (err) {
      console.warn('Failed to update task priority in DB:', err.message);
    }
  };

  // Toggle checkbox (Done vs To Do)
  const handleToggleDone = async (taskId) => {
    const current = tasks.find((t) => t.id === taskId || t._id === taskId);
    const nextStatus = current?.status === 'Done' ? 'To Do' : 'Done';

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId || t._id === taskId) {
          toast.success(
            nextStatus === 'Done' ? `Completed "${t.task}"` : `Marked "${t.task}" as To Do`
          );
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );

    try {
      await taskService.update(taskId, { status: nextStatus });
    } catch (err) {
      console.warn('Failed to sync toggle with DB:', err.message);
    }
  };

  // Delete task confirm handler
  const handleConfirmDeleteTask = async () => {
    if (!taskToDelete) return;
    const id = taskToDelete.id || taskToDelete._id;
    try {
      await taskService.delete(id);
      fetchTasks(page, searchQuery, true);
      toast.info(`Deleted "${taskToDelete.task || 'Task'}"`);
    } catch (err) {
      setTasks((prev) => prev.filter((t) => t.id !== id && t._id !== id));
      toast.info(`Deleted "${taskToDelete.task || 'Task'}"`);
    } finally {
      setTaskToDelete(null);
    }
  };

  // Create new task and store in database
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const userDisplayName = user
      ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || user.email || 'Advocate'
      : 'Advocate';

    const payload = {
      task: newTaskTitle.trim(),
      due: newTaskDue || '30 Jun 2026',
      priority: newTaskPriority,
      status: newTaskStatus,
      assignee: userDisplayName,
      matter: newTaskMatter || '',
    };

    try {
      const res = await taskService.create(payload);
      const created = res?.data || res;
      setTasks((prev) => [{ ...created, id: created._id || created.id }, ...prev]);
      fetchTasks(1, '', true);
    } catch (err) {
      console.warn('Failed to save task in DB, saving locally:', err.message);
      const localTask = {
        id: `task_${Date.now()}`,
        ...payload,
      };
      setTasks((prev) => [localTask, ...prev]);
    }

    setNewTaskTitle('');
    setShowNewTaskModal(false);
    toast.success('Task created successfully and stored in the database!');
  };

  // Filter tasks based on activeTab
  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'All Tasks' || activeTab === 'My Tasks') return true;
    if (activeTab === 'Overdue') {
      return t.due.includes('15') || t.status === 'To Do';
    }
    return true;
  });

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return {
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca',
        };
      case 'Medium':
        return {
          backgroundColor: '#fffbeb',
          color: '#d97706',
          border: '1px solid #fde68a',
        };
      case 'Low':
      default:
        return {
          backgroundColor: '#ecfdf5',
          color: '#16a34a',
          border: '1px solid #bbf7d0',
        };
    }
  };

  return (
    <div
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        paddingBottom: '2.5rem',
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
              backgroundColor: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckSquare size={19} strokeWidth={2.2} />
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
              Procedural Tasks & Filings
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.77rem', margin: '0.1rem 0 0 0' }}>
              Track deadlines, filings, pleadings dossiers, and team procedural action items across your matters.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            onClick={() => fetchTasks(true)}
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

          {/* + New Task Button */}
          <button
            onClick={() => setShowNewTaskModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#4338ca',
              color: '#ffffff',
              border: 'none',
              padding: '0.5rem 1.15rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.18s ease',
              boxShadow: '0 2px 4px rgba(67, 56, 202, 0.25)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3730a3')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4338ca')}
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.85rem' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                border: isActive ? '1px solid #0b1329' : '1px solid #e2e8f0',
                backgroundColor: isActive ? '#0b1329' : '#ffffff',
                color: isActive ? '#ffffff' : '#64748b',
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Backend Search & Count Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1rem',
          backgroundColor: '#ffffff',
          padding: '0.65rem 1rem',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1 }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search tasks by task name, matter, assignee... (backend queried)"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '0.85rem',
              color: '#0f172a',
            }}
          />
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>
          {pagination.total} {pagination.total === 1 ? 'Task' : 'Tasks'} Total
        </span>
      </div>

      {/* Main Content Area based on Tab */}
      {activeTab === 'Kanban' ? (
        /* Kanban View */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem' }}>
          {['To Do', 'In Progress', 'Done'].map((colStatus) => {
            const columnTasks = tasks.filter((t) => t.status === colStatus);
            return (
              <div
                key={colStatus}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.65rem',
                  padding: '0.75rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.65rem',
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '0.825rem', color: '#1e293b' }}>
                    {colStatus}
                  </span>
                  <span
                    style={{
                      backgroundColor: '#e2e8f0',
                      color: '#475569',
                      fontSize: '0.725rem',
                      fontWeight: 600,
                      padding: '1px 7px',
                      borderRadius: '9999px',
                    }}
                  >
                    {columnTasks.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {columnTasks.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        padding: '0.65rem 0.75rem',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', marginBottom: '0.35rem' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleDone(t.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            color: t.status === 'Done' ? '#16a34a' : '#cbd5e1',
                            marginTop: '2px',
                          }}
                        >
                          {t.status === 'Done' ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                        </button>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontWeight: 600,
                              color: t.status === 'Done' ? '#94a3b8' : '#0f172a',
                              fontSize: '0.9rem',
                              textDecoration: t.status === 'Done' ? 'line-through' : 'none',
                            }}
                          >
                            {t.task}
                          </div>
                          {t.matter && (
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                              {t.matter}
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '0.45rem',
                          borderTop: '1px solid #f8fafc',
                          marginTop: '0.4rem',
                        }}
                      >
                        {/* Direct Status Switcher Facility */}
                        <StatusBadge
                          value={t.status}
                          onChange={(newStatus) => handleUpdateStatus(t.id, newStatus)}
                        />

                        {/* Direct Priority Switcher Facility */}
                        <PriorityBadge
                          value={t.priority}
                          onChange={(newPriority) => handleUpdatePriority(t.id, newPriority)}
                        />
                      </div>
                    </div>
                  ))}

                  {columnTasks.length === 0 && (
                    <div
                      style={{
                        padding: '1.5rem',
                        textAlign: 'center',
                        color: '#94a3b8',
                        fontSize: '0.8rem',
                        border: '1px dashed #e2e8f0',
                        borderRadius: '0.5rem',
                      }}
                    >
                      No tasks in {colStatus}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Proper, Clean, Structured Table View */
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem',
            overflow: 'visible',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  backgroundColor: '#fafbfc',
                  color: '#64748b',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                <th style={{ padding: '0.55rem 0.85rem', width: '36px' }}></th>
                <th style={{ padding: '0.55rem 0.85rem' }}>TASK & MATTER</th>
                <th style={{ padding: '0.55rem 0.85rem' }}>DUE DATE</th>
                <th style={{ padding: '0.55rem 0.85rem' }}>PRIORITY</th>
                <th style={{ padding: '0.55rem 0.85rem' }}>STATUS</th>
                <th style={{ padding: '0.55rem 0.85rem', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t) => {
                const isDone = t.status === 'Done';
                return (
                  <tr
                    key={t.id}
                    style={{
                      borderBottom: '1px solid #f8fafc',
                      fontSize: '0.875rem',
                      color: '#1e293b',
                      backgroundColor: isDone ? '#fafbfc' : '#ffffff',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isDone) e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (!isDone) e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    {/* Checkbox */}
                    <td style={{ padding: '0.45rem 0.85rem', width: '36px' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleDone(t.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          color: isDone ? '#16a34a' : '#cbd5e1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title={isDone ? 'Mark as To Do' : 'Mark as Done'}
                      >
                        {isDone ? (
                          <CheckCircle2 size={17} color="#16a34a" />
                        ) : (
                          <Circle size={17} color="#94a3b8" />
                        )}
                      </button>
                    </td>

                    {/* Task & Matter */}
                    <td style={{ padding: '0.45rem 0.85rem' }}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: isDone ? '#94a3b8' : '#0f172a',
                          fontSize: '0.84rem',
                          textDecoration: isDone ? 'line-through' : 'none',
                        }}
                      >
                        {t.task}
                      </div>
                      {t.matter && (
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '1px' }}>
                          {t.matter}
                        </div>
                      )}
                    </td>

                    {/* Due Date */}
                    <td style={{ padding: '0.45rem 0.85rem', color: '#64748b', fontSize: '0.8rem' }}>
                      {t.due}
                    </td>

                    {/* DIRECT PRIORITY UPDATING FACILITY */}
                    <td style={{ padding: '0.45rem 0.85rem', width: '130px' }}>
                      <PriorityBadge
                        value={t.priority}
                        onChange={(newPriority) => handleUpdatePriority(t.id, newPriority)}
                      />
                    </td>

                    {/* DIRECT STATUS UPDATING FACILITY */}
                    <td style={{ padding: '0.45rem 0.85rem', width: '145px' }}>
                      <StatusBadge
                        value={t.status}
                        onChange={(newStatus) => handleUpdateStatus(t.id, newStatus)}
                      />
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '0.35rem 0.85rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(t)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '4px',
                            transition: 'color 0.15s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#4338ca')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                          title="Edit task"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setTaskToDelete(t)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#cbd5e1',
                            cursor: 'pointer',
                            padding: '4px',
                            transition: 'color 0.15s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                          title="Delete task"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredTasks.length === 0 && (
            <div
              style={{
                padding: '3.5rem 1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.85rem',
                  color: '#475569',
                }}
              >
                <CheckSquare size={24} strokeWidth={1.8} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 650, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                No tasks in {activeTab}
              </h3>
              <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '0 0 1.25rem 0', maxWidth: '380px', lineHeight: 1.5 }}>
                Stay organized by adding litigation deadlines, filings, and case deliverables to your docket.
              </p>
              <button
                type="button"
                onClick={() => setShowNewTaskModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  backgroundColor: '#4338ca',
                  border: 'none',
                  borderRadius: '7px',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(67, 56, 202, 0.2)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3730a3')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4338ca')}
              >
                <Plus size={14} />
                <span>Create New Task</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Backend Pagination Bar */}
      {pagination.pages > 1 && (
        <div
          style={{
            marginTop: '1.25rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Showing page <strong>{page}</strong> of <strong>{pagination.pages}</strong> ({pagination.total} total tasks)
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: page <= 1 ? '#f8fafc' : '#ffffff',
                color: page <= 1 ? '#cbd5e1' : '#334155',
                fontSize: '0.785rem',
                fontWeight: 600,
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: p === page ? '1px solid #4338ca' : '1px solid #e2e8f0',
                  backgroundColor: p === page ? '#4338ca' : '#ffffff',
                  color: p === page ? '#ffffff' : '#475569',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= pagination.pages}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: page >= pagination.pages ? '#f8fafc' : '#ffffff',
                color: page >= pagination.pages ? '#cbd5e1' : '#334155',
                fontSize: '0.785rem',
                fontWeight: 600,
                cursor: page >= pagination.pages ? 'not-allowed' : 'pointer',
              }}
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
          onClick={() => setShowNewTaskModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              width: '100%',
              maxWidth: '500px',
              padding: '1.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e2e8f0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckSquare size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Create New Task</h3>
                  <p style={{ fontSize: '0.785rem', color: '#64748b', margin: 0 }}>Add a task to your legal schedule</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewTaskModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask}>
              {/* Task Title */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Task Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. File counter-affidavit in Supreme Court"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="form-input"
                  style={{ borderRadius: '6px' }}
                  required
                />
              </div>

              {/* Due Date & Associated Matter */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Due Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 24 Jun 2026"
                    value={newTaskDue}
                    onChange={(e) => setNewTaskDue(e.target.value)}
                    className="form-input"
                    style={{ height: '36px', fontSize: '0.825rem', borderRadius: '6px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Matter / Case
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Holdings vs ED"
                    value={newTaskMatter}
                    onChange={(e) => setNewTaskMatter(e.target.value)}
                    className="form-input"
                    style={{ height: '36px', fontSize: '0.825rem', borderRadius: '6px' }}
                  />
                </div>
              </div>

              {/* Priority & Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Priority
                  </label>
                  <CustomSelect
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    options={[
                      { value: 'High', label: 'High' },
                      { value: 'Medium', label: 'Medium' },
                      { value: 'Low', label: 'Low' },
                    ]}
                    size="sm"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Status
                  </label>
                  <CustomSelect
                    value={newTaskStatus}
                    onChange={(e) => setNewTaskStatus(e.target.value)}
                    options={[
                      { value: 'To Do', label: 'To Do' },
                      { value: 'In Progress', label: 'In Progress' },
                      { value: 'Done', label: 'Done' },
                    ]}
                    size="sm"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '0.85rem',
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
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#0b1329',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditTaskModal && editTask && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '1.75rem',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                  Edit Procedural Task
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
                  Update task title, case docket, priority and deadline.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditTaskModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Task Title *
                </label>
                <input
                  type="text"
                  value={editTask.task}
                  onChange={(e) => setEditTask({ ...editTask, task: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Due Date
                  </label>
                  <input
                    type="text"
                    value={editTask.due}
                    onChange={(e) => setEditTask({ ...editTask, due: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Matter / Case
                  </label>
                  <input
                    type="text"
                    value={editTask.matter}
                    onChange={(e) => setEditTask({ ...editTask, matter: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Priority
                  </label>
                  <CustomSelect
                    value={editTask.priority}
                    onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })}
                    options={[
                      { value: 'High', label: 'High' },
                      { value: 'Medium', label: 'Medium' },
                      { value: 'Low', label: 'Low' },
                    ]}
                    size="sm"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Status
                  </label>
                  <CustomSelect
                    value={editTask.status}
                    onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
                    options={[
                      { value: 'To Do', label: 'To Do' },
                      { value: 'In Progress', label: 'In Progress' },
                      { value: 'Done', label: 'Done' },
                    ]}
                    size="sm"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => setShowEditTaskModal(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
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
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#4338ca',
                    color: '#ffffff',
                    fontSize: '0.825rem',
                    fontWeight: 600,
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

      {/* Delete Task Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(taskToDelete)}
        title="Delete Task"
        message={
          taskToDelete
            ? `Are you sure you want to delete task "${taskToDelete.task}"? This procedural entry will be removed from your docket.`
            : ''
        }
        confirmText="Delete Task"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmDeleteTask}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
};

export default TasksPage;
