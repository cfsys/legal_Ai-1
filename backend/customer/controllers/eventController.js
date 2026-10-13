const CalendarEvent = require('../models/CalendarEvent');
const { getIsMongooseConnected } = require('../config/db');
const { memoryStore, defaultEvents } = require('../services/storage');
const APP_STRINGS = require('../constants/appStrings');
const { sendSuccess, sendError } = require('../middleware/responseHandler');

// @desc    Get all calendar events for current user
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (getIsMongooseConnected()) {
      const events = await CalendarEvent.find({ user: userId }).sort({ date: 1 });
      return sendSuccess(res, events, 'Calendar events retrieved successfully');
    } else {
      const userEvents = memoryStore.events.filter(
        (e) => (e.user?.toString() || e.userId?.toString()) === userId.toString()
      );
      return sendSuccess(res, userEvents, 'Calendar events retrieved successfully');
    }
  } catch (error) {
    return sendError(res, error.message || APP_STRINGS.EVENT.FETCH_FAILED, 500, error);
  }
};

// @desc    Create a calendar event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    const { title, date, type, time, matter, location, notes } = req.body;
    const userId = req.user._id || req.user.id;

    if (!title || !date) {
      return sendError(res, APP_STRINGS.EVENT.TITLE_DATE_REQUIRED, 400);
    }

    if (getIsMongooseConnected()) {
      const newEvent = await CalendarEvent.create({
        user: userId,
        title: title.trim(),
        date,
        type: type || 'Task',
        time: time || '10:00 AM',
        matter: matter || '',
        location: location || '',
        notes: notes || '',
      });
      return sendSuccess(res, newEvent, APP_STRINGS.EVENT.CREATE_SUCCESS, 201);
    } else {
      const newEvent = {
        _id: `evt_${Date.now()}`,
        userId: userId.toString(),
        title: title.trim(),
        date,
        type: type || 'Task',
        time: time || '10:00 AM',
        matter: matter || '',
        location: location || '',
        notes: notes || '',
        createdAt: new Date().toISOString(),
      };
      memoryStore.events.push(newEvent);
      return sendSuccess(res, newEvent, APP_STRINGS.EVENT.CREATE_SUCCESS, 201);
    }
  } catch (error) {
    return sendError(res, error.message || APP_STRINGS.EVENT.CREATE_FAILED, 500, error);
  }
};

// @desc    Update a calendar event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, type, time, matter, location, notes } = req.body;
    const userId = req.user._id || req.user.id;

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (date !== undefined) updateFields.date = date;
    if (type !== undefined) updateFields.type = type;
    if (time !== undefined) updateFields.time = time;
    if (matter !== undefined) updateFields.matter = matter;
    if (location !== undefined) updateFields.location = location;
    if (notes !== undefined) updateFields.notes = notes;

    if (getIsMongooseConnected()) {
      let updatedEvent = await CalendarEvent.findOneAndUpdate(
        { _id: id, user: userId },
        { $set: updateFields },
        { new: true }
      );

      if (!updatedEvent) {
        updatedEvent = await CalendarEvent.findByIdAndUpdate(
          id,
          { $set: updateFields },
          { new: true }
        );
      }

      if (!updatedEvent) {
        return sendError(res, APP_STRINGS.EVENT.NOT_FOUND, 404);
      }

      return sendSuccess(res, updatedEvent, APP_STRINGS.EVENT.UPDATE_SUCCESS);
    } else {
      const eventIndex = memoryStore.events.findIndex((e) => e._id.toString() === id.toString());
      if (eventIndex === -1) {
        return sendError(res, APP_STRINGS.EVENT.NOT_FOUND, 404);
      }

      memoryStore.events[eventIndex] = {
        ...memoryStore.events[eventIndex],
        ...updateFields,
        updatedAt: new Date().toISOString(),
      };

      return sendSuccess(res, memoryStore.events[eventIndex], APP_STRINGS.EVENT.UPDATE_SUCCESS);
    }
  } catch (error) {
    return sendError(res, error.message || APP_STRINGS.EVENT.UPDATE_FAILED, 500, error);
  }
};

// @desc    Delete a calendar event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    if (getIsMongooseConnected()) {
      let deleted = await CalendarEvent.findOneAndDelete({ _id: id, user: userId });
      if (!deleted) {
        deleted = await CalendarEvent.findByIdAndDelete(id);
      }

      if (!deleted) {
        return sendError(res, APP_STRINGS.EVENT.NOT_FOUND, 404);
      }

      return sendSuccess(res, { id }, APP_STRINGS.EVENT.DELETE_SUCCESS);
    } else {
      const eventIndex = memoryStore.events.findIndex((e) => e._id.toString() === id.toString());
      if (eventIndex === -1) {
        return sendError(res, APP_STRINGS.EVENT.NOT_FOUND, 404);
      }

      memoryStore.events.splice(eventIndex, 1);
      return sendSuccess(res, { id }, APP_STRINGS.EVENT.DELETE_SUCCESS);
    }
  } catch (error) {
    return sendError(res, error.message || APP_STRINGS.EVENT.DELETE_FAILED, 500, error);
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
