const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String, // 'YYYY-MM-DD'
      required: true,
    },
    type: {
      type: String,
      enum: ['Hearing', 'Deadline', 'Task', 'Meeting'],
      default: 'Task',
    },
    time: {
      type: String,
      default: '10:00 AM',
    },
    matter: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
