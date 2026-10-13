const Task = require('../models/Task');
const { getIsMongooseConnected } = require('../config/db');
const { memoryStore, defaultTasks } = require('../services/storage');
const APP_STRINGS = require('../constants/appStrings');
const { sendSuccess, sendError } = require('../middleware/responseHandler');
const logger = require('../utils/logger');
const { escapeRegex } = require('../utils/sanitize');

// @desc    Get all tasks for current user
// @route   GET /api/tasks
// @access  Private
// @desc    Get all tasks for current user with backend search and pagination
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { search, q, status, priority, page, limit } = req.query;
    const searchQuery = (search || q || '').trim();
    const hasPagination = page !== undefined || limit !== undefined;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    if (getIsMongooseConnected()) {
      const filter = { user: userId };
      if (searchQuery) {
        const regex = new RegExp(escapeRegex(searchQuery), 'i');
        filter.$or = [
          { task: regex },
          { matter: regex },
          { assignee: regex },
          { due: regex },
        ];
      }
      if (status && status !== 'All Tasks' && status !== 'All') {
        filter.status = status;
      }
      if (priority && priority !== 'All') {
        filter.priority = priority;
      }

      const total = await Task.countDocuments(filter);
      const query = Task.find(filter).sort({ createdAt: -1 });
      if (hasPagination) {
        query.skip(skip).limit(limitNum);
      }
      const tasks = await query;
      logger.info('Tasks', `Retrieved ${tasks.length} tasks for user: ${req.user.email} (search: "${searchQuery}", page: ${pageNum})`);

      if (hasPagination) {
        return sendSuccess(res, {
          data: tasks,
          pagination: {
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum) || 1,
            limit: limitNum,
          },
        }, 'Tasks retrieved successfully');
      }

      return sendSuccess(res, tasks, 'Tasks retrieved successfully');
    } else {
      let userTasks = memoryStore.tasks.filter(
        (t) => (t.user?.toString() || t.userId?.toString()) === userId.toString()
      );
      if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        userTasks = userTasks.filter((t) =>
          (t.task || '').toLowerCase().includes(lowerQ) ||
          (t.matter || '').toLowerCase().includes(lowerQ) ||
          (t.assignee || '').toLowerCase().includes(lowerQ)
        );
      }
      if (status && status !== 'All Tasks' && status !== 'All') {
        userTasks = userTasks.filter((t) => t.status === status);
      }
      const total = userTasks.length;
      if (hasPagination) {
        const paginated = userTasks.slice(skip, skip + limitNum);
        return sendSuccess(res, {
          data: paginated,
          pagination: {
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum) || 1,
            limit: limitNum,
          },
        }, 'Tasks retrieved successfully');
      }
      return sendSuccess(res, userTasks, 'Tasks retrieved successfully');
    }
  } catch (error) {
    logger.error('Tasks', 'Failed to retrieve tasks', error);
    return sendError(res, error.message || APP_STRINGS.TASK.FETCH_FAILED, 500, error);
  }
};


// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { task, due, priority, status, assignee, matter } = req.body;
    const userId = req.user._id || req.user.id;

    if (!task || !task.trim()) {
      return sendError(res, APP_STRINGS.TASK.TASK_REQUIRED, 400);
    }

    if (getIsMongooseConnected()) {
      const newTask = await Task.create({
        user: userId,
        task: task.trim(),
        due: due || '30 Jun 2026',
        priority: priority || 'Medium',
        status: status || 'To Do',
        assignee: assignee || 'Chirag Poshiya',
        matter: matter || 'General Litigation',
      });
      logger.info('Tasks', `Created task in MongoDB: "${task.trim()}" (Priority: ${priority || 'Medium'}) for user: ${req.user.email}`);
      return sendSuccess(res, newTask, APP_STRINGS.TASK.CREATE_SUCCESS, 201);
    } else {
      const newTask = {
        _id: `task_${Date.now()}`,
        userId: userId.toString(),
        task: task.trim(),
        due: due || '30 Jun 2026',
        priority: priority || 'Medium',
        status: status || 'To Do',
        assignee: assignee || 'Chirag Poshiya',
        matter: matter || 'General Litigation',
        createdAt: new Date().toISOString(),
      };
      memoryStore.tasks.unshift(newTask);
      logger.info('Tasks', `Created task in memory-store: "${task.trim()}" (Priority: ${priority || 'Medium'}) for user: ${req.user.email}`);
      return sendSuccess(res, newTask, APP_STRINGS.TASK.CREATE_SUCCESS, 201);
    }
  } catch (error) {
    logger.error('Tasks', 'Failed to create task', error);
    return sendError(res, error.message || APP_STRINGS.TASK.CREATE_FAILED, 500, error);
  }
};

// @desc    Update a task (status, priority, etc.)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { task, due, priority, status, assignee, matter } = req.body;
    const userId = req.user._id || req.user.id;

    const updateFields = {};
    if (task !== undefined) updateFields.task = task;
    if (due !== undefined) updateFields.due = due;
    if (priority !== undefined) updateFields.priority = priority;
    if (status !== undefined) updateFields.status = status;
    if (assignee !== undefined) updateFields.assignee = assignee;
    if (matter !== undefined) updateFields.matter = matter;

    if (getIsMongooseConnected()) {
      let updatedTask = await Task.findOneAndUpdate(
        { _id: id, user: userId },
        { $set: updateFields },
        { new: true }
      );

      // If not found by user, try finding by id directly if admin or created earlier
      if (!updatedTask) {
        updatedTask = await Task.findByIdAndUpdate(
          id,
          { $set: updateFields },
          { new: true }
        );
      }

      if (!updatedTask) {
        logger.warn('Tasks', `Task ${id} not found for update`);
        return sendError(res, APP_STRINGS.TASK.NOT_FOUND, 404);
      }

      logger.info('Tasks', `Updated task ${id} fields: [${Object.keys(updateFields).join(', ')}] for user: ${req.user.email}`);
      return sendSuccess(res, updatedTask, APP_STRINGS.TASK.UPDATE_SUCCESS);
    } else {
      const taskIndex = memoryStore.tasks.findIndex((t) => t._id.toString() === id.toString());
      if (taskIndex === -1) {
        logger.warn('Tasks', `Memory-store task ${id} not found for update`);
        return sendError(res, APP_STRINGS.TASK.NOT_FOUND, 404);
      }

      memoryStore.tasks[taskIndex] = {
        ...memoryStore.tasks[taskIndex],
        ...updateFields,
        updatedAt: new Date().toISOString(),
      };

      logger.info('Tasks', `Updated memory-store task ${id} fields: [${Object.keys(updateFields).join(', ')}] for user: ${req.user.email}`);
      return sendSuccess(res, memoryStore.tasks[taskIndex], APP_STRINGS.TASK.UPDATE_SUCCESS);
    }
  } catch (error) {
    logger.error('Tasks', `Failed to update task ${req.params.id}`, error);
    return sendError(res, error.message || APP_STRINGS.TASK.UPDATE_FAILED, 500, error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    if (getIsMongooseConnected()) {
      let deleted = await Task.findOneAndDelete({ _id: id, user: userId });
      if (!deleted) {
        deleted = await Task.findByIdAndDelete(id);
      }

      if (!deleted) {
        logger.warn('Tasks', `Task ${id} not found for deletion`);
        return sendError(res, APP_STRINGS.TASK.NOT_FOUND, 404);
      }

      logger.info('Tasks', `Deleted task ${id} for user: ${req.user.email}`);
      return sendSuccess(res, { id }, APP_STRINGS.TASK.DELETE_SUCCESS);
    } else {
      const taskIndex = memoryStore.tasks.findIndex((t) => t._id.toString() === id.toString());
      if (taskIndex === -1) {
        logger.warn('Tasks', `Memory-store task ${id} not found for deletion`);
        return sendError(res, APP_STRINGS.TASK.NOT_FOUND, 404);
      }

      memoryStore.tasks.splice(taskIndex, 1);
      logger.info('Tasks', `Deleted memory-store task ${id} for user: ${req.user.email}`);
      return sendSuccess(res, { id }, APP_STRINGS.TASK.DELETE_SUCCESS);
    }
  } catch (error) {
    logger.error('Tasks', `Failed to delete task ${req.params.id}`, error);
    return sendError(res, error.message || APP_STRINGS.TASK.DELETE_FAILED, 500, error);
  }
};


module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
